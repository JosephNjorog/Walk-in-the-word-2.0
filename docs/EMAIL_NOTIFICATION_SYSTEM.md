# Email & Notifications System Implementation Guide

## Overview

This guide documents the comprehensive email and notification system implemented for Walk in the Word application.

## 🎯 Features Implemented

### 1. Toast Notifications
- **Library**: Sonner (already integrated)
- **Location**: Root layout with enhanced configuration
- **Features**:
  - Rich colors for better visual feedback
  - Auto-expand for detailed messages
  - 4-second duration
  - Close button for user control
  - Custom styling support

**Usage Example**:
```typescript
import { toast } from "sonner";

// Success
toast.success("Reading progress saved!");

// Error
toast.error("Failed to load content");

// Info
toast.info("New feature available!");

// Warning
toast.warning("Your streak is at risk!");

// Loading
toast.loading("Saving your progress...");

// Promise-based
toast.promise(
  fetch('/api/data'),
  {
    loading: 'Loading...',
    success: 'Data loaded!',
    error: 'Failed to load'
  }
);
```

### 2. Email System

#### Email Templates Available

1. **Welcome Email** (`getWelcomeEmailHtml`)
   - Sent when new users sign up
   - Includes app introduction and first steps
   - Beautiful gradient design with Scripture verse

2. **Password Reset Email** (`getPasswordResetEmailHtml`)
   - Secure password reset link
   - 1-hour expiration notice
   - Clear security instructions

3. **Daily Reading Reminder** (`getDailyReminderEmailHtml`)
   - Morning reminder for daily reading
   - Today's reading chapter display
   - Quick access button to dashboard

4. **Partnership Invitation** (`getPartnerInviteEmailHtml`)
   - Accountability partner invites
   - Biblical encouragement
   - Accept invitation link

5. **Encouragement Message** (`getEncouragementEmailHtml`)
   - Partner-to-partner messages
   - Scripture-based design
   - Emotional support

6. **Streak Milestones** (`getStreakMilestoneEmailHtml`)
   - Celebrates 7, 30, 100, 365-day streaks
   - Dynamic emoji and messaging
   - Motivational content

7. **Achievement Unlocked** (`getAchievementUnlockedEmailHtml`)
   - Gamification notifications
   - Custom achievement details
   - Encourages continued engagement

8. **Subscription Confirmation** (`getSubscriptionConfirmationEmailHtml`)
   - Premium/Lifetime tier activation
   - Feature list display
   - Renewal information

9. **Password Change Confirmation** (`getPasswordChangeConfirmationEmailHtml`)
   - Security notification
   - Unauthorized change warning
   - Quick support access

#### Email Configuration

Set these environment variables:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Walk in the Word

# App URL (for email links)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

#### Email Utility Functions

Use the helper functions from `src/lib/email-utils.ts`:

```typescript
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

// Example: Send welcome email
await sendWelcomeEmail(user.email, user.name);

// Example: With error handling
await sendEmailSafely(
  () => sendStreakMilestoneEmail(user.email, user.name, 30),
  "30-day streak"
);
```

### 3. Password Reset Flow

#### Frontend Pages

1. **Forgot Password Page** (`/forgot-password`)
   - Email input form
   - Success confirmation screen
   - Toast notifications for feedback
   - Beautiful UI with animations

2. **Reset Password Page** (`/reset-password`)
   - Token validation from URL
   - New password input with strength indicator
   - Confirm password validation
   - Show/hide password toggle
   - Success state with auto-redirect

#### API Endpoints

1. **POST `/api/auth/forgot-password`**
   ```typescript
   // Request
   {
     "email": "user@example.com"
   }
   
   // Response
   {
     "success": true,
     "message": "If an account exists with this email, a password reset link has been sent."
   }
   ```

2. **POST `/api/auth/reset-password`**
   ```typescript
   // Request
   {
     "token": "reset-token",
     "email": "user@example.com",
     "password": "newpassword123"
   }
   
   // Response
   {
     "success": true,
     "message": "Password has been reset successfully"
   }
   ```

#### Security Features

- Email enumeration protection (always returns success)
- Reset tokens with 1-hour expiration
- Minimum 8-character password requirement
- Password confirmation validation
- Secure token generation using crypto

## 📧 Automated Email Triggers

### Current Integrations

