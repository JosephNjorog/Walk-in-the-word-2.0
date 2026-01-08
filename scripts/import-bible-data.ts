/**
 * Bible Data Import Script
 * 
 * This script imports Bible data from various sources into the local PostgreSQL database.
 * 
 * Recommended Sources:
 * 1. Bible JSON (https://github.com/thiagobodruk/bible) - KJV, ASV, etc.
 * 2. Open Bible Data (https://github.com/scrollmapper/bible_databases) - SQL dumps
 * 3. Bible SuperSearch (https://github.com/Bible-Projects/believers-sword-next)
 * 
 * Usage:
 *   npm run import-bible -- --source=kjv.json
 *   npm run import-bible -- --version=KJV --file=./data/kjv.json
 */

import 'dotenv/config';
import { db } from '../src/lib/db';
import { bibleVersions, bibleBooks, bibleVerses, crossReferences } from '../src/lib/schema';
import { eq } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Bible books metadata
const BIBLE_BOOKS_DATA = [
  { name: 'Genesis', abbreviation: 'Gen', bookNumber: 1, testament: 'OT', chapters: 50, category: 'Law' },
  { name: 'Exodus', abbreviation: 'Exo', bookNumber: 2, testament: 'OT', chapters: 40, category: 'Law' },
  { name: 'Leviticus', abbreviation: 'Lev', bookNumber: 3, testament: 'OT', chapters: 27, category: 'Law' },
  { name: 'Numbers', abbreviation: 'Num', bookNumber: 4, testament: 'OT', chapters: 36, category: 'Law' },
  { name: 'Deuteronomy', abbreviation: 'Deu', bookNumber: 5, testament: 'OT', chapters: 34, category: 'Law' },
  { name: 'Joshua', abbreviation: 'Jos', bookNumber: 6, testament: 'OT', chapters: 24, category: 'History' },
  { name: 'Judges', abbreviation: 'Jdg', bookNumber: 7, testament: 'OT', chapters: 21, category: 'History' },
  { name: 'Ruth', abbreviation: 'Rut', bookNumber: 8, testament: 'OT', chapters: 4, category: 'History' },
  { name: '1 Samuel', abbreviation: '1Sa', bookNumber: 9, testament: 'OT', chapters: 31, category: 'History' },
  { name: '2 Samuel', abbreviation: '2Sa', bookNumber: 10, testament: 'OT', chapters: 24, category: 'History' },
  { name: '1 Kings', abbreviation: '1Ki', bookNumber: 11, testament: 'OT', chapters: 22, category: 'History' },
  { name: '2 Kings', abbreviation: '2Ki', bookNumber: 12, testament: 'OT', chapters: 25, category: 'History' },
  { name: '1 Chronicles', abbreviation: '1Ch', bookNumber: 13, testament: 'OT', chapters: 29, category: 'History' },
  { name: '2 Chronicles', abbreviation: '2Ch', bookNumber: 14, testament: 'OT', chapters: 36, category: 'History' },
  { name: 'Ezra', abbreviation: 'Ezr', bookNumber: 15, testament: 'OT', chapters: 10, category: 'History' },
  { name: 'Nehemiah', abbreviation: 'Neh', bookNumber: 16, testament: 'OT', chapters: 13, category: 'History' },
  { name: 'Esther', abbreviation: 'Est', bookNumber: 17, testament: 'OT', chapters: 10, category: 'History' },
  { name: 'Job', abbreviation: 'Job', bookNumber: 18, testament: 'OT', chapters: 42, category: 'Wisdom' },
  { name: 'Psalms', abbreviation: 'Psa', bookNumber: 19, testament: 'OT', chapters: 150, category: 'Wisdom' },
  { name: 'Proverbs', abbreviation: 'Pro', bookNumber: 20, testament: 'OT', chapters: 31, category: 'Wisdom' },
  { name: 'Ecclesiastes', abbreviation: 'Ecc', bookNumber: 21, testament: 'OT', chapters: 12, category: 'Wisdom' },
  { name: 'Song of Solomon', abbreviation: 'Sng', bookNumber: 22, testament: 'OT', chapters: 8, category: 'Wisdom' },
  { name: 'Isaiah', abbreviation: 'Isa', bookNumber: 23, testament: 'OT', chapters: 66, category: 'Prophets' },
  { name: 'Jeremiah', abbreviation: 'Jer', bookNumber: 24, testament: 'OT', chapters: 52, category: 'Prophets' },
  { name: 'Lamentations', abbreviation: 'Lam', bookNumber: 25, testament: 'OT', chapters: 5, category: 'Prophets' },
  { name: 'Ezekiel', abbreviation: 'Ezk', bookNumber: 26, testament: 'OT', chapters: 48, category: 'Prophets' },
  { name: 'Daniel', abbreviation: 'Dan', bookNumber: 27, testament: 'OT', chapters: 12, category: 'Prophets' },
  { name: 'Hosea', abbreviation: 'Hos', bookNumber: 28, testament: 'OT', chapters: 14, category: 'Prophets' },
  { name: 'Joel', abbreviation: 'Jol', bookNumber: 29, testament: 'OT', chapters: 3, category: 'Prophets' },
  { name: 'Amos', abbreviation: 'Amo', bookNumber: 30, testament: 'OT', chapters: 9, category: 'Prophets' },
  { name: 'Obadiah', abbreviation: 'Oba', bookNumber: 31, testament: 'OT', chapters: 1, category: 'Prophets' },
  { name: 'Jonah', abbreviation: 'Jon', bookNumber: 32, testament: 'OT', chapters: 4, category: 'Prophets' },
  { name: 'Micah', abbreviation: 'Mic', bookNumber: 33, testament: 'OT', chapters: 7, category: 'Prophets' },
  { name: 'Nahum', abbreviation: 'Nam', bookNumber: 34, testament: 'OT', chapters: 3, category: 'Prophets' },
  { name: 'Habakkuk', abbreviation: 'Hab', bookNumber: 35, testament: 'OT', chapters: 3, category: 'Prophets' },
  { name: 'Zephaniah', abbreviation: 'Zep', bookNumber: 36, testament: 'OT', chapters: 3, category: 'Prophets' },
  { name: 'Haggai', abbreviation: 'Hag', bookNumber: 37, testament: 'OT', chapters: 2, category: 'Prophets' },
  { name: 'Zechariah', abbreviation: 'Zec', bookNumber: 38, testament: 'OT', chapters: 14, category: 'Prophets' },
  { name: 'Malachi', abbreviation: 'Mal', bookNumber: 39, testament: 'OT', chapters: 4, category: 'Prophets' },
  { name: 'Matthew', abbreviation: 'Mat', bookNumber: 40, testament: 'NT', chapters: 28, category: 'Gospel' },
  { name: 'Mark', abbreviation: 'Mrk', bookNumber: 41, testament: 'NT', chapters: 16, category: 'Gospel' },
  { name: 'Luke', abbreviation: 'Luk', bookNumber: 42, testament: 'NT', chapters: 24, category: 'Gospel' },
  { name: 'John', abbreviation: 'Jhn', bookNumber: 43, testament: 'NT', chapters: 21, category: 'Gospel' },
  { name: 'Acts', abbreviation: 'Act', bookNumber: 44, testament: 'NT', chapters: 28, category: 'History' },
  { name: 'Romans', abbreviation: 'Rom', bookNumber: 45, testament: 'NT', chapters: 16, category: 'Epistles' },
  { name: '1 Corinthians', abbreviation: '1Co', bookNumber: 46, testament: 'NT', chapters: 16, category: 'Epistles' },
  { name: '2 Corinthians', abbreviation: '2Co', bookNumber: 47, testament: 'NT', chapters: 13, category: 'Epistles' },
  { name: 'Galatians', abbreviation: 'Gal', bookNumber: 48, testament: 'NT', chapters: 6, category: 'Epistles' },
  { name: 'Ephesians', abbreviation: 'Eph', bookNumber: 49, testament: 'NT', chapters: 6, category: 'Epistles' },
  { name: 'Philippians', abbreviation: 'Php', bookNumber: 50, testament: 'NT', chapters: 4, category: 'Epistles' },
  { name: 'Colossians', abbreviation: 'Col', bookNumber: 51, testament: 'NT', chapters: 4, category: 'Epistles' },
  { name: '1 Thessalonians', abbreviation: '1Th', bookNumber: 52, testament: 'NT', chapters: 5, category: 'Epistles' },
  { name: '2 Thessalonians', abbreviation: '2Th', bookNumber: 53, testament: 'NT', chapters: 3, category: 'Epistles' },
  { name: '1 Timothy', abbreviation: '1Ti', bookNumber: 54, testament: 'NT', chapters: 6, category: 'Epistles' },
  { name: '2 Timothy', abbreviation: '2Ti', bookNumber: 55, testament: 'NT', chapters: 4, category: 'Epistles' },
  { name: 'Titus', abbreviation: 'Tit', bookNumber: 56, testament: 'NT', chapters: 3, category: 'Epistles' },
  { name: 'Philemon', abbreviation: 'Phm', bookNumber: 57, testament: 'NT', chapters: 1, category: 'Epistles' },
  { name: 'Hebrews', abbreviation: 'Heb', bookNumber: 58, testament: 'NT', chapters: 13, category: 'Epistles' },
  { name: 'James', abbreviation: 'Jas', bookNumber: 59, testament: 'NT', chapters: 5, category: 'Epistles' },
  { name: '1 Peter', abbreviation: '1Pe', bookNumber: 60, testament: 'NT', chapters: 5, category: 'Epistles' },
  { name: '2 Peter', abbreviation: '2Pe', bookNumber: 61, testament: 'NT', chapters: 3, category: 'Epistles' },
  { name: '1 John', abbreviation: '1Jn', bookNumber: 62, testament: 'NT', chapters: 5, category: 'Epistles' },
  { name: '2 John', abbreviation: '2Jn', bookNumber: 63, testament: 'NT', chapters: 1, category: 'Epistles' },
  { name: '3 John', abbreviation: '3Jn', bookNumber: 64, testament: 'NT', chapters: 1, category: 'Epistles' },
  { name: 'Jude', abbreviation: 'Jud', bookNumber: 65, testament: 'NT', chapters: 1, category: 'Epistles' },
  { name: 'Revelation', abbreviation: 'Rev', bookNumber: 66, testament: 'NT', chapters: 22, category: 'Prophecy' },
];

