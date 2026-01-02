import { NextRequest, NextResponse } from "next/server";
import { sendEmail, getWelcomeEmailHtml, getPasswordResetEmailHtml, getDailyReminderEmailHtml, getPartnerInviteEmailHtml } from "@/lib/email";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { type, to, data } = await request.json();

    if (!type || !to) {
      return NextResponse.json({ error: "Type and recipient are required" }, { status: 400 });
    }

    let subject: string;
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
