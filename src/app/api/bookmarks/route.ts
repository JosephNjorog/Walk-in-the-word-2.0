import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { bookmarks } from "@/lib/schema";
import { and, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const book = searchParams.get("book");
    const chapter = searchParams.get("chapter");

    if (!book || !chapter) {
      return NextResponse.json({ error: "Book and chapter are required" }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, session.user.id),
          eq(bookmarks.book, book),
          eq(bookmarks.chapter, parseInt(chapter))
        )
      );

    return NextResponse.json({ bookmarks: rows });
  } catch (error) {
    console.error("Bookmarks GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

// Upserts a single verse's marker (highlight color and/or note) - one row per
// (user, book, chapter, verse) representing that verse's combined state.
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { book, chapter, verse, verseText, color, note } = body;

    if (!book || chapter === undefined || verse === undefined) {
      return NextResponse.json({ error: "Book, chapter, and verse are required" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, session.user.id),
          eq(bookmarks.book, book),
          eq(bookmarks.chapter, chapter),
          eq(bookmarks.verse, verse)
        )
      )
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(bookmarks)
        .set({
          verseText: verseText ?? existing.verseText,
          color: color ?? existing.color,
          note: note === undefined ? existing.note : note,
        })
        .where(eq(bookmarks.id, existing.id))
        .returning();
      return NextResponse.json({ bookmark: updated });
    }

    const [created] = await db
      .insert(bookmarks)
      .values({
        userId: session.user.id,
        book,
        chapter,
        verse,
        verseText,
        color: color ?? "yellow",
        note: note ?? null,
      })
      .returning();

    return NextResponse.json({ bookmark: created }, { status: 201 });
  } catch (error) {
    console.error("Bookmarks POST Error:", error);
    return NextResponse.json({ error: "Failed to save bookmark" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.id, id), eq(bookmarks.userId, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bookmarks DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
  }
}
