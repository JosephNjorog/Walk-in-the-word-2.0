import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { prayerRequests, prayerInteractions, user } from "@/lib/schema";
import { eq, desc, sql, and } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prayers = await db
      .select({
        id: prayerRequests.id,
        content: prayerRequests.content,
        category: prayerRequests.category,
        isAnonymous: prayerRequests.isAnonymous,
        isAnswered: prayerRequests.isAnswered,
        prayerCount: prayerRequests.prayerCount,
        createdAt: prayerRequests.createdAt,
        userId: prayerRequests.userId,
        userName: user.name,
        userImage: user.image,
      })
      .from(prayerRequests)
      .leftJoin(user, eq(prayerRequests.userId, user.id))
      .orderBy(desc(prayerRequests.createdAt))
      .limit(50);

    const userPrayedFor = await db
      .select({ prayerRequestId: prayerInteractions.prayerRequestId })
      .from(prayerInteractions)
      .where(eq(prayerInteractions.userId, session.user.id));

    const prayedSet = new Set(userPrayedFor.map(p => p.prayerRequestId));

    const prayersWithStatus = prayers.map(prayer => ({
      ...prayer,
      userName: prayer.isAnonymous ? "Anonymous" : prayer.userName,
      userImage: prayer.isAnonymous ? null : prayer.userImage,
      hasPrayed: prayedSet.has(prayer.id),
      isOwner: prayer.userId === session.user.id,
    }));

    return NextResponse.json(prayersWithStatus);
  } catch (error) {
    console.error("Error fetching prayers:", error);
    return NextResponse.json({ error: "Failed to fetch prayers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, category, isAnonymous } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Prayer content is required" }, { status: 400 });
    }

    const [newPrayer] = await db
      .insert(prayerRequests)
      .values({
        userId: session.user.id,
        content: content.trim(),
        category: category || "general",
        isAnonymous: isAnonymous || false,
      })
      .returning();

    return NextResponse.json(newPrayer);
  } catch (error) {
    console.error("Error creating prayer:", error);
    return NextResponse.json({ error: "Failed to create prayer" }, { status: 500 });
  }
}
