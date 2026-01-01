import { getBibleVersions } from "@/lib/bible";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const versions = await getBibleVersions();
    return NextResponse.json(versions);
  } catch (error) {
    console.error("Bible Versions API Error:", error);
    return NextResponse.json({ error: "Failed to fetch Bible versions" }, { status: 500 });
  }
}
