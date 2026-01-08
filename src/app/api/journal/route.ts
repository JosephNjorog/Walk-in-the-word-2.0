import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { journalEntries } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const entries = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, session.user.id))
      .orderBy(desc(journalEntries.createdAt))
      .limit(limit);

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Journal GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { book, chapter, verse, scripture, observation, application, prayer } = body;

    if (!book || !chapter) {
      return NextResponse.json(
        { error: "Book and chapter are required" },
        { status: 400 }
      );
    }

    const [newEntry] = await db
      .insert(journalEntries)
      .values({
        userId: session.user.id,
        book,
        chapter,
        verse,
        scripture,
        observation,
        application,
        prayer,
      })
      .returning();

    return NextResponse.json({ entry: newEntry }, { status: 201 });
  } catch (error) {
    console.error("Journal POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create journal entry" },
      { status: 500 }
    );
  }
}
