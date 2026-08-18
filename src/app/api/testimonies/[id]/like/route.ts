import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { testimonies, testimonyLikes } from "@/lib/schema";
import { and, eq, sql } from "drizzle-orm";

interface Context {
  params: Promise<{ id: string }>;
}

// POST - Toggle a like on a testimony
export async function POST(request: NextRequest, context: Context) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: testimonyId } = await context.params;

    const [existing] = await db
      .select()
      .from(testimonyLikes)
      .where(and(eq(testimonyLikes.testimonyId, testimonyId), eq(testimonyLikes.userId, session.user.id)))
      .limit(1);

    let hasLiked: boolean;
    if (existing) {
      await db.delete(testimonyLikes).where(eq(testimonyLikes.id, existing.id));
      await db
        .update(testimonies)
        .set({ likeCount: sql`greatest(${testimonies.likeCount} - 1, 0)` })
        .where(eq(testimonies.id, testimonyId));
      hasLiked = false;
    } else {
      await db.insert(testimonyLikes).values({ testimonyId, userId: session.user.id });
      await db
        .update(testimonies)
        .set({ likeCount: sql`${testimonies.likeCount} + 1` })
        .where(eq(testimonies.id, testimonyId));
      hasLiked = true;
    }

    const [updated] = await db.select().from(testimonies).where(eq(testimonies.id, testimonyId)).limit(1);

    return NextResponse.json({ hasLiked, likeCount: updated?.likeCount ?? 0 });
  } catch (error) {
    console.error("Testimony Like Error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
