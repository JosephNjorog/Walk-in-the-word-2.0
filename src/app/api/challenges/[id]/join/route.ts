import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { challenges, challengeParticipants } from "@/lib/schema";
import { and, eq, sql } from "drizzle-orm";

interface Context {
  params: Promise<{ id: string }>;
}

// POST - Toggle joining a community challenge
export async function POST(request: NextRequest, context: Context) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: challengeId } = await context.params;

    const [existing] = await db
      .select()
      .from(challengeParticipants)
      .where(and(eq(challengeParticipants.challengeId, challengeId), eq(challengeParticipants.userId, session.user.id)))
      .limit(1);

    let joined: boolean;
    if (existing) {
      await db.delete(challengeParticipants).where(eq(challengeParticipants.id, existing.id));
      await db
        .update(challenges)
        .set({ participantCount: sql`greatest(${challenges.participantCount} - 1, 0)` })
        .where(eq(challenges.id, challengeId));
      joined = false;
    } else {
      await db.insert(challengeParticipants).values({ challengeId, userId: session.user.id });
      await db
        .update(challenges)
        .set({ participantCount: sql`${challenges.participantCount} + 1` })
        .where(eq(challenges.id, challengeId));
      joined = true;
    }

    return NextResponse.json({ joined });
  } catch (error) {
    console.error("Challenge Join Error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
