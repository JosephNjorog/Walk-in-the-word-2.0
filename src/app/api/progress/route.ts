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
        const userData = await db.query.user.findFirst({
            where: eq(user.id, session.user.id),
        });
        
        const lastRead = userData?.lastReadAt ? new Date(userData.lastReadAt) : null;
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset to start of day
        
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let lastReadDate = null;
        if (lastRead) {
            lastReadDate = new Date(lastRead);
            lastReadDate.setHours(0, 0, 0, 0);
        }

        let newStreak = userData?.currentStreak || 0;
        
        // If last read was yesterday, increment streak
        if (lastReadDate && lastReadDate.getTime() === yesterday.getTime()) {
            newStreak += 1;
        }
        // If last read was not today and not yesterday, reset to 1
        else if (!lastReadDate || lastReadDate.getTime() !== now.getTime()) {
            newStreak = 1;
        }
        // If last read was today, keep the same streak (don't increment again)

        await db.update(user).set({
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, userData?.longestStreak || 0),
            //@ts-ignore
            lastReadAt: new Date(),
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
