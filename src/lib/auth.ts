import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./schema";

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
        }
    }
});
