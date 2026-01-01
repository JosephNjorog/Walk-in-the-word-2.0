import nodemailer from "nodemailer";

const isEmailConfigured = () => {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
};

const getTransporter = () => {
  if (!isEmailConfigured()) return null;
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = getTransporter();
  
  if (!transporter) {
    console.log("[Mail] SMTP not configured, skipping email to:", to);
    console.log("[Mail] Subject:", subject);
    return { skipped: true, reason: "SMTP not configured" };
  }

  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || "Walk in the Word"}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
  });

  return info;
}

export function getInvitationEmailHtml(inviterName: string, inviteLink: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8f9fa; color: #333;">
      <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Walk in the Word</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Daily Bible Reading Community</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <p style="font-style: italic; margin: 0; color: #92400e; font-size: 15px; line-height: 1.6;">
              "Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up."
            </p>
            <p style="margin: 10px 0 0 0; color: #b45309; font-weight: 600; font-size: 13px;">— Ecclesiastes 4:9-10</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.7; color: #374151; margin-bottom: 20px;">
            Grace and peace to you!
          </p>
          
          <p style="font-size: 16px; line-height: 1.7; color: #374151; margin-bottom: 30px;">
            <strong style="color: #6366f1;">${inviterName}</strong> has invited you to join them in their daily Bible reading journey on <strong>Walk in the Word</strong>. Together, you can encourage one another, share reflections, and grow in faith as you walk through Scripture.
          </p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${inviteLink}" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);">
              Accept Invitation
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; text-align: center; line-height: 1.6;">
            Join a community of believers growing together in the Word of God, one chapter at a time.
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 25px 30px; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0; line-height: 1.6;">
            If you didn't expect this invitation, you can safely ignore this email.<br>
            May the Lord bless you and keep you.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
