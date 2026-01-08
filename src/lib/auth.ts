import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

function generateUsername(name: string, email: string): string {
    // Try to use name first, fall back to email
    const base = (name || email.split("@")[0])
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 15);
    
    // Add random numbers for uniqueness
    const random = Math.floor(Math.random() * 9999);
    return `${base}${random}`;
}

async function ensureUniqueUsername(username: string): Promise<string> {
    let finalUsername = username;
    let attempt = 0;
    
    while (attempt < 10) {
        const existing = await db.query.user.findFirst({
            where: eq(schema.user.username, finalUsername),
        });
        
        if (!existing) {
            return finalUsername;
        }
        
        // Try with different random suffix
        const base = username.replace(/\d+$/, '');
        const random = Math.floor(Math.random() * 9999);
        finalUsername = `${base}${random}`;
        attempt++;
    }
    
    // Last resort: add timestamp
    return `${username}_${Date.now()}`;
}

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...schema,
        }
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',') || [],
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== "PASTE_YOUR_GOOGLE_CLIENT_ID_HERE" ? {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    } : undefined,
    user: {
        additionalFields: {
            username: {
                type: "string",
                required: false,
            },
            readingPace: {
                type: "number",
                defaultValue: 1,
            },
            preferredVersion: {
                type: "string",
                defaultValue: "WEB",
            },
            currentStreak: {
                type: "number",
                defaultValue: 0,
            },
            longestStreak: {
                type: "number",
                defaultValue: 0,
            },
            subscriptionTier: {
                type: "string",
                defaultValue: "free",
            },
            subscriptionStatus: {
                type: "string",
                defaultValue: "inactive",
            },
            subscriptionExpiresAt: {
                type: "date",
                required: false,
            },
        }
    },
    onAfterSignUp: async (user) => {
        // Auto-generate username for users without one (OAuth)
        if (!user.username) {
            const generatedUsername = generateUsername(
                user.name || "",
                user.email || ""
            );
            const uniqueUsername = await ensureUniqueUsername(generatedUsername);
            
            await db.update(schema.user)
                .set({ username: uniqueUsername })
                .where(eq(schema.user.id, user.id));
        }

        // Send welcome email
        if (user.email) {
            try {
                const { sendEmail, getWelcomeEmailHtml } = await import("./email");
                await sendEmail({
                    to: user.email,
                    subject: "Welcome to Walk in the Word! 🙏",
                    html: getWelcomeEmailHtml(user.name || "Friend"),
                });
                console.log(`Welcome email sent to ${user.email}`);
            } catch (error) {
                console.error("Failed to send welcome email:", error);
                // Don't throw - we don't want to fail signup if email fails
            }
        }
    },
});
