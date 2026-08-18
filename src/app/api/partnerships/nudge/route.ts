import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { partnerships, notifications } from "@/lib/schema";
import { and, eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// POST - Send a lightweight in-app nudge to an active reading partner
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { partnershipId } = await request.json();
    if (!partnershipId) {
      return NextResponse.json({ error: "partnershipId is required" }, { status: 400 });
    }

    const [partnership] = await db
      .select()
      .from(partnerships)
      .where(
        and(
          eq(partnerships.id, partnershipId),
          eq(partnerships.status, "active"),
          or(eq(partnerships.userId1, session.user.id), eq(partnerships.userId2, session.user.id))
        )
      )
      .limit(1);

    if (!partnership) {
      return NextResponse.json({ error: "Partnership not found" }, { status: 404 });
    }

    const partnerId = partnership.userId1 === session.user.id ? partnership.userId2 : partnership.userId1;
    if (!partnerId) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    await db.insert(notifications).values({
      userId: partnerId,
      type: "partner_nudge",
      title: `${session.user.name || "Your reading partner"} nudged you`,
      message: "Keep your streak going — pick up where you left off in the Word.",
      actionUrl: "/streaks",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Partnerships Nudge Error:", error);
    return NextResponse.json({ error: "Failed to send nudge" }, { status: 500 });
  }
}
