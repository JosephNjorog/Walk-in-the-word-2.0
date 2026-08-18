import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { userPreferences } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [prefs] = await db.select().from(userPreferences).where(eq(userPreferences.userId, session.user.id)).limit(1);
    return NextResponse.json({ preferences: prefs || null });
  } catch (error) {
    console.error("User Preferences GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

// POST - Upsert the current user's preferences (partial update)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fontSize, fontFamily, theme, notificationsEnabled, dailyReminderTime } = body;
    const updates = {
      ...(fontSize !== undefined ? { fontSize } : {}),
      ...(fontFamily !== undefined ? { fontFamily } : {}),
      ...(theme !== undefined ? { theme } : {}),
      ...(notificationsEnabled !== undefined ? { notificationsEnabled } : {}),
      ...(dailyReminderTime !== undefined ? { dailyReminderTime } : {}),
    };

    const [existing] = await db.select().from(userPreferences).where(eq(userPreferences.userId, session.user.id)).limit(1);

    const [prefs] = existing
      ? await db
          .update(userPreferences)
          .set({ ...updates, updatedAt: new Date() })
          .where(eq(userPreferences.userId, session.user.id))
          .returning()
      : await db
          .insert(userPreferences)
          .values({ userId: session.user.id, ...updates })
          .returning();

    return NextResponse.json({ preferences: prefs });
  } catch (error) {
    console.error("User Preferences POST Error:", error);
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}
