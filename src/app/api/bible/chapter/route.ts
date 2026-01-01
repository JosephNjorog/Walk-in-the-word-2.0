import { getChapterContent } from "@/lib/bible";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bibleId = searchParams.get("bibleId");
  const chapterId = searchParams.get("chapterId");

  if (!bibleId || !chapterId) {
    return NextResponse.json({ error: "Missing bibleId or chapterId" }, { status: 400 });
  }

  try {
    const chapter = await getChapterContent(bibleId, chapterId);
    return NextResponse.json(chapter);
  } catch (error) {
    console.error("Bible Chapter API Error:", error);
    return NextResponse.json({ error: "Failed to fetch Bible chapter" }, { status: 500 });
  }
}
