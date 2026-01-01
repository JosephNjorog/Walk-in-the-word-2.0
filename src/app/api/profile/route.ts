import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user, readingProgress, reflections } from "@/lib/schema";
import { eq, count } from "drizzle-orm";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get statistics
    const chaptersReadResult = await db
      .select({ value: count() })
      .from(readingProgress)
      .where(eq(readingProgress.userId, session.user.id));
    
    const reflectionsCountResult = await db
      .select({ value: count() })
      .from(reflections)
      .where(eq(reflections.userId, session.user.id));

    return NextResponse.json({
      ...userData,
      chaptersRead: chaptersReadResult[0].value,
      reflectionsCount: reflectionsCountResult[0].value,
    });
  } catch (error) {
    console.error("Profile GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, username, image, preferredVersion } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;
    if (image) updateData.image = image;
    if (preferredVersion) updateData.preferredVersion = preferredVersion;

    await db.update(user).set(updateData).where(eq(user.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile PATCH Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
