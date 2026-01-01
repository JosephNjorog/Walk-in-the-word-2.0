import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { readingProgress, user } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { book, chapter } = await request.json();

  if (!book || !chapter) {
    return NextResponse.json({ error: "Missing book or chapter" }, { status: 400 });
  }

  try {
    // Check if progress already exists
    const existing = await db.query.readingProgress.findFirst({
        where: and(
            eq(readingProgress.userId, session.user.id),
            eq(readingProgress.book, book),
            eq(readingProgress.chapter, chapter)
        )
    });

    if (!existing) {
        await db.insert(readingProgress).values({
            userId: session.user.id,
            book,
            chapter,
        });

        // Update streak logic
        const lastRead = session.user.lastReadAt ? new Date(session.user.lastReadAt) : null;
        const now = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let newStreak = session.user.currentStreak || 0;
        if (!lastRead || lastRead.toDateString() === yesterday.toDateString()) {
            newStreak += 1;
        } else if (lastRead.toDateString() !== now.toDateString()) {
            newStreak = 1;
        }

        await db.update(user).set({
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, session.user.longestStreak || 0),
            //@ts-ignore
            lastReadAt: now,
        }).where(eq(user.id, session.user.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Progress API Error:", error);
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
  }
}

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const progress = await db.query.readingProgress.findMany({
            where: eq(readingProgress.userId, session.user.id),
        });
        return NextResponse.json(progress);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
    }
}
