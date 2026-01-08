import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { testimonies, user } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const results = await db
      .select({
        id: testimonies.id,
        title: testimonies.title,
        content: testimonies.content,
        isAnonymous: testimonies.isAnonymous,
        isApproved: testimonies.isApproved,
        createdAt: testimonies.createdAt,
        userId: user.id,
        userName: user.name,
        userImage: user.image,
      })
      .from(testimonies)
      .leftJoin(user, eq(testimonies.userId, user.id))
      .where(eq(testimonies.isApproved, true))
      .orderBy(desc(testimonies.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ testimonies: results });
  } catch (error) {
    console.error("Testimonies GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonies" },
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
    const { title, content, isAnonymous } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const [newTestimony] = await db
      .insert(testimonies)
      .values({
        userId: session.user.id,
        title: title.trim(),
        content: content.trim(),
        isAnonymous: isAnonymous || false,
        isApproved: false,
      })
      .returning();

    return NextResponse.json({ testimony: newTestimony }, { status: 201 });
  } catch (error) {
    console.error("Testimonies POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create testimony" },
      { status: 500 }
    );
  }
}
