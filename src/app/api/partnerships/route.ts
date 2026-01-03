import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { partnerships, user } from "@/lib/schema";
import { and, eq, or, ne } from "drizzle-orm";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    
    // Fetch all partnerships with manual joins
    const partnersData = await db
      .select({
        id: partnerships.id,
        status: partnerships.status,
        createdAt: partnerships.createdAt,
        partner: {
          id: user.id,
          name: user.name,
          username: user.username,
          image: user.image,
          currentStreak: user.currentStreak,
          lastReadAt: user.lastReadAt,
        }
      })
      .from(partnerships)
      .innerJoin(user, or(
        and(eq(partnerships.userId1, userId), eq(partnerships.userId2, user.id)),
        and(eq(partnerships.userId2, userId), eq(partnerships.userId1, user.id))
      ))
      .where(or(
        eq(partnerships.userId1, userId),
        eq(partnerships.userId2, userId)
      ));

    return NextResponse.json(partnersData);
  } catch (error) {
    console.error("Partnerships GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { partnershipId, action } = await request.json(); // action: 'accept' or 'reject'

    if (action === 'accept') {
      await db.update(partnerships)
        .set({ status: 'active' })
        .where(eq(partnerships.id, partnershipId));
    } else if (action === 'reject') {
      await db.delete(partnerships)
        .where(eq(partnerships.id, partnershipId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Partnerships POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
