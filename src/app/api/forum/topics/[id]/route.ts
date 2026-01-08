import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { forumTopics, forumReplies, forumCategories, user } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: Context
) {
  try {
    const params = await context.params;
    const topicId = params.id;

    // Increment view count
    await db
      .update(forumTopics)
      .set({ viewCount: sql`${forumTopics.viewCount} + 1` })
      .where(eq(forumTopics.id, topicId));

    // Fetch topic with author and category
    const [topic] = await db
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
        userId: forumTopics.userId,
        authorName: user.name,
        authorImage: user.image,
        authorUsername: user.username,
        createdAt: forumTopics.createdAt,
        lastActivityAt: forumTopics.lastActivityAt,
      })
      .from(forumTopics)
      .innerJoin(user, eq(forumTopics.userId, user.id))
      .leftJoin(forumCategories, eq(forumTopics.categoryId, forumCategories.id))
      .where(eq(forumTopics.id, topicId))
      .limit(1);

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Check if current user is the author
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    return NextResponse.json({ 
      topic: {
        ...topic,
        isAuthor: session?.user?.id === topic.userId,
      }
    });
  } catch (error) {
    console.error("Topic GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 }
    );
  }
}
