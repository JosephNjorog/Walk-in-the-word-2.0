# 📖 Bible Data Import Guide

This guide explains how to populate your local Bible database with scripture content, freeing you from API rate limits.

## 🎯 Why Local Bible Database?

- ✅ **Unlimited requests** - No API rate limits
- ✅ **Lightning fast** - Local queries are instant
- ✅ **Offline-first** - Works without internet
- ✅ **Multiple translations** - Add 50+ versions easily
- ✅ **Custom features** - Full-text search, cross-references
- ✅ **Cost-effective** - No API subscription fees

## 📥 Recommended Data Sources

### 1. **Bible JSON** (Easiest - Recommended)
Repository: https://github.com/thiagobodruk/bible

**Available Versions:**
- King James Version (KJV)
- American Standard Version (ASV)
- World English Bible (WEB)
- And more...

**Format:** Clean JSON arrays ready to import

**Download:**
```bash
# Clone the repository
git clone https://github.com/thiagobodruk/bible.git bible-data

# Or download specific versions:
curl -o kjv.json https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json
curl -o asv.json https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_asv.json
```

### 2. **Open Bible Data** (Most Comprehensive)
Repository: https://github.com/scrollmapper/bible_databases

**Features:**
- SQL dumps for direct import
- Multiple languages
- Cross-references included
- Commentary data

### 3. **Bible SuperSearch API**
Repository: https://github.com/Bible-Projects/believers-sword-next

**Features:**
- Modern JSON API format
- Multiple translations
- Well-documented structure

### 4. **Crosswire Sword Modules**
Website: https://www.crosswire.org/sword/modules/

**Features:**
- 200+ translations
- Free and open-source
- Requires conversion to JSON

## 🚀 Import Instructions

### Step 1: Download Bible Data

Choose one of the sources above and download the JSON files to a `data/` directory:

```bash
mkdir data
cd data

# Download KJV from Bible JSON
curl -o kjv.json https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json

# Download ASV
curl -o asv.json https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_asv.json
```

### Step 2: Set Up Environment

Enable local Bible database in your `.env.local`:

```env
USE_LOCAL_BIBLE=true
```

### Step 3: Run Database Migrations

Ensure your database has the latest schema:

```bash
npm run db:generate
npm run db:migrate
```

### Step 4: Import Bible Data

#### Basic Import:
```bash
npm run import-bible -- --version=KJV --file=./data/kjv.json
```

#### Import Multiple Versions:
```bash
# Import KJV
npm run import-bible -- --version=KJV --file=./data/kjv.json

# Import ASV (skip books metadata on subsequent imports)
npm run import-bible -- --version=ASV --file=./data/asv.json --skip-books

# Import WEB
npm run import-bible -- --version=WEB --file=./data/web.json --skip-books
```

#### Advanced Options:
```bash
# Specify format explicitly
npm run import-bible -- --version=KJV --file=./data/kjv.json --format=json

# Skip version creation if it already exists
npm run import-bible -- --version=KJV --file=./data/kjv.json --skip-versions
```

## 📊 Data Format Examples

### Simple JSON Format
```json
[
  {
    "book": "Genesis",
    "chapter": 1,
    "verse": 1,
    "text": "In the beginning God created the heaven and the earth."
  },
  {
    "book": "Genesis",
    "chapter": 1,
    "verse": 2,
    "text": "And the earth was without form, and void..."
  }
]
```

### Structured JSON Format
```json
{
  "books": [
    {
      "name": "Genesis",
      "abbrev": "Gen",
      "chapters": [
        [
          "In the beginning God created the heaven and the earth.",
          "And the earth was without form, and void..."
        ]
      ]
    }
  ]
}
```

## 🔧 Script Configuration

Add to `package.json`:

```json
{
  "scripts": {
    "import-bible": "tsx scripts/import-bible-data.ts",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  }
}
```

## ⚡ Performance Tips

### Batch Import
The script automatically batches inserts in groups of 1,000 verses for optimal performance.

### Indexing
The schema includes indexes for fast lookups:
- `(versionId, bookId, chapter, verse)` - Single verse lookup
- `(versionId, bookId, chapter)` - Chapter lookup

### Database Optimization
```sql
-- After import, analyze tables for better query planning
ANALYZE bible_verses;
ANALYZE bible_books;
ANALYZE bible_versions;
```

## 📈 Expected Data Size

| Version | Verses | Database Size | Import Time |
|---------|--------|---------------|-------------|
| KJV     | 31,102 | ~25 MB        | ~2-5 min    |
| ASV     | 31,102 | ~25 MB        | ~2-5 min    |
| WEB     | 31,102 | ~25 MB        | ~2-5 min    |
| NIV     | 31,173 | ~26 MB        | ~2-5 min    |

**Total for 10 versions:** ~250 MB

## 🎯 Verification

After import, verify the data:

```sql
-- Count total verses
SELECT COUNT(*) FROM bible_verses;
-- Expected: ~31,000 per version

-- Check versions
SELECT * FROM bible_versions;

-- Check first verse
SELECT bv.text, bb.name, bv.chapter, bv.verse
FROM bible_verses bv
JOIN bible_books bb ON bv.book_id = bb.id
WHERE bb.book_number = 1 AND bv.chapter = 1 AND bv.verse = 1
LIMIT 1;
```

## 🔄 Update Scripture

To update or reimport:

```bash
# Delete existing data for a version
psql $DATABASE_URL -c "DELETE FROM bible_verses WHERE version_id = (SELECT id FROM bible_versions WHERE abbreviation = 'KJV');"

# Reimport
npm run import-bible -- --version=KJV --file=./data/kjv.json --skip-books --skip-versions
```

## 🌍 Adding More Languages

Download translations in other languages:

```bash
# Spanish (RVR1960)
curl -o rvr1960.json [URL]
npm run import-bible -- --version=RVR1960 --file=./data/rvr1960.json --skip-books

# French (LSG)
curl -o lsg.json [URL]
npm run import-bible -- --version=LSG --file=./data/lsg.json --skip-books
```

## ❓ Troubleshooting

### Issue: "Book not found"
**Solution:** Check that book names in your JSON match the expected format. The script tries to match by name or abbreviation.

### Issue: Slow import
**Solution:** 
- Ensure your database has good connection
- Check your disk I/O performance
- Consider importing one book at a time for very large files

### Issue: Memory errors
**Solution:** The script uses batching (1,000 verses at a time) to prevent memory issues. If still occurring, reduce batch size in the script.

## 📚 Next Steps

After importing:

1. **Test the API:** Make requests to verify data loads correctly
2. **Add Cross-References:** Import cross-reference data for enhanced study
3. **Add Commentaries:** Import public domain commentaries (Matthew Henry, etc.)
4. **Enable Search:** The schema supports full-text search
5. **Add More Versions:** Import multiple translations for comparison

## 🔗 Resources

- [Bible JSON Repository](https://github.com/thiagobodruk/bible)
- [Open Bible Data](https://github.com/scrollmapper/bible_databases)
- [Crosswire Modules](https://www.crosswire.org/sword/modules/)
- [Bible API Documentation](https://scripture.api.bible/livedocs)

---

**Need help?** Open an issue or check the discussions forum.
