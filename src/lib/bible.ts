import { db } from './db';
import { bibleVersions, bibleBooks, bibleVerses, crossReferences, commentaries, commentaryEntries } from './schema';
import { eq, and, sql } from 'drizzle-orm';

export interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
}

export interface ChapterVerse {
  verse: number;
  text: string;
}

export interface BibleChapter {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  content: string;
  verses: ChapterVerse[];
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
  { id: "KJV", name: "King James Version", abbreviation: "KJV" },
  { id: "BBE", name: "Bible in Basic English", abbreviation: "BBE" },
  { id: "RVR", name: "Reina-Valera", abbreviation: "RVR" },
];

/**
 * Get all available Bible versions from local database
 */
export async function getBibleVersions(): Promise<BibleVersion[]> {
  try {
    const localVersions = await db.select().from(bibleVersions);
    if (localVersions && localVersions.length > 0) {
      return localVersions.map(v => ({
        id: v.abbreviation,
        name: v.name,
        abbreviation: v.abbreviation,
      }));
    }
    // Return fallback if database is empty
    return FALLBACK_VERSIONS;
  } catch (error) {
    console.error("Local Bible database error:", error);
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

    // Defensively dedupe by verse number in case of duplicate rows in the source data
    const seen = new Set<number>();
    const dedupedVerses = verses.filter(v => (seen.has(v.verse) ? false : (seen.add(v.verse), true)));

    // Format as HTML (legacy consumers) and as a structured array (per-verse rendering)
    const content = dedupedVerses.map(v =>
      `<p class="p"><span class="verse-num" data-number="${v.verse}">${v.verse} </span>${v.text}</p>`
    ).join('\n');
    const verseList: ChapterVerse[] = dedupedVerses.map(v => ({ verse: v.verse, text: v.text }));

    // Determine next and previous chapters
    const hasNext = chapterNum < book.chapters;
    const hasPrev = chapterNum > 1;

    return {
      id: `${book.abbreviation}.${chapterNum}`,
      bibleId: version,
      number: chapterNum.toString(),
      bookId: book.abbreviation,
      content,
      verses: verseList,
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
 * Get chapter content from local database
 */
export async function getChapterContent(bibleId: string, chapterId: string): Promise<BibleChapter> {
  const [bookId, chapterNum] = chapterId.split(".");
  const bookName = getBookName(bookId);
  
  const localContent = await getLocalChapterContent(bibleId, bookName, parseInt(chapterNum));
  if (localContent) {
    return localContent;
  }

  // Return fallback if not found
  return getFallbackChapter(bibleId, chapterId);
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

const FALLBACK_GENESIS_1_VERSES: ChapterVerse[] = [
  { verse: 1, text: "In the beginning God created the heaven and the earth." },
  { verse: 2, text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters." },
  { verse: 3, text: "And God said, Let there be light: and there was light." },
  { verse: 4, text: "And God saw the light, that it was good: and God divided the light from the darkness." },
  { verse: 5, text: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day." },
  { verse: 6, text: "And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters." },
  { verse: 7, text: "And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so." },
  { verse: 8, text: "And God called the firmament Heaven. And the evening and the morning were the second day." },
  { verse: 9, text: "And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so." },
  { verse: 10, text: "And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good." },
];

function getFallbackChapter(bibleId: string, chapterId: string): BibleChapter {
  const [bookId, chapterNum] = chapterId.split(".");
  const reference = `${getBookName(bookId)} ${chapterNum}`;
  const verses = FALLBACK_GENESIS_1_VERSES;
  const content = verses.map(v =>
    `<p class="p"><span class="verse-num" data-number="${v.verse}">${v.verse} </span>${v.text}</p>`
  ).join('\n') + '\n<p class="mt">Note: This is sample content. The full Bible text has not been imported for this translation yet.</p>';

  return {
    id: chapterId,
    bibleId,
    number: chapterNum,
    bookId,
    reference,
    content,
    verses,
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
