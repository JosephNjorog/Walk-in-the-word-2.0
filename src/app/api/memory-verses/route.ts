import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { memoryVerses, memoryVerseAttempts } from "@/lib/schema";
import { eq, and, lte } from "drizzle-orm";

// GET - Fetch user's memory verses
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dueOnly = searchParams.get("dueOnly") === "true";

    let query = db
      .select()
      .from(memoryVerses)
      .where(eq(memoryVerses.userId, session.user.id));

    if (dueOnly) {
      query = query.where(
        and(
          eq(memoryVerses.userId, session.user.id),
          lte(memoryVerses.nextReviewAt, new Date())
        )
      );
    }

    const verses = await query;

    return NextResponse.json({ verses });
  } catch (error) {
    console.error("Memory Verses GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch memory verses" },
      { status: 500 }
    );
  }
}

// POST - Add verse to memory system
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { book, chapter, verse, verseText } = body;

    if (!book || !chapter || !verse || !verseText) {
      return NextResponse.json(
        { error: "Book, chapter, verse, and text are required" },
        { status: 400 }
      );
    }

    // Check if already exists
    const [existing] = await db
      .select()
      .from(memoryVerses)
      .where(
        and(
          eq(memoryVerses.userId, session.user.id),
          eq(memoryVerses.book, book),
          eq(memoryVerses.chapter, chapter),
          eq(memoryVerses.verse, verse)
        )
      )
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "Verse already in memory system" },
        { status: 400 }
      );
    }

    // Calculate next review (1 day from now for new verses)
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 1);

    const [newVerse] = await db
      .insert(memoryVerses)
      .values({
        userId: session.user.id,
        book,
        chapter,
        verse,
        verseText,
        masteryLevel: 0,
        reviewCount: 0,
        nextReviewAt: nextReview,
      })
      .returning();

    return NextResponse.json({ verse: newVerse }, { status: 201 });
  } catch (error) {
    console.error("Memory Verses POST Error:", error);
    return NextResponse.json(
      { error: "Failed to add memory verse" },
      { status: 500 }
    );
  }
}

// PUT - Record review attempt and update spaced repetition
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { verseId, accuracy, isCorrect } = body;

    if (!verseId || accuracy === undefined || isCorrect === undefined) {
      return NextResponse.json(
        { error: "Verse ID, accuracy, and isCorrect are required" },
        { status: 400 }
      );
    }

    // Get current verse
    const [verse] = await db
      .select()
      .from(memoryVerses)
      .where(
        and(
          eq(memoryVerses.id, verseId),
          eq(memoryVerses.userId, session.user.id)
        )
      )
      .limit(1);

    if (!verse) {
      return NextResponse.json({ error: "Verse not found" }, { status: 404 });
    }

    // Record attempt
    await db.insert(memoryVerseAttempts).values({
      memoryVerseId: verseId,
      userId: session.user.id,
      accuracy,
      isCorrect,
    });

    // Update mastery level and next review date using spaced repetition
    let newMasteryLevel = verse.masteryLevel || 0;
    if (isCorrect && accuracy >= 80) {
      newMasteryLevel = Math.min(5, newMasteryLevel + 1);
    } else if (!isCorrect || accuracy < 50) {
      newMasteryLevel = Math.max(0, newMasteryLevel - 1);
    }

    // Calculate next review based on mastery level
    // Level 0: 1 day, Level 1: 3 days, Level 2: 7 days, Level 3: 14 days, Level 4: 30 days, Level 5: 90 days
    const intervals = [1, 3, 7, 14, 30, 90];
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + intervals[newMasteryLevel]);

    const [updatedVerse] = await db
      .update(memoryVerses)
      .set({
        masteryLevel: newMasteryLevel,
        reviewCount: (verse.reviewCount || 0) + 1,
        lastReviewedAt: new Date(),
        nextReviewAt: nextReview,
      })
      .where(eq(memoryVerses.id, verseId))
      .returning();

    return NextResponse.json({ 
      verse: updatedVerse,
      message: isCorrect ? "Great job!" : "Keep practicing!" 
    });
  } catch (error) {
    console.error("Memory Verses PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to record review" },
      { status: 500 }
    );
  }
}

// DELETE - Remove verse from memory system
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const verseId = searchParams.get("verseId");

    if (!verseId) {
      return NextResponse.json(
        { error: "Verse ID is required" },
        { status: 400 }
      );
    }

    await db
      .delete(memoryVerses)
      .where(
        and(
          eq(memoryVerses.id, verseId),
          eq(memoryVerses.userId, session.user.id)
        )
      );

    return NextResponse.json({ message: "Verse removed successfully" });
  } catch (error) {
    console.error("Memory Verses DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to remove verse" },
      { status: 500 }
    );
  }
}
