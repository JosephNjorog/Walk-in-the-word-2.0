// Email utility functions for easy access throughout the application
import { sendEmail } from "./email";
import { 
  getWelcomeEmailHtml, 
  getPasswordResetEmailHtml, 
  getDailyReminderEmailHtml,
  getPartnerInviteEmailHtml,
  getEncouragementEmailHtml 
} from "./email";
import { 
  getStreakMilestoneEmailHtml,
  getAchievementUnlockedEmailHtml,
  getSubscriptionConfirmationEmailHtml,
  getPasswordChangeConfirmationEmailHtml
} from "./email-templates";

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: "Welcome to Walk in the Word! 🙏",
    html: getWelcomeEmailHtml(name),
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(to: string, name: string, resetLink: string) {
  return sendEmail({
    to,
    subject: "Reset Your Password - Walk in the Word",
    html: getPasswordResetEmailHtml(name, resetLink),
  });
}

/**
 * Send daily reading reminder
 */
export async function sendDailyReminderEmail(to: string, name: string, todayReading: string) {
  return sendEmail({
    to,
    subject: `📖 Your Daily Reading: ${todayReading}`,
    html: getDailyReminderEmailHtml(name, todayReading),
  });
}

/**
 * Send partnership invitation
 */
export async function sendPartnerInviteEmail(to: string, inviterName: string, inviteLink: string) {
  return sendEmail({
    to,
    subject: `${inviterName} invited you to be accountability partners!`,
    html: getPartnerInviteEmailHtml(inviterName, inviteLink),
  });
}

/**
 * Send encouragement message from partner
 */
export async function sendEncouragementEmail(to: string, senderName: string, message: string) {
  return sendEmail({
    to,
    subject: `💌 ${senderName} sent you an encouragement`,
    html: getEncouragementEmailHtml(senderName, message),
  });
}

/**
 * Send streak milestone celebration email
 */
export async function sendStreakMilestoneEmail(to: string, name: string, streak: number) {
  const milestones: Record<number, string> = {
    7: "🌟 One Week Streak!",
    30: "🔥 30-Day Streak!",
    100: "💎 100-Day Streak!",
    365: "🏆 One Year Streak!"
  };
  
  const subject = milestones[streak] || `⭐ ${streak}-Day Streak Achievement!`;
  
  return sendEmail({
    to,
    subject,
    html: getStreakMilestoneEmailHtml(name, streak),
  });
}

/**
 * Send achievement unlocked notification
 */
export async function sendAchievementEmail(
  to: string, 
  name: string, 
  achievementTitle: string, 
  achievementDescription: string
) {
  return sendEmail({
    to,
    subject: `🏆 Achievement Unlocked: ${achievementTitle}`,
    html: getAchievementUnlockedEmailHtml(name, achievementTitle, achievementDescription),
  });
}

/**
 * Send subscription confirmation
 */
export async function sendSubscriptionConfirmationEmail(
  to: string,
  name: string,
  tier: string,
  expiresAt: string
) {
  return sendEmail({
    to,
    subject: `✨ Welcome to ${tier === 'lifetime' ? 'Lifetime Access' : 'Premium'}!`,
    html: getSubscriptionConfirmationEmailHtml(name, tier, expiresAt),
  });
}

/**
 * Send password change confirmation
 */
export async function sendPasswordChangeConfirmationEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: "Password Changed Successfully",
    html: getPasswordChangeConfirmationEmailHtml(name),
  });
}

/**
 * Email sending utility with error handling
 */
export async function sendEmailSafely(
  emailFunction: () => Promise<any>,
  context: string
): Promise<boolean> {
  try {
    await emailFunction();
    console.log(`✅ ${context} email sent successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send ${context} email:`, error);
    return false;
  }
}