1. **User Registration** (✅ Implemented)
   - Welcome email sent automatically in `src/lib/auth.ts`
   - Triggered in `onAfterSignUp` hook

### Recommended Future Integrations

Add these email triggers in your application logic:

```typescript
// After user completes a reading
if (newStreak % 7 === 0) {
  await sendStreakMilestoneEmail(user.email, user.name, newStreak);
}

// When achievement is unlocked
await sendAchievementEmail(
  user.email,
  user.name,
  "First Chapter",
  "Read your first Bible chapter"
);

// Daily reminder (via cron job)
await sendDailyReminderEmail(
  user.email,
  user.name,
  "Genesis 1"
);

// Partnership invitation
await sendPartnerInviteEmail(
  inviteeEmail,
  inviter.name,
  inviteLink
);

// After subscription
await sendSubscriptionConfirmationEmail(
  user.email,
  user.name,
  "premium",
  expiryDate
);
```

## 🎨 Email Design

All emails feature:
- **Responsive design** for mobile and desktop
- **Consistent branding** with app colors
- **Biblical verses** for inspiration
- **Clear CTAs** (Call-to-Action buttons)
- **Professional gradients** matching the app theme
- **Accessibility** considerations

## 🧪 Testing

### Test Email Functionality

1. **Development Testing**:
   ```bash
   # Use Mailtrap or similar service
   SMTP_HOST=smtp.mailtrap.io
   SMTP_PORT=2525
   EMAIL_USER=your-mailtrap-username
   EMAIL_PASSWORD=your-mailtrap-password
   ```

2. **Production Testing**:
   - Use real SMTP provider (Gmail, SendGrid, AWS SES)
   - Test all email templates
   - Verify links work correctly
   - Check mobile rendering

### Test Password Reset

1. Go to `/forgot-password`
2. Enter email address
3. Check inbox for reset email
4. Click reset link
5. Enter new password
6. Verify login with new password

## 🚀 Next Steps

### Recommended Enhancements

1. **Email Preferences**
   - Allow users to opt-in/out of specific emails
   - Add settings page for email notifications

2. **Email Analytics**
   - Track email open rates
   - Monitor click-through rates
   - A/B test subject lines

3. **Additional Templates**
   - Weekly summary email
   - Group activity notifications
   - Forum mention notifications
   - Comment replies

4. **Rich Notifications**
   - In-app notification center
   - Real-time notifications via WebSocket
   - Push notifications (PWA)

5. **Email Queue**
   - Implement email queue with retry logic
   - Rate limiting for bulk emails
   - Scheduled email sending

## 📝 Usage Tips

### Toast Best Practices

```typescript
// ✅ Good
toast.success("Settings saved!");

// ❌ Avoid
toast.success("Your settings have been successfully saved to the database and will take effect immediately!");

// ✅ Good - Use loading states
const promise = fetch('/api/save');
toast.promise(promise, {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Failed to save'
});

// ❌ Avoid - Don't show toast for every action
onClick={() => {
  toast.info("Button clicked"); // Too much
  handleClick();
}}
```

### Email Best Practices

```typescript
// ✅ Good - Handle errors gracefully
try {
  await sendWelcomeEmail(user.email, user.name);
} catch (error) {
  console.error("Email failed:", error);
  // Don't fail the main operation
}

// ✅ Good - Use utility function
await sendEmailSafely(
  () => sendWelcomeEmail(user.email, user.name),
  "welcome"
);

// ❌ Avoid - Don't spam users
for (let i = 0; i < 100; i++) {
  await sendEmail(...); // Bad!
}
```

## 🔧 Troubleshooting

### Emails Not Sending

1. Check SMTP credentials
2. Verify firewall allows SMTP port
3. Check email service logs
4. Test with Mailtrap first
5. Verify environment variables are set

### Toast Not Showing

1. Ensure Toaster is in layout
2. Check for CSS conflicts
3. Verify sonner is installed
4. Check browser console for errors

### Password Reset Not Working

1. Verify token generation
2. Check token expiration logic
3. Test email delivery
4. Verify reset link format
5. Check database updates

## 📚 Resources

- [Sonner Documentation](https://sonner.emilkowal.ski/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Email Design Best Practices](https://www.campaignmonitor.com/resources/guides/email-design-best-practices/)

---

**Implemented by**: GitHub Copilot
**Date**: January 8, 2026
**Status**: ✅ Production Ready
