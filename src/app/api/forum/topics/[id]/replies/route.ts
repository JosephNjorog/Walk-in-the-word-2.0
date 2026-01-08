import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { forumReplies, forumTopics, user } from "@/lib/schema";
import { eq, desc, sql } from "drizzle-orm";

interface Context {
  params: Promise<{ id: string }>;
}

// GET - Fetch replies for a topic
export async function GET(
  request: NextRequest,
  context: Context
) {
  try {
    const params = await context.params;
    const topicId = params.id;

    const replies = await db
      .select({
        id: forumReplies.id,
        content: forumReplies.content,
        userId: forumReplies.userId,
        authorName: user.name,
        authorImage: user.image,
        authorUsername: user.username,
        createdAt: forumReplies.createdAt,
        updatedAt: forumReplies.updatedAt,
      })
      .from(forumReplies)
      .innerJoin(user, eq(forumReplies.userId, user.id))
      .where(eq(forumReplies.topicId, topicId))
      .orderBy(forumReplies.createdAt);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const repliesWithAuthorCheck = replies.map(reply => ({
      ...reply,
      isAuthor: session?.user?.id === reply.userId,
    }));

    return NextResponse.json({ replies: repliesWithAuthorCheck });
  } catch (error) {
    console.error("Replies GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 500 }
    );
  }
}

// POST - Create a reply
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
    const topicId = params.id;
    const body = await request.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Reply content is required" },
        { status: 400 }
      );
    }

    // Check if topic exists and is not locked
    const [topic] = await db
      .select()
      .from(forumTopics)
      .where(eq(forumTopics.id, topicId))
      .limit(1);

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    if (topic.isLocked) {
      return NextResponse.json(
        { error: "This topic is locked" },
        { status: 403 }
      );
    }

    // Create reply
    const [newReply] = await db
      .insert(forumReplies)
      .values({
        topicId,
        userId: session.user.id,
        content: content.trim(),
      })
      .returning();

    // Update topic reply count and last activity
    await db
      .update(forumTopics)
      .set({
        replyCount: sql`${forumTopics.replyCount} + 1`,
        lastActivityAt: new Date(),
      })
      .where(eq(forumTopics.id, topicId));

    // Fetch reply with user details
    const [replyWithUser] = await db
      .select({
        id: forumReplies.id,
        content: forumReplies.content,
        userId: forumReplies.userId,
        authorName: user.name,
        authorImage: user.image,
        authorUsername: user.username,
        createdAt: forumReplies.createdAt,
        updatedAt: forumReplies.updatedAt,
      })
      .from(forumReplies)
      .innerJoin(user, eq(forumReplies.userId, user.id))
      .where(eq(forumReplies.id, newReply.id))
      .limit(1);

    return NextResponse.json({ 
      reply: {
        ...replyWithUser,
        isAuthor: true,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Reply POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}
