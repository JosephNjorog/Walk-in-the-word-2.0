import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { groups, groupMembers, groupMessages, user } from "@/lib/schema";
import { eq, and, desc, sql } from "drizzle-orm";

// GET - Fetch user's groups
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch groups where user is a member
    const userGroups = await db
      .select({
        id: groups.id,
        name: groups.name,
        description: groups.description,
        type: groups.type,
        privacy: groups.privacy,
        maxMembers: groups.maxMembers,
        imageUrl: groups.imageUrl,
        meetingSchedule: groups.meetingSchedule,
        leaderName: user.name,
        leaderImage: user.image,
        createdAt: groups.createdAt,
      })
      .from(groupMembers)
      .innerJoin(groups, eq(groupMembers.groupId, groups.id))
      .leftJoin(user, eq(groups.leaderId, user.id))
      .where(eq(groupMembers.userId, userId))
      .orderBy(desc(groups.createdAt));

    // Get member count and most recent message for each group (for the chat list preview)
    const groupsWithCounts = await Promise.all(
      userGroups.map(async (group) => {
        const [memberCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(groupMembers)
          .where(eq(groupMembers.groupId, group.id));

        const [lastMessage] = await db
          .select({ content: groupMessages.content, createdAt: groupMessages.createdAt })
          .from(groupMessages)
          .where(eq(groupMessages.groupId, group.id))
          .orderBy(desc(groupMessages.createdAt))
          .limit(1);

        return {
          ...group,
          memberCount: memberCount?.count || 0,
          lastMessage: lastMessage?.content || null,
          lastMessageAt: lastMessage?.createdAt || null,
        };
      })
    );

    return NextResponse.json({ groups: groupsWithCounts });
  } catch (error) {
    console.error("Groups GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

// POST - Create a new group
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, type, privacy, maxMembers, meetingSchedule } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      );
    }

    // Create the group
    const [newGroup] = await db
      .insert(groups)
      .values({
        name,
        description,
        type: type || 'small_group',
        privacy: privacy || 'private',
        maxMembers: maxMembers || 12,
        meetingSchedule,
        leaderId: session.user.id,
      })
      .returning();

    // Add creator as first member
    await db.insert(groupMembers).values({
      groupId: newGroup.id,
      userId: session.user.id,
      role: 'leader',
    });

    return NextResponse.json({ group: newGroup }, { status: 201 });
  } catch (error) {
    console.error("Groups POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}

// PUT - Update group
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { groupId, name, description, meetingSchedule, imageUrl } = body;

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    // Verify user is group leader
    const [group] = await db
      .select()
      .from(groups)
      .where(eq(groups.id, groupId))
      .limit(1);

    if (!group || group.leaderId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized - not group leader" },
        { status: 403 }
      );
    }

    // Update group
    const [updatedGroup] = await db
      .update(groups)
      .set({
        name: name || group.name,
        description: description !== undefined ? description : group.description,
        meetingSchedule: meetingSchedule !== undefined ? meetingSchedule : group.meetingSchedule,
        imageUrl: imageUrl !== undefined ? imageUrl : group.imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, groupId))
      .returning();

    return NextResponse.json({ group: updatedGroup });
  } catch (error) {
    console.error("Groups PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    );
  }
}

// DELETE - Leave or delete group
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

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    // Check if user is leader
    const [group] = await db
      .select()
      .from(groups)
      .where(eq(groups.id, groupId))
      .limit(1);

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    if (group.leaderId === session.user.id) {
      // Leader deleting group - remove entire group
      await db.delete(groups).where(eq(groups.id, groupId));
      return NextResponse.json({ message: "Group deleted successfully" });
    } else {
      // Member leaving group
      await db
        .delete(groupMembers)
        .where(
          and(
            eq(groupMembers.groupId, groupId),
            eq(groupMembers.userId, session.user.id)
          )
        );
      return NextResponse.json({ message: "Left group successfully" });
    }
  } catch (error) {
    console.error("Groups DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete/leave group" },
      { status: 500 }
    );
  }
}
