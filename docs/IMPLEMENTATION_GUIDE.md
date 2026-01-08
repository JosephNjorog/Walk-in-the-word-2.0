# 🚀 Walk in the Word 2.0 - Implementation Guide

This guide provides a complete overview of all the new features implemented in version 2.0 and how to get them up and running.

## 📋 Table of Contents

1. [What's New in 2.0](#whats-new-in-20)
2. [Breaking Free from API Limits](#breaking-free-from-api-limits)
3. [Community Features Setup](#community-features-setup)
4. [Study Tools Configuration](#study-tools-configuration)
5. [Migration Guide](#migration-guide)
6. [API Documentation](#api-documentation)

---

## 🎉 What's New in 2.0

### Core Improvements

#### 1. **Self-Hosted Bible Database**
- ✅ Complete PostgreSQL-based Bible storage
- ✅ Support for unlimited translations
- ✅ No API rate limits
- ✅ Offline-first capability
- ✅ Full-text search
- ✅ Cross-references
- ✅ Commentary integration

#### 2. **Enhanced Community System**
- ✅ Small Groups (up to 12 members)
- ✅ Discussion Forums with categories
- ✅ Live Reading Rooms
- ✅ Testimony Wall
- ✅ Mentorship matching
- ✅ Following system
- ✅ Direct messaging
- ✅ Reflection comments & reactions

#### 3. **Study & Learning Tools**
- ✅ Memory Verse System with spaced repetition
- ✅ Multiple Reading Plans (sequential, chronological, thematic)
- ✅ SOAP Journaling
- ✅ Resource Sharing
- ✅ Commentary access
- ✅ Cross-reference discovery

#### 4. **Church & Ministry Features**
- ✅ Church accounts
- ✅ Sermon library
- ✅ Congregation management
- ✅ Ministry roles

#### 5. **Gamification Enhancements**
- ✅ XP & Leveling system
- ✅ User reputation
- ✅ Rare badges (Common → Legendary)
- ✅ Community challenges
- ✅ Challenge leaderboards

---

## 🔓 Breaking Free from API Limits

### Why Self-Host the Bible?

The Bible API has a 5,000 request/month limit. For a growing community:
- 100 users × 1 chapter/day = 3,000 requests
- Plus version lookups, searches, etc.
- **You'll hit the limit quickly!**

### Solution: Local PostgreSQL Database

**Benefits:**
- ✅ Unlimited requests
- ✅ 10x faster queries
- ✅ No monthly API costs
- ✅ Works offline
- ✅ Add 50+ translations easily

### Implementation Steps

#### Step 1: Update Environment Variables

```env
USE_LOCAL_BIBLE=true  # Enable local database
BIBLE_API_KEY=optional  # Keep as fallback
```

#### Step 2: Run Migrations

```bash
npm run db:generate
npm run db:migrate
```

#### Step 3: Download Bible Data

**Recommended Source: Bible JSON Project**

```bash
# Create data directory
mkdir data && cd data

# Download KJV
curl -o kjv.json https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json

# Download ASV
curl -o asv.json https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_asv.json

# Download WEB
curl -o web.json https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_web.json
```

#### Step 4: Import Data

```bash
# Import KJV (first import includes book metadata)
npm run import-bible -- --version=KJV --file=./data/kjv.json

# Import additional versions (skip book metadata)
npm run import-bible -- --version=ASV --file=./data/asv.json --skip-books
npm run import-bible -- --version=WEB --file=./data/web.json --skip-books
```

#### Step 5: Verify Import

```sql
-- Check verse count (should be ~31,000 per version)
SELECT version_id, COUNT(*) as verse_count 
FROM bible_verses 
GROUP BY version_id;

-- Test a query
SELECT bv.text, bb.name, bv.chapter, bv.verse
FROM bible_verses bv
JOIN bible_books bb ON bv.book_id = bb.id
JOIN bible_versions bver ON bv.version_id = bver.id
WHERE bver.abbreviation = 'KJV' 
  AND bb.book_number = 1 
  AND bv.chapter = 1 
  AND bv.verse = 1;
```

**📖 Full Guide:** [docs/BIBLE_DATA_IMPORT.md](BIBLE_DATA_IMPORT.md)

---

## 👥 Community Features Setup

### Small Groups

**Create a Group:**
```typescript
POST /api/groups
{
  "name": "Monday Night Bible Study",
  "description": "Weekly study through Romans",
  "type": "small_group",
  "privacy": "private",
  "maxMembers": 10,
  "meetingSchedule": "Mondays at 7 PM"
}
```

**Invite Members:**
```typescript
POST /api/groups/members
{
  "groupId": "uuid",
  "userIdOrEmail": "user@example.com"
}
```

### Discussion Forums

**Forum Categories:**
- Theology & Doctrine
- Life Application
- Prayer Requests
- Questions & Answers
- Testimonies

**Create Topic:**
```typescript
POST /api/forum/topics
{
  "title": "Understanding Romans 8:28",
  "content": "How do you interpret this verse in difficult times?",
  "categoryId": 1
}
```

### Live Reading Rooms

Users automatically join reading rooms when they open a chapter. See who's reading the same passage in real-time!

**Implementation:**
- WebSocket presence (coming soon)
- Current: Polling every 30 seconds
- Shows active readers count
- Chat sidebar (optional)

### Mentorship System

**Request Mentorship:**
```typescript
POST /api/mentorships
{
  "mentorId": "uuid",
  "focusArea": "Bible study and prayer life"
}
```

**Features:**
- Private messaging
- Shared reading plans
- Progress tracking
- Goal setting

---

## 📚 Study Tools Configuration

### Memory Verse System

**Spaced Repetition Algorithm:**
- Level 0: Review in 1 day
- Level 1: Review in 3 days
- Level 2: Review in 7 days
- Level 3: Review in 14 days
- Level 4: Review in 30 days
- Level 5: Review in 90 days (Mastered!)

**Add Verse:**
```typescript
POST /api/memory-verses
{
  "book": "Philippians",
  "chapter": 4,
  "verse": 13,
  "verseText": "I can do all things through Christ..."
}
```

**Review Verse:**
```typescript
PUT /api/memory-verses
{
  "verseId": "uuid",
  "accuracy": 95,
  "isCorrect": true
}
```

### Reading Plans

**Available Types:**
- Sequential (Genesis → Revelation)
- Chronological (Historical order)
- Thematic (Faith, Love, Prayer, etc.)
- Custom (Create your own)

**Start a Plan:**
```typescript
POST /api/reading-plans
{
  "templateId": 1,
  "startDate": "2026-01-09"
}
```

### SOAP Journaling

**Create Entry:**
```typescript
POST /api/journal
{
  "book": "Psalms",
  "chapter": 23,
  "scripture": "The Lord is my shepherd...",
  "observation": "David writes with complete trust...",
  "application": "I need to trust God with my finances...",
  "prayer": "Lord, help me trust you fully..."
}
```

---

## 🔄 Migration Guide

### From v1.0 to v2.0

#### 1. Database Schema Updates

```bash
# Backup your database first!
pg_dump $DATABASE_URL > backup.sql

# Generate new migrations
npm run db:generate

# Review generated migrations in drizzle/ folder

# Apply migrations
npm run db:migrate
```

#### 2. Update Environment Variables

Add new variables to `.env.local`:
```env
USE_LOCAL_BIBLE=true
ENABLE_COMMUNITY_FEATURES=true
ENABLE_CHURCH_FEATURES=true
```

#### 3. Import Bible Data

Follow the [Breaking Free from API Limits](#breaking-free-from-api-limits) section.

#### 4. Data Migration Script

**User Data (Already in v1.0):**
- ✅ Users, sessions, accounts - No changes needed
- ✅ Reading progress - Compatible
- ✅ Reflections - Compatible
- ✅ Partnerships - Compatible

**New Features (Optional):**
- ⚠️ Set default user levels
- ⚠️ Initialize XP systems
- ⚠️ Create default forum categories

```sql
-- Set default levels for existing users
UPDATE users SET level = 'Disciple', reputation = 100 WHERE current_streak > 7;

-- Create default forum categories
INSERT INTO forum_categories (name, slug, description, "order") VALUES
  ('Theology', 'theology', 'Discuss doctrine and Biblical interpretation', 1),
  ('Life Application', 'life-application', 'Apply Scripture to daily life', 2),
  ('Prayer Requests', 'prayer-requests', 'Share prayer needs', 3),
  ('Questions', 'questions', 'Ask and answer Bible questions', 4);
```

#### 5. Test Everything

```bash
# Run in development mode
npm run dev

# Test key features:
# - Bible reading (check local DB loads)
# - Create a group
# - Post in forum
# - Add memory verse
# - Start reading plan
```

---

## 📖 API Documentation

### Bible Content Endpoints

#### Get Chapter (Local DB or API Fallback)
```http
GET /api/bible/chapter?bibleId=KJV&chapterId=GEN.1
```

#### Search Bible
```http
GET /api/bible/search?query=love&version=KJV&limit=50
```

#### Get Verse
```http
GET /api/bible/verse?version=KJV&book=John&chapter=3&verse=16
```

#### Get Cross References
```http
GET /api/bible/cross-references?book=John&chapter=3&verse=16
```

#### Get Commentary
```http
GET /api/bible/commentary?commentary=Matthew Henry&book=Romans&chapter=8
```

### Community Endpoints

#### Groups
```http
GET    /api/groups                      # List user's groups
POST   /api/groups                      # Create group
PUT    /api/groups                      # Update group
DELETE /api/groups?groupId=uuid         # Delete/leave group

POST   /api/groups/members              # Invite member
GET    /api/groups/members?groupId=uuid # List members
DELETE /api/groups/members?groupId=uuid&userId=uuid # Remove member
```

#### Forums
```http
GET    /api/forum/topics?categoryId=1   # Browse topics
POST   /api/forum/topics                # Create topic
PUT    /api/forum/topics                # Edit/pin/lock topic
DELETE /api/forum/topics?topicId=uuid   # Delete topic

POST   /api/forum/replies               # Reply to topic
POST   /api/forum/votes                 # Upvote/downvote
```

#### Memory Verses
```http
GET    /api/memory-verses?dueOnly=true  # Get verses due for review
POST   /api/memory-verses               # Add verse
PUT    /api/memory-verses               # Record review
DELETE /api/memory-verses?verseId=uuid  # Remove verse
```

---

## 🎯 Best Practices

### Performance

1. **Use Local Bible Database**
   - 10x faster than API calls
   - No rate limits
   - Better user experience

2. **Index Optimization**
   - Schema includes optimized indexes
   - Run `ANALYZE` after bulk imports
   - Monitor slow queries

3. **Caching Strategy**
   - Next.js caches API routes
   - Use `revalidate` for Bible content
   - Redis for session data (optional)

### Security

1. **API Authentication**
   - All protected routes check session
   - Group leaders verified before actions
   - Private reflections respected

2. **Input Validation**
   - Zod schemas for all API inputs
   - SQL injection protection via Drizzle ORM
   - XSS prevention via React

3. **Rate Limiting**
   - Implement rate limiting on write operations
   - Prevent spam in forums and groups

### Community Management

1. **Moderation Tools**
   - Pin important topics
   - Lock contentious threads
   - Delete spam/inappropriate content

2. **Group Health**
   - Optimal size: 8-12 members
   - Regular meeting schedules
   - Clear leadership structure

3. **Engagement**
   - Weekly challenges
   - Featured testimonies
   - Highlight active contributors

---

## 🐛 Troubleshooting

### Bible Import Issues

**Issue:** "Book not found" errors during import
**Solution:** Check JSON format matches expected structure. Use `--format=json` flag explicitly.

**Issue:** Slow import speed
**Solution:** Normal for first import. ~2-5 minutes per version. Use batching (already implemented).

**Issue:** Memory errors
**Solution:** Reduce batch size in `scripts/import-bible-data.ts` (default: 1000 verses).

### Community Features

**Issue:** Can't create group
**Solution:** Check user is authenticated and has verified email.

**Issue:** Forum votes not updating
**Solution:** Clear cache and check for duplicate vote entries.

### Performance

**Issue:** Slow Bible queries
**Solution:** 
1. Verify indexes exist: `SELECT * FROM pg_indexes WHERE tablename = 'bible_verses';`
2. Run `ANALYZE bible_verses;`
3. Check `USE_LOCAL_BIBLE=true` in .env

---

## 📚 Additional Resources

- [Bible Data Import Guide](BIBLE_DATA_IMPORT.md)
- [Main README](../README.md)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Better Auth Docs](https://better-auth.com/)
- [Bible JSON Repository](https://github.com/thiagobodruk/bible)

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Update documentation
6. Submit pull request

**Priority Areas:**
- Mobile app development
- Audio Bible integration
- AI study assistant
- Multi-language support
- Accessibility improvements

---

## 📧 Support

Need help? Reach out:

- **GitHub Issues**: Technical problems
- **Discussions**: Feature requests, questions
- **Email**: support@walkintheword.com

---

**Built with ❤️ for the global Church**

*Walk in the Word - Read. Reflect. Grow Together.*
