import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { groups, groupMembers, user } from "@/lib/schema";
import { and, eq, sql, notInArray } from "drizzle-orm";

// GET - Browse public groups the current user hasn't joined yet
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const myGroupIds = (
      await db
        .select({ groupId: groupMembers.groupId })
        .from(groupMembers)
        .where(eq(groupMembers.userId, session.user.id))
    ).map((r) => r.groupId!);

    const publicGroups = await db
      .select({
        id: groups.id,
        name: groups.name,
        description: groups.description,
        type: groups.type,
        maxMembers: groups.maxMembers,
        imageUrl: groups.imageUrl,
        leaderName: user.name,
        createdAt: groups.createdAt,
      })
      .from(groups)
      .leftJoin(user, eq(groups.leaderId, user.id))
      .where(
        myGroupIds.length > 0
          ? and(eq(groups.privacy, "public"), notInArray(groups.id, myGroupIds))
          : eq(groups.privacy, "public")
      )
      .orderBy(sql`${groups.createdAt} DESC`)
      .limit(30);

    const withCounts = await Promise.all(
      publicGroups.map(async (group) => {
        const [memberCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(groupMembers)
          .where(eq(groupMembers.groupId, group.id));
        return { ...group, memberCount: memberCount?.count || 0 };
      })
    );

    return NextResponse.json({ groups: withCounts });
  } catch (error) {
    console.error("Groups Discover GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}
