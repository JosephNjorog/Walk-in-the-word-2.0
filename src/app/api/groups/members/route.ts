import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { groups, groupMembers, user } from "@/lib/schema";
import { eq, and, ne, or, sql } from "drizzle-orm";

// POST - Invite member to group
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { groupId, userIdOrEmail } = body;

    if (!groupId || !userIdOrEmail) {
      return NextResponse.json(
        { error: "Group ID and user identifier are required" },
        { status: 400 }
      );
    }

    // Verify user is group leader or admin
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

    if (!membership || (membership.role !== 'leader' && membership.role !== 'admin')) {
      return NextResponse.json(
        { error: "Only group leaders can invite members" },
        { status: 403 }
      );
    }

    // Find user by ID or email
    const [invitedUser] = await db
      .select()
      .from(user)
      .where(
        or(
          eq(user.id, userIdOrEmail),
          eq(user.email, userIdOrEmail),
          eq(user.username, userIdOrEmail)
        )
      )
      .limit(1);

    if (!invitedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if already a member
    const [existingMember] = await db
      .select()
      .from(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, invitedUser.id)
        )
      )
      .limit(1);

    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a member" },
        { status: 400 }
      );
    }

    // Check group capacity
    const [group] = await db
      .select()
      .from(groups)
      .where(eq(groups.id, groupId))
      .limit(1);

    const memberCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));

    if (memberCount[0].count >= (group?.maxMembers || 12)) {
      return NextResponse.json(
        { error: "Group is at maximum capacity" },
        { status: 400 }
      );
    }

    // Add member
    const [newMember] = await db
      .insert(groupMembers)
      .values({
        groupId,
        userId: invitedUser.id,
        role: 'member',
      })
      .returning();

    // TODO: Send notification/email to invited user

    return NextResponse.json({ 
      message: "Member invited successfully",
      member: newMember 
    }, { status: 201 });
  } catch (error) {
    console.error("Group Invite Error:", error);
    return NextResponse.json(
      { error: "Failed to invite member" },
      { status: 500 }
    );
  }
}

// GET - Get group members
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    // Verify user is a member of the group
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

    if (!membership) {
      return NextResponse.json(
        { error: "Not a member of this group" },
        { status: 403 }
      );
    }

    // Fetch all members
    const members = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        image: user.image,
        role: groupMembers.role,
        joinedAt: groupMembers.joinedAt,
      })
      .from(groupMembers)
      .innerJoin(user, eq(groupMembers.userId, user.id))
      .where(eq(groupMembers.groupId, groupId))
      .orderBy(groupMembers.joinedAt);

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Group Members GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

// DELETE - Remove member from group
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");
    const userId = searchParams.get("userId");

    if (!groupId || !userId) {
      return NextResponse.json(
        { error: "Group ID and User ID are required" },
        { status: 400 }
      );
    }

    // Verify requester is group leader
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

    if (!membership || membership.role !== 'leader') {
      return NextResponse.json(
        { error: "Only group leaders can remove members" },
        { status: 403 }
      );
    }

    // Cannot remove yourself (use leave endpoint instead)
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "Use the leave endpoint to remove yourself" },
        { status: 400 }
      );
    }

    // Remove member
    await db
      .delete(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, userId)
        )
      );

    return NextResponse.json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Remove Member Error:", error);
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 }
    );
  }
}