interface ImportOptions {
  version: string;
  file: string;
  format?: 'json' | 'sql' | 'csv';
  skipBooks?: boolean;
  skipVersions?: boolean;
}

/**
 * Import Bible books metadata
 */
async function importBooksMetadata() {
  console.log('📚 Importing Bible books metadata...');
  
  try {
    await db.insert(bibleBooks).values(BIBLE_BOOKS_DATA).onConflictDoNothing();
    console.log('✅ Successfully imported', BIBLE_BOOKS_DATA.length, 'books');
  } catch (error) {
    console.error('❌ Error importing books:', error);
  }
}

/**
 * Import Bible version
 */
async function importVersion(abbreviation: string, name: string, language: string = 'en') {
  console.log(`📖 Importing version: ${name} (${abbreviation})...`);
  
  try {
    // Check if version already exists
    const [existingVersion] = await db.select()
      .from(bibleVersions)
      .where(eq(bibleVersions.abbreviation, abbreviation))
      .limit(1);
    
    if (existingVersion) {
      console.log('ℹ️  Version already exists with ID:', existingVersion.id);
      return existingVersion.id;
    }
    
    const [version] = await db.insert(bibleVersions).values({
      abbreviation,
      name,
      language,
      isDefault: abbreviation === 'KJV',
      copyright: abbreviation === 'KJV' ? 'Public Domain' : null,
    }).returning();
    
    console.log('✅ Version imported with ID:', version.id);
    return version.id;
  } catch (error) {
    console.error('❌ Error importing version:', error);
    return null;
  }
}

