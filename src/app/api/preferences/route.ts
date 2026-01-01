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

    const [prefs] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id));

    if (!prefs) {
      return NextResponse.json({
        fontSize: 18,
        fontFamily: "serif",
        theme: "light",
        notificationsEnabled: true,
        dailyReminderTime: "08:00",
      });
    }

    return NextResponse.json(prefs);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { fontSize, fontFamily, theme, notificationsEnabled, dailyReminderTime } = data;

    const [existing] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id));

    if (existing) {
      const [updated] = await db
        .update(userPreferences)
        .set({
          fontSize: fontSize ?? existing.fontSize,
          fontFamily: fontFamily ?? existing.fontFamily,
          theme: theme ?? existing.theme,
          notificationsEnabled: notificationsEnabled ?? existing.notificationsEnabled,
          dailyReminderTime: dailyReminderTime ?? existing.dailyReminderTime,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, session.user.id))
        .returning();
      return NextResponse.json(updated);
    } else {
      const [created] = await db
        .insert(userPreferences)
        .values({
          userId: session.user.id,
          fontSize: fontSize ?? 18,
          fontFamily: fontFamily ?? "serif",
          theme: theme ?? "light",
          notificationsEnabled: notificationsEnabled ?? true,
          dailyReminderTime: dailyReminderTime ?? "08:00",
        })
        .returning();
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error("Error saving preferences:", error);
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}
