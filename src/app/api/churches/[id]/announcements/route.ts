import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { churchAnnouncements, churchMembers } from "@/lib/schema";
import { and, eq } from "drizzle-orm";

interface Context {
  params: Promise<{ id: string }>;
}

async function isChurchAdmin(churchId: string, userId: string) {
  const [membership] = await db
    .select()
    .from(churchMembers)
    .where(and(eq(churchMembers.churchId, churchId), eq(churchMembers.userId, userId)))
    .limit(1);
  return membership?.role === "pastor";
}

// POST - Post a new announcement (church admin only)
export async function POST(request: NextRequest, context: Context) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: churchId } = await context.params;
    if (!(await isChurchAdmin(churchId, session.user.id))) {
      return NextResponse.json({ error: "Only church admins can post announcements" }, { status: 403 });
    }

    const body = await request.json();
    const { title, body: content, isPinned } = body;
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
    }

    const [announcement] = await db
      .insert(churchAnnouncements)
      .values({ churchId, authorId: session.user.id, title: title.trim(), body: content.trim(), isPinned: !!isPinned })
      .returning();

    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error) {
    console.error("Church Announcement POST Error:", error);
    return NextResponse.json({ error: "Failed to post announcement" }, { status: 500 });
  }
}
