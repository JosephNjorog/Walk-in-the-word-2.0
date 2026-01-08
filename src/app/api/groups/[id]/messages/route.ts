import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { groupMessages, groupMembers, user } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";

interface Context {
  params: Promise<{ id: string }>;
}

// GET - Fetch group messages
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
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Verify user is a member
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
        { error: "You must be a member to view messages" },
        { status: 403 }
      );
    }

    // Fetch messages with user details
    const messages = await db
      .select({
        id: groupMessages.id,
        content: groupMessages.content,
        createdAt: groupMessages.createdAt,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
      })
      .from(groupMessages)
      .innerJoin(user, eq(groupMessages.userId, user.id))
      .where(eq(groupMessages.groupId, groupId))
      .orderBy(desc(groupMessages.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ messages: messages.reverse() });
  } catch (error) {
    console.error("Messages GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST - Send a message
export async function POST(
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
    const body = await request.json();
    const { content, type } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Verify user is a member
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
        { error: "You must be a member to send messages" },
        { status: 403 }
      );
    }

    // Create message
    const [newMessage] = await db
      .insert(groupMessages)
      .values({
        groupId,
        userId: session.user.id,
        content: content.trim(),
      })
      .returning();

    // Fetch user details for response
    const [messageWithUser] = await db
      .select({
        id: groupMessages.id,
        content: groupMessages.content,
        createdAt: groupMessages.createdAt,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
      })
      .from(groupMessages)
      .innerJoin(user, eq(groupMessages.userId, user.id))
      .where(eq(groupMessages.id, newMessage.id))
      .limit(1);

    return NextResponse.json({ message: messageWithUser }, { status: 201 });
  } catch (error) {
    console.error("Messages POST Error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
