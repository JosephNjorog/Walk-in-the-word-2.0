import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { partnerships, user } from "@/lib/schema";
import { eq, or, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { sendEmail, getInvitationEmailHtml } from "@/lib/mail";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const targetUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (!targetUser) {
        // If user doesn't exist, we can still send an invite to join the platform
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://' + (headers().get('host') || 'walkintheword.app')}/register?ref=${session.user.id}`;
        
        await sendEmail({
            to: email,
            subject: `Join ${session.user.name} on Walk in the Word`,
            html: getInvitationEmailHtml(session.user.name || "A friend", inviteLink),
        });

        return NextResponse.json({ success: true, message: "Invitation sent to new user" });
    }

    if (targetUser.id === session.user.id) {
        return NextResponse.json({ error: "You cannot invite yourself" }, { status: 400 });
    }

    // Check if partnership already exists
    const existing = await db.query.partnerships.findFirst({
      where: or(
        and(eq(partnerships.userId1, session.user.id), eq(partnerships.userId2, targetUser.id)),
        and(eq(partnerships.userId1, targetUser.id), eq(partnerships.userId2, session.user.id))
      ),
    });

    if (existing) {
      return NextResponse.json({ error: "Partnership already exists or is pending" }, { status: 400 });
    }

    // Create partnership request
    await db.insert(partnerships).values({
      userId1: session.user.id,
      userId2: targetUser.id,
      status: "pending",
    });

    // Send notification email
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://' + (headers().get('host') || 'walkintheword.app')}/partnerships`;
    await sendEmail({
      to: email,
      subject: `${session.user.name} invited you to be a reading partner`,
      html: getInvitationEmailHtml(session.user.name || "A friend", inviteLink),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Invite API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
