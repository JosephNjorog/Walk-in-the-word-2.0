import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { groups, groupMembers, user } from "@/lib/schema";
import { eq, and, sql } from "drizzle-orm";

interface Context {
  params: Promise<{ id: string }>;
}

// GET - Fetch group details
export async function GET(
  request: NextRequest,
  context: Context
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const groupId = params.id;

    // Fetch group details with leader info
    const [group] = await db
      .select({
        id: groups.id,
        name: groups.name,
        description: groups.description,
        type: groups.type,
        privacy: groups.privacy,
        maxMembers: groups.maxMembers,
        imageUrl: groups.imageUrl,
        meetingSchedule: groups.meetingSchedule,
        leaderId: groups.leaderId,
        leaderName: user.name,
        leaderEmail: user.email,
        leaderImage: user.image,
        createdAt: groups.createdAt,
      })
      .from(groups)
      .leftJoin(user, eq(groups.leaderId, user.id))
      .where(eq(groups.id, groupId))
      .limit(1);

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Check if user is a member
    const [membership] = await db
      .select()
      .from(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, session.user.id)
        )
      )
      .limit(1);

    // Get all members with their details
    const members = await db
      .select({
        id: groupMembers.id,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
        role: groupMembers.role,
        joinedAt: groupMembers.joinedAt,
      })
      .from(groupMembers)
      .innerJoin(user, eq(groupMembers.userId, user.id))
      .where(eq(groupMembers.groupId, groupId));

    // Get member count
    const [memberCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));

    return NextResponse.json({
      group: {
        ...group,
        memberCount: memberCount?.count || 0,
        isMember: !!membership,
        userRole: membership?.role || null,
      },
      members,
    });
  } catch (error) {
    console.error("Group GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch group" },
      { status: 500 }
    );
  }
}
