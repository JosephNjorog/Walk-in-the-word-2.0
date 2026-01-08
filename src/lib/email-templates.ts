// Additional email templates for Walk in the Word

export function getStreakMilestoneEmailHtml(name: string, streak: number) {
  const milestoneMessages = {
    7: { emoji: "🌟", title: "One Week Strong!", message: "You've completed your first week of consistent reading!" },
    30: { emoji: "🔥", title: "30-Day Warrior!", message: "A full month of walking in the Word!" },
    100: { emoji: "💎", title: "Century Club!", message: "100 days of faithfulness - incredible!" },
    365: { emoji: "🏆", title: "One Year Champion!", message: "A full year of daily Scripture reading!" }
  };

  const milestone = milestoneMessages[streak as keyof typeof milestoneMessages] || 
    { emoji: "⭐", title: `${streak} Day Streak!`, message: "Keep going strong!" };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #f59e0b 50%, #eab308 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 10px;">${milestone.emoji}</div>
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">${milestone.title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px; text-align: center;">
              <h2 style="color: #1e3a5f; margin: 0 0 20px; font-size: 24px;">Congratulations, ${name}!</h2>
              <p style="color: #4b5563; font-size: 18px; line-height: 1.6; margin: 0 0 30px;">
                ${milestone.message}
              </p>
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 30px; border-radius: 12px; margin: 30px 0;">
                <div style="font-size: 56px; font-weight: 700; color: #1e3a5f; margin-bottom: 10px;">
                  ${streak}
                </div>
                <p style="color: #92400e; font-size: 16px; margin: 0; font-weight: 600;">
                  Days of Consistent Reading
                </p>
              </div>
              <div style="background-color: #f0f9ff; border-left: 4px solid #1e3a5f; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #1e3a5f; font-style: italic; margin: 0; font-size: 16px; line-height: 1.6;">
                  "But his delight is in the law of the Lord, and in His law he meditates day and night."
                </p>
                <p style="color: #6b7280; margin: 10px 0 0; font-size: 14px;">— Psalm 1:2</p>
              </div>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-top: 20px;">
                Continue Reading
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Walk in the Word
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function getAchievementUnlockedEmailHtml(name: string, achievementTitle: string, achievementDescription: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 10px;">🏆</div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Achievement Unlocked!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px; text-align: center;">
              <h2 style="color: #1e3a5f; margin: 0 0 20px; font-size: 24px;">Well done, ${name}!</h2>
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 30px; border-radius: 12px; margin: 30px 0; border: 3px solid #f59e0b;">
                <p style="color: #92400e; font-size: 20px; font-weight: 700; margin: 0 0 10px;">
                  ${achievementTitle}
                </p>
                <p style="color: #6b7280; font-size: 16px; margin: 0;">
                  ${achievementDescription}
                </p>
              </div>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                Keep up the great work! Every step you take in the Word brings you closer to spiritual growth.
              </p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/achievements" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-top: 20px;">
                View All Achievements
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Walk in the Word
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function getSubscriptionConfirmationEmailHtml(name: string, tier: string, expiresAt: string) {
  const tierInfo = {
    premium: {
      name: "Premium",
      color: "#d4a853",
      features: ["AI-powered insights", "Unlimited reading plans", "Advanced progress tracking", "Priority support"]
    },
    lifetime: {
      name: "Lifetime Access",
      color: "#1e3a5f",
      features: ["All Premium features", "Lifetime updates", "Exclusive community access", "VIP support"]
    }
  };

  const info = tierInfo[tier as keyof typeof tierInfo] || tierInfo.premium;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background: linear-gradient(135deg, ${info.color} 0%, #2d5a87 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 10px;">✨</div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to ${info.name}!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #1e3a5f; margin: 0 0 20px; font-size: 24px;">Thank you, ${name}!</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                Your subscription is now active. You now have access to all ${info.name} features:
              </p>
              <div style="background-color: #f9fafb; padding: 25px; border-radius: 12px; margin: 20px 0;">
                ${info.features.map(feature => `
                  <div style="margin-bottom: 12px;">
                    <span style="color: #10b981; font-size: 20px; margin-right: 10px;">✓</span>
                    <span style="color: #1e3a5f; font-size: 16px;">${feature}</span>
                  </div>
                `).join('')}
              </div>
              ${tier !== 'lifetime' ? `
                <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 20px 0;">
                  Your subscription ${expiresAt ? `will renew on ${expiresAt}` : 'is now active'}
                </p>
              ` : ''}
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Start Exploring
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0 0 10px;">
                Need help? <a href="${process.env.NEXT_PUBLIC_SITE_URL}/support" style="color: #6366f1; text-decoration: none;">Contact Support</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Walk in the Word
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function getPasswordChangeConfirmationEmailHtml(name: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 10px;">✅</div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Password Changed</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #1e3a5f; margin: 0 0 20px; font-size: 24px;">Hi ${name},</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Your password has been successfully changed. You can now sign in with your new password.
              </p>
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>Didn't make this change?</strong><br>
                  If you didn't request this password change, please contact our support team immediately to secure your account.
                </p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/login" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Sign In
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Walk in the Word
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
