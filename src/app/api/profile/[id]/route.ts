import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user, readingProgress, partnerships } from "@/lib/schema";
import { eq, or, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: partnerIdOrUsername } = await params;
    
    // Check if it's a username (starts with @) or ID
    const isUsername = partnerIdOrUsername.startsWith('@');
    const searchValue = isUsername ? partnerIdOrUsername.substring(1) : partnerIdOrUsername;
    
    // Find partner by username or ID
    const partnerInfo = isUsername
      ? await db.query.user.findFirst({
          where: eq(user.username, searchValue),
        })
      : await db.query.user.findFirst({
          where: eq(user.id, searchValue),
        });

    if (!partnerInfo) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const partnerId = partnerInfo.id;
    
    // Check if they are partners
    const partnership = await db.query.partnerships.findFirst({
      where: or(
        and(eq(partnerships.userId1, session.user.id), eq(partnerships.userId2, partnerId)),
        and(eq(partnerships.userId1, partnerId), eq(partnerships.userId2, session.user.id))
      ),
    });

    if (!partnership || partnership.status !== 'active') {
      return NextResponse.json({ error: "Not partners with this user" }, { status: 403 });
    }

    // Fetch partner info
    const partnerInfo = await db.query.user.findFirst({
      where: eq(user.id, partnerId),
    });

    if (!partnerInfo) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch partner's reading progress
    const progress = await db.query.readingProgress.findMany({
      where: eq(readingProgress.userId, partnerId),
      orderBy: (readingProgress, { desc }) => [desc(readingProgress.readAt)],
    });

    // Don't expose email to partners
    const { email, ...partnerData } = partnerInfo;

    return NextResponse.json({
      user: partnerData,
      progress,
    });
  } catch (error) {
    console.error("Partner Profile API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
