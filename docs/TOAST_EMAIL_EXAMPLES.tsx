/**
 * Toast & Email Examples
 * 
 * This file demonstrates how to use the toast notifications
 * and email system throughout your application.
 */

import { toast } from "sonner";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendDailyReminderEmail,
  sendPartnerInviteEmail,
  sendEncouragementEmail,
  sendStreakMilestoneEmail,
  sendAchievementEmail,
  sendSubscriptionConfirmationEmail,
  sendPasswordChangeConfirmationEmail,
  sendEmailSafely
} from "@/lib/email-utils";

// ============================================
// TOAST NOTIFICATION EXAMPLES
// ============================================

// Basic toasts
export function showSuccessToast() {
  toast.success("Reading progress saved!");
}

export function showErrorToast() {
  toast.error("Failed to load content. Please try again.");
}

export function showInfoToast() {
  toast.info("New achievement unlocked!");
}

export function showWarningToast() {
  toast.warning("Your streak is at risk! Read today to keep it.");
}

export function showLoadingToast() {
  toast.loading("Saving your progress...");
}

// Toast with description
export function showToastWithDescription() {
  toast.success("Settings saved!", {
    description: "Your preferences have been updated successfully.",
  });
}

// Toast with action button
export function showToastWithAction() {
  toast.success("Streak milestone reached!", {
    description: "You've reached a 7-day reading streak!",
    action: {
      label: "View Stats",
      onClick: () => console.log("Navigate to stats"),
    },
  });
}

// Promise-based toast (auto updates based on promise state)
export async function showPromiseToast() {
  const promise = fetch('/api/save-progress');
  
  toast.promise(promise, {
    loading: 'Saving your progress...',
    success: 'Progress saved successfully!',
    error: 'Failed to save progress',
  });
}

// Toast with custom duration
export function showCustomDurationToast() {
  toast.success("Quick notification", {
    duration: 2000, // 2 seconds
  });
}

// Toast with custom ID (for updates)
export function showUpdatableToast() {
  const toastId = toast.loading("Processing...");
  
  // Later, update the toast
  setTimeout(() => {
    toast.success("Completed!", {
      id: toastId,
    });
  }, 2000);
}

// Dismiss all toasts
export function dismissAllToasts() {
  toast.dismiss();
}

// ============================================
// EMAIL EXAMPLES
// ============================================

// Welcome email when user signs up
export async function sendUserWelcomeEmail(email: string, name: string) {
  try {
    await sendWelcomeEmail(email, name);
    toast.success("Welcome email sent!");
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    // Don't show error to user - email failures shouldn't block UX
  }
}

// Password reset flow
export async function handleForgotPassword(email: string) {
  const resetToken = "generated-token-here";
  const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${resetToken}&email=${email}`;
  
  await sendEmailSafely(
    () => sendPasswordResetEmail(email, "User", resetLink),
    "password reset"
  );
  
  toast.success("Password reset email sent!");
}

// Daily reading reminder
export async function sendTodaysReminder(email: string, name: string) {
  await sendEmailSafely(
    () => sendDailyReminderEmail(email, name, "Genesis 1"),
    "daily reminder"
  );
}

// Partnership invitation
export async function inviteAccountabilityPartner(
  inviteeEmail: string,
  inviterName: string
) {
  const inviteLink = `${process.env.NEXT_PUBLIC_SITE_URL}/partnerships/accept?invite=token`;
  
  await sendEmailSafely(
    () => sendPartnerInviteEmail(inviteeEmail, inviterName, inviteLink),
    "partnership invite"
  );
  
  toast.success("Invitation sent!");
}

// Send encouragement to partner
export async function sendPartnerEncouragement(
  partnerEmail: string,
  senderName: string,
  message: string
) {
  await sendEmailSafely(
    () => sendEncouragementEmail(partnerEmail, senderName, message),
    "encouragement"
  );
  
  toast.success("Encouragement sent to your partner!");
}

// Celebrate streak milestones
export async function celebrateStreak(
  email: string,
  name: string,
  streak: number
) {
  // Only send emails for special milestones
  if ([7, 30, 100, 365].includes(streak)) {
    await sendEmailSafely(
      () => sendStreakMilestoneEmail(email, name, streak),
      `${streak}-day streak`
    );
  }
  
  // Always show toast
  toast.success(`🔥 ${streak} day streak!`, {
    description: "Keep up the amazing work!",
  });
}

// Achievement unlocked
export async function notifyAchievement(
  email: string,
  name: string,
  achievementTitle: string,
  achievementDescription: string
) {
  await sendEmailSafely(
    () => sendAchievementEmail(email, name, achievementTitle, achievementDescription),
    "achievement"
  );
  
  toast.success(`🏆 ${achievementTitle}`, {
    description: achievementDescription,
    duration: 5000,
  });
}

// Subscription confirmation
export async function confirmSubscription(
  email: string,
  name: string,
  tier: "premium" | "lifetime"
) {
  const expiresAt = tier === "premium" 
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    : "";
  
  await sendEmailSafely(
    () => sendSubscriptionConfirmationEmail(email, name, tier, expiresAt),
    "subscription confirmation"
  );
  
  toast.success(`Welcome to ${tier === "lifetime" ? "Lifetime" : "Premium"}!`, {
    description: "You now have access to all premium features.",
    duration: 5000,
  });
}

// Password change confirmation
export async function confirmPasswordChange(email: string, name: string) {
  await sendEmailSafely(
    () => sendPasswordChangeConfirmationEmail(email, name),
    "password change"
  );
  
  toast.success("Password changed successfully!");
}

// ============================================
// REAL-WORLD USAGE EXAMPLES
// ============================================

// Example: After user completes a reading
export async function handleReadingComplete(userId: string, userEmail: string, userName: string, currentStreak: number) {
  // Update database
  // ... database logic here ...
  
  // Show toast
  toast.success("Reading completed!", {
    description: `Current streak: ${currentStreak} days`,
  });
  
  // Send milestone email if applicable
  if ([7, 30, 100, 365].includes(currentStreak)) {
    await celebrateStreak(userEmail, userName, currentStreak);
  }
}

// Example: Form submission with loading state
export async function handleFormSubmit(formData: any) {
  const toastId = toast.loading("Saving changes...");
  
  try {
    const response = await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) throw new Error('Failed to save');
    
    toast.success("Changes saved!", { id: toastId });
  } catch (error) {
    toast.error("Failed to save changes", { id: toastId });
  }
}

// Example: Multiple operations with sequential toasts
export async function handleComplexOperation() {
  toast.info("Starting import...");
  
  try {
    // Step 1
    await performStep1();
    toast.success("Step 1 complete");
    
    // Step 2
    await performStep2();
    toast.success("Step 2 complete");
    
    // Final
    toast.success("Import completed!", {
      description: "All data has been imported successfully.",
    });
  } catch (error) {
    toast.error("Import failed", {
      description: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function performStep1() {
  // Implementation
}

async function performStep2() {
  // Implementation
}

// ============================================
// BEST PRACTICES
// ============================================

/**
 * DO:
 * - Use toasts for immediate feedback
 * - Keep toast messages short and clear
 * - Use appropriate toast types (success, error, info, warning)
 * - Handle email failures gracefully (don't block UX)
 * - Send emails for important events only
 * 
 * DON'T:
 * - Show toasts for every single action
 * - Use long messages in toasts
 * - Block operations waiting for emails
 * - Spam users with too many emails
 * - Show error toasts for network issues (use retry logic)
 */
