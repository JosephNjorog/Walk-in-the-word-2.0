import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { sermons, churchMembers } from "@/lib/schema";
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

// POST - Add a sermon (church admin only)
export async function POST(request: NextRequest, context: Context) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: churchId } = await context.params;
    if (!(await isChurchAdmin(churchId, session.user.id))) {
      return NextResponse.json({ error: "Only church admins can add sermons" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description } = body;
    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const [sermon] = await db
      .insert(sermons)
      .values({ churchId, pastorId: session.user.id, title: title.trim(), description, sermonDate: new Date() })
      .returning();

    return NextResponse.json({ sermon }, { status: 201 });
  } catch (error) {
    console.error("Church Sermon POST Error:", error);
    return NextResponse.json({ error: "Failed to add sermon" }, { status: 500 });
  }
}
