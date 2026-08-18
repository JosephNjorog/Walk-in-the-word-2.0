import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { churches, churchMembers, churchAnnouncements, sermons, user } from "@/lib/schema";
import { and, desc, eq } from "drizzle-orm";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: churchId } = await context.params;

    const [church] = await db.select().from(churches).where(eq(churches.id, churchId)).limit(1);
    if (!church) {
      return NextResponse.json({ error: "Church not found" }, { status: 404 });
    }

    const [membership] = await db
      .select()
      .from(churchMembers)
      .where(and(eq(churchMembers.churchId, churchId), eq(churchMembers.userId, session.user.id)))
      .limit(1);

    const announcements = await db
      .select({
        id: churchAnnouncements.id,
        title: churchAnnouncements.title,
        body: churchAnnouncements.body,
        isPinned: churchAnnouncements.isPinned,
        createdAt: churchAnnouncements.createdAt,
      })
      .from(churchAnnouncements)
      .where(eq(churchAnnouncements.churchId, churchId))
      .orderBy(desc(churchAnnouncements.isPinned), desc(churchAnnouncements.createdAt));

    const sermonsList = await db
      .select({
        id: sermons.id,
        title: sermons.title,
        description: sermons.description,
        sermonDate: sermons.sermonDate,
        createdAt: sermons.createdAt,
        pastorName: user.name,
      })
      .from(sermons)
      .leftJoin(user, eq(sermons.pastorId, user.id))
      .where(eq(sermons.churchId, churchId))
      .orderBy(desc(sermons.createdAt));

    const members = await db
      .select({
        id: churchMembers.id,
        userId: user.id,
        name: user.name,
        role: churchMembers.role,
      })
      .from(churchMembers)
      .innerJoin(user, eq(churchMembers.userId, user.id))
      .where(eq(churchMembers.churchId, churchId))
      .orderBy(churchMembers.joinedAt);

    return NextResponse.json({
      church: { ...church, memberCount: members.length },
      isMember: !!membership,
      isAdmin: membership?.role === "pastor" || church.adminId === session.user.id,
      announcements,
      sermons: sermonsList,
      members,
    });
  } catch (error) {
    console.error("Church GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch church" }, { status: 500 });
  }
}
