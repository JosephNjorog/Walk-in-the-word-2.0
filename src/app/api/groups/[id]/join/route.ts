import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { groups, groupMembers } from "@/lib/schema";
import { and, eq, sql } from "drizzle-orm";

interface Context {
  params: Promise<{ id: string }>;
}

// POST - Self-join a public group
export async function POST(request: NextRequest, context: Context) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId } = await context.params;

    const [group] = await db.select().from(groups).where(eq(groups.id, groupId)).limit(1);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    if (group.privacy !== "public") {
      return NextResponse.json({ error: "This group is private - ask the leader for an invite" }, { status: 403 });
    }

    const [existing] = await db
      .select()
      .from(groupMembers)
      .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, session.user.id)))
      .limit(1);
    if (existing) {
      return NextResponse.json({ error: "Already a member" }, { status: 400 });
    }

    const [memberCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));
    if ((memberCount?.count || 0) >= (group.maxMembers || 12)) {
      return NextResponse.json({ error: "Group is at maximum capacity" }, { status: 400 });
    }

    const [member] = await db
      .insert(groupMembers)
      .values({ groupId, userId: session.user.id, role: "member" })
      .returning();

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error("Group Join Error:", error);
    return NextResponse.json({ error: "Failed to join group" }, { status: 500 });
  }
}
