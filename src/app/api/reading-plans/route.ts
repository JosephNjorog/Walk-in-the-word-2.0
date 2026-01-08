import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { readingPlanTemplates, userReadingPlans } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const plans = await db.select().from(readingPlanTemplates);
    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Reading Plans GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reading plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    const [enrollment] = await db
      .insert(userReadingPlans)
      .values({
        userId: session.user.id,
        templateId: parseInt(planId),
        startDate: new Date(),
        currentDay: 1,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (error) {
    console.error("Reading Plans POST Error:", error);
    return NextResponse.json(
      { error: "Failed to enroll in plan" },
      { status: 500 }
    );
  }
}
