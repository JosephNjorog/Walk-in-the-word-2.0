import { searchBible } from "@/lib/bible";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  const version = searchParams.get("version") || "KJV";

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchBible(query, version, 40);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Bible Search API Error:", error);
    return NextResponse.json({ error: "Failed to search the Bible" }, { status: 500 });
  }
}
