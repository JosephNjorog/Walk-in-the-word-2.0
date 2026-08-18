import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { churches, churchMembers } from "@/lib/schema";
import { eq } from "drizzle-orm";

// GET - The current user's church membership, if any
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [membership] = await db
      .select()
      .from(churchMembers)
      .where(eq(churchMembers.userId, session.user.id))
      .limit(1);

    if (!membership) {
      return NextResponse.json({ church: null });
    }

    const [church] = await db.select().from(churches).where(eq(churches.id, membership.churchId!)).limit(1);

    return NextResponse.json({ church, role: membership.role });
  } catch (error) {
    console.error("Churches GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch church" }, { status: 500 });
  }
}

// POST - Register a new church (creator becomes pastor/admin)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, location, denomination, description } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Church name is required" }, { status: 400 });
    }

    const [church] = await db
      .insert(churches)
      .values({
        name: name.trim(),
        location,
        denomination,
        description,
        adminId: session.user.id,
        isVerified: false,
        memberCount: 1,
      })
      .returning();

    await db.insert(churchMembers).values({
      churchId: church.id,
      userId: session.user.id,
      role: "pastor",
    });

    return NextResponse.json({ church }, { status: 201 });
  } catch (error) {
    console.error("Churches POST Error:", error);
    return NextResponse.json({ error: "Failed to register church" }, { status: 500 });
  }
}
