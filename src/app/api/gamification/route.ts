import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  readingProgress,
  journalEntries,
  memoryVerses,
  groupMembers,
  achievements,
  userLevels,
  challenges,
  challengeParticipants,
  user,
} from "@/lib/schema";
import { eq, gte, and, sql } from "drizzle-orm";
import { BADGES, tierForXp } from "@/lib/gamification";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const [progress, [{ count: journalCount }], [{ count: masteredVerses }], [{ count: groupCount }], [userRow]] =
      await Promise.all([
        db.select().from(readingProgress).where(eq(readingProgress.userId, userId)),
        db.select({ count: sql<number>`count(*)` }).from(journalEntries).where(eq(journalEntries.userId, userId)),
        db
          .select({ count: sql<number>`count(*)` })
          .from(memoryVerses)
          .where(and(eq(memoryVerses.userId, userId), gte(memoryVerses.masteryLevel, 5))),
        db.select({ count: sql<number>`count(*)` }).from(groupMembers).where(eq(groupMembers.userId, userId)),
        db.select().from(user).where(eq(user.id, userId)).limit(1),
      ]);

    const chaptersRead = progress.length;
    const longestStreak = userRow?.longestStreak || 0;
    const genesisChapters = new Set(progress.filter((p) => p.book === "Genesis").map((p) => p.chapter));
    const genesisComplete = genesisChapters.size >= 50;

    const earned = new Set<string>();
    if (chaptersRead >= 1) earned.add("first_chapter");
    if (longestStreak >= 7) earned.add("week_streak");
    if (longestStreak >= 30) earned.add("month_streak");
    if (genesisComplete) earned.add("genesis_complete");
    if (chaptersRead >= 100) earned.add("century");
    if (masteredVerses >= 1) earned.add("first_verse");
    if (journalCount >= 5) earned.add("journaler");
    if (groupCount >= 1) earned.add("community");

    const existingAchievements = await db.select().from(achievements).where(eq(achievements.userId, userId));
    const existingTypes = new Set(existingAchievements.map((a) => a.type));

    const newlyEarned = Array.from(earned).filter((type) => !existingTypes.has(type));
    if (newlyEarned.length > 0) {
      await db.insert(achievements).values(newlyEarned.map((type) => ({ userId, type })));
    }

    // XP / level - simple derived formula, persisted so it can be read elsewhere (e.g. leaderboards later)
    const totalXp = chaptersRead * 10 + masteredVerses * 25 + journalCount * 15 + longestStreak * 5;
    const tier = tierForXp(totalXp);
    const [existingLevel] = await db.select().from(userLevels).where(eq(userLevels.userId, userId)).limit(1);
    if (existingLevel) {
      await db
        .update(userLevels)
        .set({ currentLevel: tier.level, totalXp, levelName: tier.name, nextLevelXp: tier.nextLevelXp, updatedAt: new Date() })
        .where(eq(userLevels.userId, userId));
    } else {
      await db.insert(userLevels).values({ userId, currentLevel: tier.level, totalXp, levelName: tier.name, nextLevelXp: tier.nextLevelXp });
    }

    const badges = BADGES.map((b) => ({ ...b, unlocked: earned.has(b.type) }));

    const activeChallenges = await db.select().from(challenges).where(eq(challenges.isActive, true));
    const myParticipation = await db.select().from(challengeParticipants).where(eq(challengeParticipants.userId, userId));
    const participationMap = new Map(myParticipation.map((p) => [p.challengeId, p]));

    const challengesView = activeChallenges.map((c) => {
      const mine = participationMap.get(c.id);
      let goalCount = 0;
      try {
        goalCount = JSON.parse(c.goal || "{}").count || 0;
      } catch {
        goalCount = 0;
      }
      return {
        id: c.id,
        name: c.name,
        description: c.description,
        participantCount: c.participantCount || 0,
        goalCount,
        joined: !!mine,
        progress: mine?.progress || 0,
      };
    });

    return NextResponse.json({
      level: { currentLevel: tier.level, levelName: tier.name, totalXp, nextLevelXp: tier.nextLevelXp },
      badges,
      challenges: challengesView,
      stats: { chaptersRead, journalCount, masteredVerses, longestStreak },
    });
  } catch (error) {
    console.error("Gamification GET Error:", error);
    return NextResponse.json({ error: "Failed to load gamification data" }, { status: 500 });
  }
}