/**
 * Import verses from JSON format
 * Expected format: { books: [{ name, chapters: [[verses]] }] }
 */
async function importFromJSON(versionId: number, filePath: string) {
  console.log('📄 Reading JSON file:', filePath);
  
  try {
    let fileContent = readFileSync(filePath, 'utf-8');
    // Remove BOM if present
    if (fileContent.charCodeAt(0) === 0xFEFF) {
      fileContent = fileContent.slice(1);
    }
    const data = JSON.parse(fileContent);
    let totalVerses = 0;
    
    // Handle both { books: [...] } and direct array formats
    const books = Array.isArray(data) ? data : data.books;
    
    for (const book of books) {
      // Find book ID
      const bookData = BIBLE_BOOKS_DATA.find(b => 
        b.name === book.name || 
        b.abbreviation === book.abbrev ||
        b.abbreviation.toLowerCase() === (book.abbrev || '').toLowerCase() ||
        b.name.toLowerCase() === book.name.toLowerCase()
      );
      
      if (!bookData) {
        console.warn(`⚠️  Book not found: ${book.name || book.abbrev}`);
        continue;
      }
      
      const [bookRecord] = await db.select()
        .from(bibleBooks)
        .where(eq(bibleBooks.name, bookData.name))
        .limit(1);
      
      if (!bookRecord) {
        console.warn(`⚠️  Book not in database: ${bookData.name}`);
        continue;
      }
      
      console.log(`  Importing ${bookData.name}...`);
      
      // Import chapters
      for (let chapterNum = 0; chapterNum < book.chapters.length; chapterNum++) {
        const chapter = book.chapters[chapterNum];
        const verses = [];
        
        for (let verseNum = 0; verseNum < chapter.length; verseNum++) {
          verses.push({
            versionId,
            bookId: bookRecord.id,
            chapter: chapterNum + 1,
            verse: verseNum + 1,
            text: chapter[verseNum],
          });
        }
        
        if (verses.length > 0) {
          await db.insert(bibleVerses).values(verses);
          totalVerses += verses.length;
        }
      }
    }
    
    console.log(`✅ Successfully imported ${totalVerses} verses`);
  } catch (error) {
    console.error('❌ Error importing from JSON:', error);
  }
}

