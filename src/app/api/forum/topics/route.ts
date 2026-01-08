import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { forumTopics, forumReplies, forumCategories, user } from "@/lib/schema";
import { eq, desc, and, sql } from "drizzle-orm";

// GET - Fetch forum topics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = db
      .select({
        id: forumTopics.id,
        title: forumTopics.title,
        content: forumTopics.content,
        categoryId: forumTopics.categoryId,
        categoryName: forumCategories.name,
        isPinned: forumTopics.isPinned,
        isLocked: forumTopics.isLocked,
        viewCount: forumTopics.viewCount,
        replyCount: forumTopics.replyCount,
        authorName: user.name,
        authorImage: user.image,
        authorUsername: user.username,
        createdAt: forumTopics.createdAt,
        lastActivityAt: forumTopics.lastActivityAt,
      })
      .from(forumTopics)
      .innerJoin(user, eq(forumTopics.userId, user.id))
      .leftJoin(forumCategories, eq(forumTopics.categoryId, forumCategories.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(forumTopics.isPinned), desc(forumTopics.lastActivityAt));

    if (categoryId) {
      query = query.where(eq(forumTopics.categoryId, parseInt(categoryId)));
    }

    const topics = await query;

    return NextResponse.json({ topics });
  } catch (error) {
    console.error("Forum Topics GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}

// POST - Create new topic
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, categoryId } = body;

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    const [newTopic] = await db
      .insert(forumTopics)
      .values({
        userId: session.user.id,
        title,
        content,
        categoryId: parseInt(categoryId),
        lastActivityAt: new Date(),
      })
      .returning();

    return NextResponse.json({ topic: newTopic }, { status: 201 });
  } catch (error) {
    console.error("Forum Topics POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    );
  }
}

// PUT - Update topic (lock, pin, edit)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topicId, title, content, isPinned, isLocked } = body;

    if (!topicId) {
      return NextResponse.json(
        { error: "Topic ID is required" },
        { status: 400 }
      );
    }

    // Check if user owns the topic
    const [topic] = await db
      .select()
      .from(forumTopics)
      .where(eq(forumTopics.id, topicId))
      .limit(1);

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Only topic author can edit content
    if (topic.userId !== session.user.id && (title || content)) {
      return NextResponse.json(
        { error: "Unauthorized to edit this topic" },
        { status: 403 }
      );
    }

    // TODO: Check if user is moderator for pin/lock actions

    const updates: any = { updatedAt: new Date() };
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (isPinned !== undefined) updates.isPinned = isPinned;
    if (isLocked !== undefined) updates.isLocked = isLocked;

    const [updatedTopic] = await db
      .update(forumTopics)
      .set(updates)
      .where(eq(forumTopics.id, topicId))
      .returning();

    return NextResponse.json({ topic: updatedTopic });
  } catch (error) {
    console.error("Forum Topics PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 }
    );
  }
}

// DELETE - Delete topic
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get("topicId");

    if (!topicId) {
      return NextResponse.json(
        { error: "Topic ID is required" },
        { status: 400 }
      );
    }

    // Check if user owns the topic
    const [topic] = await db
      .select()
      .from(forumTopics)
      .where(eq(forumTopics.id, topicId))
      .limit(1);

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    if (topic.userId !== session.user.id) {
      // TODO: Allow moderators to delete
      return NextResponse.json(
        { error: "Unauthorized to delete this topic" },
        { status: 403 }
      );
    }

    await db.delete(forumTopics).where(eq(forumTopics.id, topicId));

    return NextResponse.json({ message: "Topic deleted successfully" });
  } catch (error) {
    console.error("Forum Topics DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    );
  }
}
