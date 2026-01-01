import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { prayerRequests, prayerInteractions } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await db
      .insert(prayerInteractions)
      .values({
        prayerRequestId: id,
        userId: session.user.id,
      })
      .onConflictDoNothing();

    await db
      .update(prayerRequests)
      .set({
        prayerCount: sql`${prayerRequests.prayerCount} + 1`,
      })
      .where(eq(prayerRequests.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording prayer:", error);
    return NextResponse.json({ error: "Failed to record prayer" }, { status: 500 });
  }
}
