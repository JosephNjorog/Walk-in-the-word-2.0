import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { prayerRequests } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [prayer] = await db
      .select()
      .from(prayerRequests)
      .where(eq(prayerRequests.id, id));

    if (!prayer) {
      return NextResponse.json({ error: "Prayer not found" }, { status: 404 });
    }

    if (prayer.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await db
      .update(prayerRequests)
      .set({ isAnswered: true, updatedAt: new Date() })
      .where(eq(prayerRequests.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking prayer answered:", error);
    return NextResponse.json({ error: "Failed to mark prayer answered" }, { status: 500 });
  }
}
