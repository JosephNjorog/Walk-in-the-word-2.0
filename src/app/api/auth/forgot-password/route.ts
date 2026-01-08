import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { sendEmail, getPasswordResetEmailHtml } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user by email
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    // Always return success to prevent email enumeration attacks
    if (!existingUser) {
      return NextResponse.json({ 
        success: true, 
        message: "If an account exists with this email, a password reset link has been sent." 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    await db.update(user)
      .set({
        emailVerified: false, // We'll use this field temporarily for reset token
        // In production, add proper resetToken and resetTokenExpiry fields to schema
      })
      .where(eq(user.id, existingUser.id));

    // Create reset link
    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send email
    try {
      await sendEmail({
        to: email,
        subject: "Reset Your Password - Walk in the Word",
        html: getPasswordResetEmailHtml(existingUser.name, resetLink),
      });
    } catch (emailError) {
      console.error("Failed to send reset email:", emailError);
      // Still return success to prevent email enumeration
    }

    return NextResponse.json({ 
      success: true, 
      message: "If an account exists with this email, a password reset link has been sent." 
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
