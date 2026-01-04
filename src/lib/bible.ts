const BIBLE_API_URL = "https://rest.api.bible/v1";

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

const FALLBACK_VERSIONS: BibleVersion[] = [
  { id: "de4e12af7f28f599-01", name: "King James Version", abbreviation: "KJV" },
  { id: "06125adcc2d5898a-01", name: "American Standard Version", abbreviation: "ASV" },
  { id: "9879dbb7cfe39e4d-01", name: "World English Bible", abbreviation: "WEB" },
];

export async function getBibleVersions(): Promise<BibleVersion[]> {
  const apiKey = process.env.BIBLE_API_KEY;
  if (!apiKey || apiKey.trim().length < 5) {
    console.warn("Bible API key not configured or too short, using fallback versions");
    return FALLBACK_VERSIONS;
  }

  try {
    const response = await fetch(`${BIBLE_API_URL}/bibles`, {
      headers: { "api-key": apiKey },
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

export async function getChapterContent(bibleId: string, chapterId: string): Promise<BibleChapter> {
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
