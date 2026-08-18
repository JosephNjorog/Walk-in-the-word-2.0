import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { churchMembers, user } from "@/lib/schema";
import { and, eq, or } from "drizzle-orm";

interface Context {
  params: Promise<{ id: string }>;
}

const ROLE_CYCLE = ["member", "deacon", "elder", "pastor"] as const;

async function isChurchAdmin(churchId: string, userId: string) {
  const [membership] = await db
    .select()
    .from(churchMembers)
    .where(and(eq(churchMembers.churchId, churchId), eq(churchMembers.userId, userId)))
    .limit(1);
  return membership?.role === "pastor";
}

// POST - Invite/add a member by email or username (church admin only)
export async function POST(request: NextRequest, context: Context) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: churchId } = await context.params;
    if (!(await isChurchAdmin(churchId, session.user.id))) {
      return NextResponse.json({ error: "Only church admins can invite members" }, { status: 403 });
    }

    const { userIdOrEmail } = await request.json();
    if (!userIdOrEmail) {
      return NextResponse.json({ error: "User identifier is required" }, { status: 400 });
    }

    const [invitedUser] = await db
      .select()
      .from(user)
      .where(or(eq(user.id, userIdOrEmail), eq(user.email, userIdOrEmail), eq(user.username, userIdOrEmail)))
      .limit(1);

    if (!invitedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [existing] = await db
      .select()
      .from(churchMembers)
      .where(and(eq(churchMembers.churchId, churchId), eq(churchMembers.userId, invitedUser.id)))
      .limit(1);
    if (existing) {
      return NextResponse.json({ error: "Already a member" }, { status: 400 });
    }

    const [member] = await db
      .insert(churchMembers)
      .values({ churchId, userId: invitedUser.id, role: "member" })
      .returning();

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error("Church Member POST Error:", error);
    return NextResponse.json({ error: "Failed to add member" }, { status: 500 });
  }
}

// PATCH - Cycle a member's ministry role (church admin only)
export async function PATCH(request: NextRequest, context: Context) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: churchId } = await context.params;
    if (!(await isChurchAdmin(churchId, session.user.id))) {
      return NextResponse.json({ error: "Only church admins can change roles" }, { status: 403 });
    }

    const { memberId } = await request.json();
    const [member] = await db.select().from(churchMembers).where(eq(churchMembers.id, memberId)).limit(1);
    if (!member || member.churchId !== churchId) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const currentIndex = ROLE_CYCLE.indexOf(member.role as (typeof ROLE_CYCLE)[number]);
    const nextRole = ROLE_CYCLE[(currentIndex + 1) % ROLE_CYCLE.length];

    const [updated] = await db.update(churchMembers).set({ role: nextRole }).where(eq(churchMembers.id, memberId)).returning();

    return NextResponse.json({ member: updated });
  } catch (error) {
    console.error("Church Member PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}

// DELETE - Remove a member (church admin only)
export async function DELETE(request: NextRequest, context: Context) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: churchId } = await context.params;
    if (!(await isChurchAdmin(churchId, session.user.id))) {
      return NextResponse.json({ error: "Only church admins can remove members" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");
    if (!memberId) {
      return NextResponse.json({ error: "memberId is required" }, { status: 400 });
    }

    await db.delete(churchMembers).where(and(eq(churchMembers.id, memberId), eq(churchMembers.churchId, churchId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Church Member DELETE Error:", error);
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
}
