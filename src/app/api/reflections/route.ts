import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { reflections } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { book, chapter, content, isPublic } = await request.json();

  if (!book || !chapter || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await db.insert(reflections).values({
        userId: session.user.id,
        book,
        chapter,
        content,
        isPublic: isPublic || false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reflections API Error:", error);
    return NextResponse.json({ error: "Failed to save reflection" }, { status: 500 });
  }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    try {
        if (userId) {
            // Fetch public reflections for a specific user
            const data = await db.query.reflections.findMany({
                where: eq(reflections.userId, userId),
                orderBy: [desc(reflections.createdAt)],
            });
            return NextResponse.json(data);
        } else if (session) {
            // Fetch all reflections for current user
            const data = await db.query.reflections.findMany({
                where: eq(reflections.userId, session.user.id),
                orderBy: [desc(reflections.createdAt)],
            });
            return NextResponse.json(data);
        }
        
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch reflections" }, { status: 500 });
    }
}
