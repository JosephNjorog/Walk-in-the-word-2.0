import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { groupMembers } from "@/lib/schema";
import { and, eq } from "drizzle-orm";

interface Context {
  params: Promise<{ id: string }>;
}

// POST - Toggle the current user's own mute state for a group
export async function POST(request: NextRequest, context: Context) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId } = await context.params;

    const [membership] = await db
      .select()
      .from(groupMembers)
      .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, session.user.id)))
      .limit(1);

    if (!membership) {
      return NextResponse.json({ error: "Not a member of this group" }, { status: 403 });
    }

    const [updated] = await db
      .update(groupMembers)
      .set({ muted: !membership.muted })
      .where(eq(groupMembers.id, membership.id))
      .returning();

    return NextResponse.json({ muted: updated.muted });
  } catch (error) {
    console.error("Group Mute Error:", error);
    return NextResponse.json({ error: "Failed to update notification setting" }, { status: 500 });
  }
}
