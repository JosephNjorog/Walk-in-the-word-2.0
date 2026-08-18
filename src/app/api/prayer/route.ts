import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { prayerRequests, prayerInteractions, user } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const rows = await db
      .select({
        id: prayerRequests.id,
        content: prayerRequests.content,
        category: prayerRequests.category,
        isAnonymous: prayerRequests.isAnonymous,
        isAnswered: prayerRequests.isAnswered,
        prayerCount: prayerRequests.prayerCount,
        createdAt: prayerRequests.createdAt,
        userId: user.id,
        userName: user.name,
        userImage: user.image,
      })
      .from(prayerRequests)
      .leftJoin(user, eq(prayerRequests.userId, user.id))
      .orderBy(desc(prayerRequests.createdAt))
      .limit(limit);

    const myInteractions = await db
      .select({ prayerRequestId: prayerInteractions.prayerRequestId })
      .from(prayerInteractions)
      .where(eq(prayerInteractions.userId, session.user.id));
    const prayedSet = new Set(myInteractions.map((r) => r.prayerRequestId));

    const requests = rows.map((r) => ({
      ...r,
      userName: r.isAnonymous ? null : r.userName,
      userImage: r.isAnonymous ? null : r.userImage,
      hasPrayed: prayedSet.has(r.id),
    }));

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Prayer GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch prayer requests" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, isAnonymous, category } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const [created] = await db
      .insert(prayerRequests)
      .values({
        userId: session.user.id,
        content: content.trim(),
        category: category || "general",
        isAnonymous: !!isAnonymous,
      })
      .returning();

    return NextResponse.json({ request: created }, { status: 201 });
  } catch (error) {
    console.error("Prayer POST Error:", error);
    return NextResponse.json({ error: "Failed to create prayer request" }, { status: 500 });
  }
}