/**
 * Import from alternative JSON format
 * Expected format: [{ book, chapter, verse, text }]
 */
async function importFromSimpleJSON(versionId: number, filePath: string) {
  console.log('📄 Reading simple JSON file:', filePath);
  
  try {
    let fileContent = readFileSync(filePath, 'utf-8');
    // Remove BOM if present
    if (fileContent.charCodeAt(0) === 0xFEFF) {
      fileContent = fileContent.slice(1);
    }
    const verses = JSON.parse(fileContent);
    const batchSize = 1000;
    let totalImported = 0;
    
    for (let i = 0; i < verses.length; i += batchSize) {
      const batch = verses.slice(i, i + batchSize);
      const versesToInsert = [];
      
      for (const verse of batch) {
        const bookData = BIBLE_BOOKS_DATA.find(b => 
          b.name === verse.book || 
          b.abbreviation === verse.book
        );
        
        if (!bookData) continue;
        
        const [bookRecord] = await db.select()
          .from(bibleBooks)
          .where(eq(bibleBooks.name, bookData.name))
          .limit(1);
        
        if (!bookRecord) continue;
        
        versesToInsert.push({
          versionId,
          bookId: bookRecord.id,
          chapter: verse.chapter,
          verse: verse.verse,
          text: verse.text,
        });
      }
      
      if (versesToInsert.length > 0) {
        await db.insert(bibleVerses).values(versesToInsert);
        totalImported += versesToInsert.length;
        console.log(`  Imported ${totalImported}/${verses.length} verses...`);
      }
    }
    
    console.log(`✅ Successfully imported ${totalImported} verses`);
  } catch (error) {
    console.error('❌ Error importing from simple JSON:', error);
  }
}

/**
 * Main import function
 */
async function importBibleData(options: ImportOptions) {
  console.log('🚀 Starting Bible data import...\n');
  
  // Import books metadata first
  if (!options.skipBooks) {
    await importBooksMetadata();
  }
  
  // Import version
  let versionId: number | null = null;
  if (!options.skipVersions) {
    versionId = await importVersion(
      options.version,
      getVersionName(options.version)
    );
  } else {
    // Get existing version ID
    const [version] = await db.select()
      .from(bibleVersions)
      .where(eq(bibleVersions.abbreviation, options.version))
      .limit(1);
    versionId = version?.id || null;
  }
  
  if (!versionId) {
    console.error('❌ Failed to get version ID');
    return;
  }
  
  // Import verses based on format
  const format = options.format || 'json';
  const filePath = resolve(options.file);
  
  if (format === 'json') {
    // Try to detect JSON structure
    let fileContent = readFileSync(filePath, 'utf-8');
    // Remove BOM if present
    if (fileContent.charCodeAt(0) === 0xFEFF) {
      fileContent = fileContent.slice(1);
    }
    const data = JSON.parse(fileContent);
    if (Array.isArray(data)) {
      // Check if it's an array of books (Bible JSON format) or array of verses
      if (data[0] && data[0].chapters && Array.isArray(data[0].chapters)) {
        // Bible JSON format: array of books with chapters
        await importFromJSON(versionId, filePath);
      } else {
        // Simple format: array of individual verses
        await importFromSimpleJSON(versionId, filePath);
      }
    } else {
      // Object format with books property
      await importFromJSON(versionId, filePath);
    }
  }
  
  console.log('\n🎉 Import complete!');
}

function getVersionName(abbreviation: string): string {
  const names: Record<string, string> = {
    'KJV': 'King James Version',
    'ASV': 'American Standard Version',
    'WEB': 'World English Bible',
    'NIV': 'New International Version',
    'ESV': 'English Standard Version',
    'NKJV': 'New King James Version',
    'NLT': 'New Living Translation',
    'NASB': 'New American Standard Bible',
  };
  return names[abbreviation] || abbreviation;
}

// Parse command line arguments
function parseArgs(): ImportOptions {
  const args = process.argv.slice(2);
  const options: Partial<ImportOptions> = {};
  
  for (const arg of args) {
    if (arg.startsWith('--version=')) {
      options.version = arg.split('=')[1];
    } else if (arg.startsWith('--file=')) {
      options.file = arg.split('=')[1];
    } else if (arg.startsWith('--format=')) {
      options.format = arg.split('=')[1] as any;
    } else if (arg === '--skip-books') {
      options.skipBooks = true;
    } else if (arg === '--skip-versions') {
      options.skipVersions = true;
    }
  }
  
  if (!options.version || !options.file) {
    console.error('Usage: npm run import-bible -- --version=KJV --file=./data/kjv.json');
    process.exit(1);
  }
  
  return options as ImportOptions;
}

// Run if called directly
if (require.main === module) {
  const options = parseArgs();
  importBibleData(options)
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

export { importBibleData, importBooksMetadata, importVersion };
