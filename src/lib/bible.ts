import { db } from './db';
import { bibleVersions, bibleBooks, bibleVerses, crossReferences, commentaries, commentaryEntries } from './schema';
import { eq, and, sql } from 'drizzle-orm';

const BIBLE_API_URL = "https://rest.api.bible/v1";
const USE_LOCAL_DATABASE = process.env.USE_LOCAL_BIBLE === 'true'; // Toggle between local DB and API

export interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
}

export interface BibleChapter {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  content: string;
  reference: string;
  next?: { id: string; number: string };
  previous?: { id: string; number: string };
}

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface CrossReference {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  strength: number;
}

const FALLBACK_VERSIONS: BibleVersion[] = [
  { id: "de4e12af7f28f599-01", name: "King James Version", abbreviation: "KJV" },
  { id: "06125adcc2d5898a-01", name: "American Standard Version", abbreviation: "ASV" },
  { id: "9879dbb7cfe39e4d-01", name: "World English Bible", abbreviation: "WEB" },
];

/**
 * Get all available Bible versions
 * Prioritizes local database, falls back to API, then to hardcoded fallback
 */
export async function getBibleVersions(): Promise<BibleVersion[]> {
  // Try local database first
  if (USE_LOCAL_DATABASE) {
    try {
      const localVersions = await db.select().from(bibleVersions);
      if (localVersions && localVersions.length > 0) {
        return localVersions.map(v => ({
          id: v.abbreviation,
          name: v.name,
          abbreviation: v.abbreviation,
        }));
      }
    } catch (error) {
      console.error("Local Bible database error:", error);
    }
  }

  // Fall back to API
  const apiKey = process.env.BIBLE_API_KEY;
  if (!apiKey || apiKey.trim().length < 5) {
    console.warn("Bible API key not configured, using fallback versions");
    return FALLBACK_VERSIONS;
  }

  try {
    const response = await fetch(`${BIBLE_API_URL}/bibles`, {
      headers: { "api-key": apiKey },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      console.error("Bible API returned error:", response.status, await response.text());
      return FALLBACK_VERSIONS;
    }
    
    const data = await response.json();
    return data.data.map((b: any) => ({
      id: b.id,
      name: b.name,
      abbreviation: b.abbreviation,
    }));
  } catch (error) {
    console.error("Bible API error:", error);
    return FALLBACK_VERSIONS;
  }
}

/**
 * Get chapter content from local database
 */
async function getLocalChapterContent(version: string, bookName: string, chapterNum: number): Promise<BibleChapter | null> {
  try {
    // Get version ID
    const versionResult = await db.select()
      .from(bibleVersions)
      .where(eq(bibleVersions.abbreviation, version))
      .limit(1);
    
    if (!versionResult || versionResult.length === 0) return null;

    // Get book ID
    const bookResult = await db.select()
      .from(bibleBooks)
      .where(eq(bibleBooks.name, bookName))
      .limit(1);
    
    if (!bookResult || bookResult.length === 0) return null;

    const book = bookResult[0];
    const versionId = versionResult[0].id;

    // Get all verses for this chapter
    const verses = await db.select()
      .from(bibleVerses)
      .where(
        and(
          eq(bibleVerses.versionId, versionId),
          eq(bibleVerses.bookId, book.id),
          eq(bibleVerses.chapter, chapterNum)
        )
      )
      .orderBy(bibleVerses.verse);

    if (!verses || verses.length === 0) return null;

    // Format as HTML
    const content = verses.map(v => 
      `<p class="p"><span class="verse-num" data-number="${v.verse}">${v.verse} </span>${v.text}</p>`
    ).join('\n');

    // Determine next and previous chapters
    const hasNext = chapterNum < book.chapters;
    const hasPrev = chapterNum > 1;

    return {
      id: `${book.abbreviation}.${chapterNum}`,
      bibleId: version,
      number: chapterNum.toString(),
      bookId: book.abbreviation,
      content,
      reference: `${bookName} ${chapterNum}`,
      next: hasNext ? { id: `${book.abbreviation}.${chapterNum + 1}`, number: (chapterNum + 1).toString() } : undefined,
      previous: hasPrev ? { id: `${book.abbreviation}.${chapterNum - 1}`, number: (chapterNum - 1).toString() } : undefined,
    };
  } catch (error) {
    console.error("Error fetching from local Bible database:", error);
    return null;
  }
}

/**
 * Get chapter content - local database or API fallback
 */
export async function getChapterContent(bibleId: string, chapterId: string): Promise<BibleChapter> {
  const [bookId, chapterNum] = chapterId.split(".");
  const bookName = getBookName(bookId);
  
  // Try local database first
  if (USE_LOCAL_DATABASE) {
    const localContent = await getLocalChapterContent(bibleId, bookName, parseInt(chapterNum));
    if (localContent) {
      return localContent;
    }
  }

  // Fall back to API
  const apiKey = process.env.BIBLE_API_KEY;
  
  if (!apiKey || apiKey.trim().length < 5) {
    console.warn("Bible API key not configured, using fallback content");
    return getFallbackChapter(bibleId, chapterId);
  }

  try {
    const response = await fetch(
      `${BIBLE_API_URL}/bibles/${bibleId}/chapters/${chapterId}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`,
      {
        headers: { "api-key": apiKey },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Bible chapter API returned error:", response.status, errorText);
      return getFallbackChapter(bibleId, chapterId);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Bible chapter API error:", error);
    return getFallbackChapter(bibleId, chapterId);
  }
}

/**
 * Get specific verse
 */
export async function getVerse(version: string, book: string, chapter: number, verse: number): Promise<BibleVerse | null> {
  try {
    const versionResult = await db.select()
      .from(bibleVersions)
      .where(eq(bibleVersions.abbreviation, version))
      .limit(1);
    
    if (!versionResult || versionResult.length === 0) return null;

    const bookResult = await db.select()
      .from(bibleBooks)
      .where(eq(bibleBooks.name, book))
      .limit(1);
    
    if (!bookResult || bookResult.length === 0) return null;

    const verseResult = await db.select()
      .from(bibleVerses)
      .where(
        and(
          eq(bibleVerses.versionId, versionResult[0].id),
          eq(bibleVerses.bookId, bookResult[0].id),
          eq(bibleVerses.chapter, chapter),
          eq(bibleVerses.verse, verse)
        )
      )
      .limit(1);

    if (!verseResult || verseResult.length === 0) return null;

    return {
      book,
      chapter,
      verse,
      text: verseResult[0].text,
    };
  } catch (error) {
    console.error("Error fetching verse:", error);
    return null;
  }
}

/**
 * Get cross references for a verse
 */
export async function getCrossReferences(book: string, chapter: number, verse: number): Promise<CrossReference[]> {
  try {
    const bookResult = await db.select()
      .from(bibleBooks)
      .where(eq(bibleBooks.name, book))
      .limit(1);
    
    if (!bookResult || bookResult.length === 0) return [];

    const refs = await db.select({
      toBook: bibleBooks.name,
      toChapter: crossReferences.toChapter,
      toVerse: crossReferences.toVerse,
      strength: crossReferences.strength,
    })
      .from(crossReferences)
      .innerJoin(bibleBooks, eq(crossReferences.toBookId, bibleBooks.id))
      .where(
        and(
          eq(crossReferences.fromBookId, bookResult[0].id),
          eq(crossReferences.fromChapter, chapter),
          eq(crossReferences.fromVerse, verse)
        )
      )
      .orderBy(sql`${crossReferences.strength} DESC`)
      .limit(10);

    // Fetch the actual verse text for each reference
    const results: CrossReference[] = [];
    for (const ref of refs) {
      const verseData = await getVerse('KJV', ref.toBook, ref.toChapter, ref.toVerse);
      if (verseData) {
        results.push({
          ...verseData,
          strength: ref.strength || 1,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Error fetching cross references:", error);
    return [];
  }
}

/**
 * Get commentary for a chapter
 */
export async function getCommentary(commentaryName: string, book: string, chapter: number): Promise<string | null> {
  try {
    const commentaryResult = await db.select()
      .from(commentaries)
      .where(eq(commentaries.name, commentaryName))
      .limit(1);
    
    if (!commentaryResult || commentaryResult.length === 0) return null;

    const bookResult = await db.select()
      .from(bibleBooks)
      .where(eq(bibleBooks.name, book))
      .limit(1);
    
    if (!bookResult || bookResult.length === 0) return null;

    const entries = await db.select()
      .from(commentaryEntries)
      .where(
        and(
          eq(commentaryEntries.commentaryId, commentaryResult[0].id),
          eq(commentaryEntries.bookId, bookResult[0].id),
          eq(commentaryEntries.chapter, chapter)
        )
      );

    if (!entries || entries.length === 0) return null;

    return entries.map(e => e.content).join('\n\n');
  } catch (error) {
    console.error("Error fetching commentary:", error);
    return null;
  }
}

/**
 * Search Bible text
 */
export async function searchBible(query: string, version: string = 'KJV', limit: number = 50): Promise<BibleVerse[]> {
  try {
    const versionResult = await db.select()
      .from(bibleVersions)
      .where(eq(bibleVersions.abbreviation, version))
      .limit(1);
    
    if (!versionResult || versionResult.length === 0) return [];

    const results = await db.select({
      book: bibleBooks.name,
      chapter: bibleVerses.chapter,
      verse: bibleVerses.verse,
      text: bibleVerses.text,
    })
      .from(bibleVerses)
      .innerJoin(bibleBooks, eq(bibleVerses.bookId, bibleBooks.id))
      .where(
        and(
          eq(bibleVerses.versionId, versionResult[0].id),
          sql`${bibleVerses.text} ILIKE ${'%' + query + '%'}`
        )
      )
      .limit(limit);

    return results;
  } catch (error) {
    console.error("Error searching Bible:", error);
    return [];
  }
}

function getFallbackChapter(bibleId: string, chapterId: string): BibleChapter {
  const [bookId, chapterNum] = chapterId.split(".");
  const reference = `${getBookName(bookId)} ${chapterNum}`;
  
  return {
    id: chapterId,
    bibleId,
    number: chapterNum,
    bookId,
    reference,
    content: `
      <p class="p"><span class="verse-num" data-number="1">1 </span>In the beginning God created the heaven and the earth.</p>
      <p class="p"><span class="verse-num" data-number="2">2 </span>And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.</p>
      <p class="p"><span class="verse-num" data-number="3">3 </span>And God said, Let there be light: and there was light.</p>
      <p class="p"><span class="verse-num" data-number="4">4 </span>And God saw the light, that it was good: and God divided the light from the darkness.</p>
      <p class="p"><span class="verse-num" data-number="5">5 </span>And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.</p>
      <p class="p"><span class="verse-num" data-number="6">6 </span>And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.</p>
      <p class="p"><span class="verse-num" data-number="7">7 </span>And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.</p>
      <p class="p"><span class="verse-num" data-number="8">8 </span>And God called the firmament Heaven. And the evening and the morning were the second day.</p>
      <p class="p"><span class="verse-num" data-number="9">9 </span>And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.</p>
      <p class="p"><span class="verse-num" data-number="10">10 </span>And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.</p>
      <p class="mt">Note: This is sample content. To access the full Bible, please configure a valid Bible API key.</p>
    `,
  };
}

function getBookName(bookId: string): string {
  const bookNames: Record<string, string> = {
    "GEN": "Genesis", "EXO": "Exodus", "LEV": "Leviticus", "NUM": "Numbers", "DEU": "Deuteronomy",
    "JOS": "Joshua", "JDG": "Judges", "RUT": "Ruth", "1SA": "1 Samuel", "2SA": "2 Samuel",
    "1KI": "1 Kings", "2KI": "2 Kings", "1CH": "1 Chronicles", "2CH": "2 Chronicles",
    "EZR": "Ezra", "NEH": "Nehemiah", "EST": "Esther", "JOB": "Job", "PSA": "Psalms",
    "PRO": "Proverbs", "ECC": "Ecclesiastes", "SNG": "Song of Solomon", "ISA": "Isaiah",
    "JER": "Jeremiah", "LAM": "Lamentations", "EZK": "Ezekiel", "DAN": "Daniel",
    "HOS": "Hosea", "JOL": "Joel", "AMO": "Amos", "OBA": "Obadiah", "JON": "Jonah",
    "MIC": "Micah", "NAM": "Nahum", "HAB": "Habakkuk", "ZEP": "Zephaniah", "HAG": "Haggai",
    "ZEC": "Zechariah", "MAL": "Malachi", "MAT": "Matthew", "MRK": "Mark", "LUK": "Luke",
    "JHN": "John", "ACT": "Acts", "ROM": "Romans", "1CO": "1 Corinthians", "2CO": "2 Corinthians",
    "GAL": "Galatians", "EPH": "Ephesians", "PHP": "Philippians", "COL": "Colossians",
    "1TH": "1 Thessalonians", "2TH": "2 Thessalonians", "1TI": "1 Timothy", "2TI": "2 Timothy",
    "TIT": "Titus", "PHM": "Philemon", "HEB": "Hebrews", "JAS": "James", "1PE": "1 Peter",
    "2PE": "2 Peter", "1JN": "1 John", "2JN": "2 John", "3JN": "3 John", "JUD": "Jude",
    "REV": "Revelation"
  };
  return bookNames[bookId] || bookId;
}
