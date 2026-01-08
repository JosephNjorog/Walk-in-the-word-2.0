import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forumCategories, forumTopics } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const categories = await db.select().from(forumCategories).orderBy(forumCategories.displayOrder);

    // Get topic counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const [topicCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(forumTopics)
          .where(eq(forumTopics.categoryId, category.id));

        return {
          ...category,
          topicCount: topicCount?.count || 0,
        };
      })
    );

    return NextResponse.json({ categories: categoriesWithCounts });
  } catch (error) {
    console.error("Forum Categories GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
