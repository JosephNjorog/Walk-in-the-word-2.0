import { NextRequest, NextResponse } from "next/server";
import { sendEmail, getWelcomeEmailHtml, getPasswordResetEmailHtml, getDailyReminderEmailHtml, getPartnerInviteEmailHtml, getEncouragementEmailHtml } from "@/lib/email";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const body = await request.json();
    const { type, to, data, subject, message } = body;

    // Handle generic encouragement messages
    if (subject && message) {
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Get recipient user info
      let recipientEmail = to;
      if (!to.includes('@')) {
        // If 'to' is a user ID, fetch their email
        const recipient = await db.query.user.findFirst({
          where: eq(user.id, to),
        });
        if (!recipient?.email) {
          return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
        }
        recipientEmail = recipient.email;
      }

      const html = getEncouragementEmailHtml(session.user.name || "Your Partner", message);
      await sendEmail({ 
        to: recipientEmail, 
        subject, 
        html,
      });

      return NextResponse.json({ success: true });
    }

    if (!type || !to) {
      return NextResponse.json({ error: "Type and recipient are required" }, { status: 400 });
    }

    let emailSubject: string;
    let html: string;

    switch (type) {
      case "welcome":
        subject = "Welcome to Walk in the Word!";
        html = getWelcomeEmailHtml(data?.name || "Friend");
        break;
      case "password-reset":
        subject = "Reset Your Password - Walk in the Word";
        html = getPasswordResetEmailHtml(data?.name || "Friend", data?.resetLink);
        break;
      case "daily-reminder":
        subject = "Your Daily Scripture Awaits";
        html = getDailyReminderEmailHtml(data?.name || "Friend", data?.todayReading || "Continue Reading");
        break;
      case "partner-invite":
        subject = `${data?.inviterName} invites you to Walk in the Word`;
        html = getPartnerInviteEmailHtml(data?.inviterName || "A friend", data?.inviteLink);
        break;
      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
    }

    await sendEmail({ to, subject, html });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
