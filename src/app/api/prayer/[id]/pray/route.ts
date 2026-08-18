import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { prayerRequests, prayerInteractions } from "@/lib/schema";
import { and, eq, sql } from "drizzle-orm";

interface Context {
  params: Promise<{ id: string }>;
}

// POST - Toggle "I prayed for this" for the current user
export async function POST(request: NextRequest, context: Context) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: prayerRequestId } = await context.params;

    const [existing] = await db
      .select()
      .from(prayerInteractions)
      .where(and(eq(prayerInteractions.prayerRequestId, prayerRequestId), eq(prayerInteractions.userId, session.user.id)))
      .limit(1);

    let hasPrayed: boolean;
    if (existing) {
      await db.delete(prayerInteractions).where(eq(prayerInteractions.id, existing.id));
      await db
        .update(prayerRequests)
        .set({ prayerCount: sql`greatest(${prayerRequests.prayerCount} - 1, 0)` })
        .where(eq(prayerRequests.id, prayerRequestId));
      hasPrayed = false;
    } else {
      await db.insert(prayerInteractions).values({ prayerRequestId, userId: session.user.id });
      await db
        .update(prayerRequests)
        .set({ prayerCount: sql`${prayerRequests.prayerCount} + 1` })
        .where(eq(prayerRequests.id, prayerRequestId));
      hasPrayed = true;
    }

    const [updated] = await db.select().from(prayerRequests).where(eq(prayerRequests.id, prayerRequestId)).limit(1);

    return NextResponse.json({ hasPrayed, prayerCount: updated?.prayerCount ?? 0 });
  } catch (error) {
    console.error("Prayer Interaction Error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
