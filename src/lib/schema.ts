import { pgTable, text, timestamp, uuid, integer, boolean, unique, serial, varchar, index } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  
  // Custom fields for Walk in the Word
  username: text('username').unique(),
  readingPace: integer('reading_pace').default(1),
  preferredVersion: text('preferred_version').default('KJV'),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  lastReadAt: timestamp('last_read_at', { withTimezone: true }),
  bio: text('bio'),
  location: text('location'),
  reputation: integer('reputation').default(0),
  level: text('level').default('Seeker'), // Seeker, Disciple, Teacher, Scholar
  isVerified: boolean('is_verified').default(false),
  role: text('role').default('member'), // member, pastor, admin
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

// Walk in the Word specific tables
export const readingProgress = pgTable('reading_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  book: text('book').notNull(),
  chapter: integer('chapter').notNull(),
  readAt: timestamp('read_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  unq: unique().on(t.userId, t.book, t.chapter),
}));

export const reflections = pgTable('reflections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  book: text('book').notNull(),
  chapter: integer('chapter').notNull(),
  content: text('content').notNull(),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const partnerships = pgTable('partnerships', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId1: text('user_id_1').references(() => user.id, { onDelete: 'cascade' }),
  userId2: text('user_id_2').references(() => user.id, { onDelete: 'cascade' }),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  unq: unique().on(t.userId1, t.userId2),
}));

export const achievements = pgTable('achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  unlockedAt: timestamp('unlocked_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  unq: unique().on(t.userId, t.type),
}));

// Prayer Wall
export const prayerRequests = pgTable('prayer_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  category: text('category').default('general'),
  isAnonymous: boolean('is_anonymous').default(false),
  isAnswered: boolean('is_answered').default(false),
  prayerCount: integer('prayer_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const prayerInteractions = pgTable('prayer_interactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  prayerRequestId: uuid('prayer_request_id').references(() => prayerRequests.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  prayedAt: timestamp('prayed_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  unq: unique().on(t.prayerRequestId, t.userId),
}));

// Bookmarks & Highlights
export const bookmarks = pgTable('bookmarks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  book: text('book').notNull(),
  chapter: integer('chapter').notNull(),
  verse: integer('verse'),
  verseText: text('verse_text'),
  note: text('note'),
  color: text('color').default('yellow'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// User reading preferences
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).unique(),
  fontSize: integer('font_size').default(18),
  fontFamily: text('font_family').default('serif'),
  theme: text('theme').default('light'),
  notificationsEnabled: boolean('notifications_enabled').default(true),
  dailyReminderTime: text('daily_reminder_time').default('08:00'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ============================================
// SELF-HOSTED BIBLE DATABASE
// ============================================

export const bibleVersions = pgTable('bible_versions', {
  id: serial('id').primaryKey(),
  abbreviation: varchar('abbreviation', { length: 10 }).unique().notNull(), // KJV, NIV, ESV
  name: text('name').notNull(), // King James Version
  language: varchar('language', { length: 10 }).default('en'),
  isDefault: boolean('is_default').default(false),
  copyright: text('copyright'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const bibleBooks = pgTable('bible_books', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(), // Genesis, Exodus
  abbreviation: varchar('abbreviation', { length: 10 }).notNull(), // Gen, Exo
  bookNumber: integer('book_number').notNull().unique(), // 1-66
  testament: varchar('testament', { length: 2 }).notNull(), // OT, NT
  chapters: integer('chapters').notNull(), // Total chapters in book
  category: varchar('category', { length: 20 }), // Law, History, Wisdom, Prophets, Gospel, Epistles
});

export const bibleVerses = pgTable('bible_verses', {
  id: serial('id').primaryKey(),
  versionId: integer('version_id').references(() => bibleVersions.id, { onDelete: 'cascade' }),
  bookId: integer('book_id').references(() => bibleBooks.id, { onDelete: 'cascade' }),
  chapter: integer('chapter').notNull(),
  verse: integer('verse').notNull(),
  text: text('text').notNull(),
}, (t) => ({
  lookupIdx: index('idx_bible_lookup').on(t.versionId, t.bookId, t.chapter, t.verse),
  chapterIdx: index('idx_bible_chapter').on(t.versionId, t.bookId, t.chapter),
}));

// Cross References
export const crossReferences = pgTable('cross_references', {
  id: serial('id').primaryKey(),
  fromBookId: integer('from_book_id').references(() => bibleBooks.id),
  fromChapter: integer('from_chapter').notNull(),
  fromVerse: integer('from_verse').notNull(),
  toBookId: integer('to_book_id').references(() => bibleBooks.id),
  toChapter: integer('to_chapter').notNull(),
  toVerse: integer('to_verse').notNull(),
  strength: integer('strength').default(1), // 1-5 relevance
});

// Bible Commentaries (Public Domain)
export const commentaries = pgTable('commentaries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(), // Matthew Henry, Gill's Exposition
  author: varchar('author', { length: 100 }),
  description: text('description'),
  isPublicDomain: boolean('is_public_domain').default(true),
});

export const commentaryEntries = pgTable('commentary_entries', {
  id: serial('id').primaryKey(),
  commentaryId: integer('commentary_id').references(() => commentaries.id, { onDelete: 'cascade' }),
  bookId: integer('book_id').references(() => bibleBooks.id),
  chapter: integer('chapter').notNull(),
  verse: integer('verse'),
  content: text('content').notNull(),
}, (t) => ({
  lookupIdx: index('idx_commentary_lookup').on(t.commentaryId, t.bookId, t.chapter),
}));

// ============================================
// COMMUNITY FEATURES
// ============================================

// Small Groups System
export const groups = pgTable('groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 20 }).default('small_group'), // small_group, study, church
  privacy: varchar('privacy', { length: 20 }).default('private'), // private, public
  maxMembers: integer('max_members').default(12),
  leaderId: text('leader_id').references(() => user.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url'),
  meetingSchedule: text('meeting_schedule'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const groupMembers = pgTable('group_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('group_id').references(() => groups.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 }).default('member'), // leader, admin, member
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  unq: unique().on(t.groupId, t.userId),
}));

export const groupMessages = pgTable('group_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('group_id').references(() => groups.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  parentMessageId: uuid('parent_message_id'), // For threaded replies
  reactionCounts: text('reaction_counts'), // JSON: {❤️: 5, 🙏: 3}
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const groupReadingPlans = pgTable('group_reading_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('group_id').references(() => groups.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).default('sequential'), // sequential, chronological, thematic
  startDate: timestamp('start_date', { withTimezone: true }),
  endDate: timestamp('end_date', { withTimezone: true }),
  currentBook: text('current_book'),
  currentChapter: integer('current_chapter'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Discussion Forums
export const forumCategories = pgTable('forum_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  order: integer('order').default(0),
});

export const forumTopics = pgTable('forum_topics', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: integer('category_id').references(() => forumCategories.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  isPinned: boolean('is_pinned').default(false),
  isLocked: boolean('is_locked').default(false),
  viewCount: integer('view_count').default(0),
  replyCount: integer('reply_count').default(0),
  lastActivityAt: timestamp('last_activity_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const forumReplies = pgTable('forum_replies', {
  id: uuid('id').primaryKey().defaultRandom(),
  topicId: uuid('topic_id').references(() => forumTopics.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  upvotes: integer('upvotes').default(0),
  downvotes: integer('downvotes').default(0),
  isSolution: boolean('is_solution').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const forumVotes = pgTable('forum_votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  replyId: uuid('reply_id').references(() => forumReplies.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  voteType: varchar('vote_type', { length: 10 }).notNull(), // upvote, downvote
}, (t) => ({
  unq: unique().on(t.replyId, t.userId),
}));

// Live Reading Rooms
export const readingRooms = pgTable('reading_rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  book: text('book').notNull(),
  chapter: integer('chapter').notNull(),
  activeReaders: integer('active_readers').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  unq: unique().on(t.book, t.chapter),
}));

export const roomPresence = pgTable('room_presence', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').references(() => readingRooms.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).defaultNow(),
});

// Testimony Wall
export const testimonies = pgTable('testimonies', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  book: text('book'),
  chapter: integer('chapter'),
  category: varchar('category', { length: 50 }), // salvation, healing, breakthrough
  likeCount: integer('like_count').default(0),
  isPublic: boolean('is_public').default(true),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const testimonyLikes = pgTable('testimony_likes', {
  id: uuid('id').primaryKey().defaultRandom(),
  testimonyId: uuid('testimony_id').references(() => testimonies.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  likedAt: timestamp('liked_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  unq: unique().on(t.testimonyId, t.userId),
}));

// Mentorship System
export const mentorships = pgTable('mentorships', {
  id: uuid('id').primaryKey().defaultRandom(),
  mentorId: text('mentor_id').references(() => user.id, { onDelete: 'cascade' }),
  menteeId: text('mentee_id').references(() => user.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 20 }).default('pending'), // pending, active, completed, cancelled
  focusArea: text('focus_area'), // Bible study, discipleship, prayer life
  startDate: timestamp('start_date', { withTimezone: true }),
  endDate: timestamp('end_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  unq: unique().on(t.mentorId, t.menteeId),
}));

export const mentorshipMessages = pgTable('mentorship_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  mentorshipId: uuid('mentorship_id').references(() => mentorships.id, { onDelete: 'cascade' }),
  senderId: text('sender_id').references(() => user.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ============================================
// STUDY TOOLS & FEATURES
// ============================================

// Memory Verse System
export const memoryVerses = pgTable('memory_verses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  book: text('book').notNull(),
  chapter: integer('chapter').notNull(),
  verse: integer('verse').notNull(),
  verseText: text('verse_text').notNull(),
  reviewCount: integer('review_count').default(0),
  lastReviewedAt: timestamp('last_reviewed_at', { withTimezone: true }),
  nextReviewAt: timestamp('next_review_at', { withTimezone: true }),
  masteryLevel: integer('mastery_level').default(0), // 0-5 (spaced repetition)
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const memoryVerseAttempts = pgTable('memory_verse_attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  memoryVerseId: uuid('memory_verse_id').references(() => memoryVerses.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  accuracy: integer('accuracy'), // percentage
  isCorrect: boolean('is_correct'),
  attemptedAt: timestamp('attempted_at', { withTimezone: true }).defaultNow(),
});

// Reading Plans
export const readingPlanTemplates = pgTable('reading_plan_templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull(), // chronological, thematic, 90-day, 1-year
  duration: integer('duration'), // days
  isOfficial: boolean('is_official').default(true),
  category: varchar('category', { length: 50 }), // faith, love, prayer
  createdBy: text('created_by').references(() => user.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const readingPlanDays = pgTable('reading_plan_days', {
  id: serial('id').primaryKey(),
  templateId: integer('template_id').references(() => readingPlanTemplates.id, { onDelete: 'cascade' }),
  dayNumber: integer('day_number').notNull(),
  book: text('book').notNull(),
  chapterStart: integer('chapter_start').notNull(),
  chapterEnd: integer('chapter_end'),
  title: varchar('title', { length: 200 }),
  description: text('description'),
});

export const userReadingPlans = pgTable('user_reading_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  templateId: integer('template_id').references(() => readingPlanTemplates.id),
  startDate: timestamp('start_date', { withTimezone: true }),
  currentDay: integer('current_day').default(1),
  completedDays: integer('completed_days').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Church/Ministry Accounts
export const churches = pgTable('churches', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  denomination: varchar('denomination', { length: 100 }),
  location: text('location'),
  website: text('website'),
  adminId: text('admin_id').references(() => user.id),
  logoUrl: text('logo_url'),
  isVerified: boolean('is_verified').default(false),
  memberCount: integer('member_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const churchMembers = pgTable('church_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  churchId: uuid('church_id').references(() => churches.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 50 }).default('member'), // pastor, elder, deacon, member
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  unq: unique().on(t.churchId, t.userId),
}));

export const sermons = pgTable('sermons', {
  id: uuid('id').primaryKey().defaultRandom(),
  churchId: uuid('church_id').references(() => churches.id, { onDelete: 'cascade' }),
  pastorId: text('pastor_id').references(() => user.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  book: text('book'),
  chapter: integer('chapter'),
  verseStart: integer('verse_start'),
  verseEnd: integer('verse_end'),
  videoUrl: text('video_url'),
  audioUrl: text('audio_url'),
  notes: text('notes'),
  sermonDate: timestamp('sermon_date', { withTimezone: true }),
  viewCount: integer('view_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Reflection Enhancements
export const reflectionComments = pgTable('reflection_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  reflectionId: uuid('reflection_id').references(() => reflections.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const reflectionReactions = pgTable('reflection_reactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  reflectionId: uuid('reflection_id').references(() => reflections.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  reactionType: varchar('reaction_type', { length: 20 }).notNull(), // pray, heart, insight, fire
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  unq: unique().on(t.reflectionId, t.userId, t.reactionType),
}));

// User Following System
export const userFollows = pgTable('user_follows', {
  id: uuid('id').primaryKey().defaultRandom(),
  followerId: text('follower_id').references(() => user.id, { onDelete: 'cascade' }),
  followingId: text('following_id').references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  unq: unique().on(t.followerId, t.followingId),
}));

// Direct Messaging
export const directMessages = pgTable('direct_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: text('sender_id').references(() => user.id, { onDelete: 'cascade' }),
  receiverId: text('receiver_id').references(() => user.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Verse of the Day/Moment
export const communityVotes = pgTable('community_votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  book: text('book').notNull(),
  chapter: integer('chapter').notNull(),
  verse: integer('verse').notNull(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  voteDate: timestamp('vote_date', { withTimezone: true }).defaultNow(),
  relevanceNote: text('relevance_note'),
}, (t) => ({
  unq: unique().on(t.book, t.chapter, t.verse, t.userId, t.voteDate),
}));

// Gamification Enhancements
export const userLevels = pgTable('user_levels', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).unique(),
  currentLevel: integer('current_level').default(1),
  totalXp: integer('total_xp').default(0),
  levelName: varchar('level_name', { length: 50 }).default('Seeker'),
  nextLevelXp: integer('next_level_xp').default(100),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const rareBadges = pgTable('rare_badges', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  rarity: varchar('rarity', { length: 20 }).default('common'), // common, rare, epic, legendary
  criteria: text('criteria'), // JSON string defining unlock criteria
});

// Community Challenges
export const challenges = pgTable('challenges', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull(), // reading, memory, community
  startDate: timestamp('start_date', { withTimezone: true }),
  endDate: timestamp('end_date', { withTimezone: true }),
  goal: text('goal'), // JSON: {type: "chapters", count: 30}
  rewardBadgeId: integer('reward_badge_id').references(() => rareBadges.id),
  participantCount: integer('participant_count').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const challengeParticipants = pgTable('challenge_participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  challengeId: uuid('challenge_id').references(() => challenges.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  progress: integer('progress').default(0),
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  unq: unique().on(t.challengeId, t.userId),
}));

// Resource Sharing
export const resources = pgTable('resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull(), // study_guide, devotional, sermon_notes
  fileUrl: text('file_url'),
  thumbnailUrl: text('thumbnail_url'),
  book: text('book'),
  chapter: integer('chapter'),
  downloadCount: integer('download_count').default(0),
  likeCount: integer('like_count').default(0),
  tags: text('tags'), // JSON array
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const resourceLikes = pgTable('resource_likes', {
  id: uuid('id').primaryKey().defaultRandom(),
  resourceId: uuid('resource_id').references(() => resources.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  likedAt: timestamp('liked_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  unq: unique().on(t.resourceId, t.userId),
}));

// Journaling System (SOAP Method)
export const journalEntries = pgTable('journal_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  book: text('book').notNull(),
  chapter: integer('chapter').notNull(),
  scripture: text('scripture'), // S - Scripture
  observation: text('observation'), // O - Observation
  application: text('application'), // A - Application
  prayer: text('prayer'), // P - Prayer
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Notifications System
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // partnership_invite, reflection_comment, achievement_unlocked
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message'),
  actionUrl: text('action_url'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// User Activity Log
export const userActivity = pgTable('user_activity', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  activityType: varchar('activity_type', { length: 50 }).notNull(), // read_chapter, posted_reflection, joined_group
  metadata: text('metadata'), // JSON
  xpEarned: integer('xp_earned').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Relations
import { relations } from 'drizzle-orm';

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  readingProgress: many(readingProgress),
  reflections: many(reflections),
  partnerships1: many(partnerships, { relationName: 'user1' }),
  partnerships2: many(partnerships, { relationName: 'user2' }),
  achievements: many(achievements),
  prayerRequests: many(prayerRequests),
  prayerInteractions: many(prayerInteractions),
  bookmarks: many(bookmarks),
  preferences: many(userPreferences),
  groupMemberships: many(groupMembers),
  groupMessages: many(groupMessages),
  forumTopics: many(forumTopics),
  forumReplies: many(forumReplies),
  testimonies: many(testimonies),
  mentorshipsAsMentor: many(mentorships, { relationName: 'mentor' }),
  mentorshipsAsMentee: many(mentorships, { relationName: 'mentee' }),
  memoryVerses: many(memoryVerses),
  userReadingPlans: many(userReadingPlans),
  journalEntries: many(journalEntries),
  notifications: many(notifications),
  userLevel: many(userLevels),
  following: many(userFollows, { relationName: 'follower' }),
  followers: many(userFollows, { relationName: 'following' }),
}));

export const partnershipsRelations = relations(partnerships, ({ one }) => ({
  user1: one(user, {
    fields: [partnerships.userId1],
    references: [user.id],
    relationName: 'user1',
  }),
  user2: one(user, {
    fields: [partnerships.userId2],
    references: [user.id],
    relationName: 'user2',
  }),
}));

export const readingProgressRelations = relations(readingProgress, ({ one }) => ({
  user: one(user, {
    fields: [readingProgress.userId],
    references: [user.id],
  }),
}));

export const reflectionsRelations = relations(reflections, ({ one }) => ({
  user: one(user, {
    fields: [reflections.userId],
    references: [user.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(user, {
    fields: [achievements.userId],
    references: [user.id],
  }),
}));

export const prayerRequestsRelations = relations(prayerRequests, ({ one, many }) => ({
  user: one(user, {
    fields: [prayerRequests.userId],
    references: [user.id],
  }),
  interactions: many(prayerInteractions),
}));

export const prayerInteractionsRelations = relations(prayerInteractions, ({ one }) => ({
  prayerRequest: one(prayerRequests, {
    fields: [prayerInteractions.prayerRequestId],
    references: [prayerRequests.id],
  }),
  user: one(user, {
    fields: [prayerInteractions.userId],
    references: [user.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(user, {
    fields: [bookmarks.userId],
    references: [user.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(user, {
    fields: [userPreferences.userId],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// Bible Relations
export const bibleVersesRelations = relations(bibleVerses, ({ one }) => ({
  version: one(bibleVersions, {
    fields: [bibleVerses.versionId],
    references: [bibleVersions.id],
  }),
  book: one(bibleBooks, {
    fields: [bibleVerses.bookId],
    references: [bibleBooks.id],
  }),
}));

// Group Relations
export const groupsRelations = relations(groups, ({ one, many }) => ({
  leader: one(user, {
    fields: [groups.leaderId],
    references: [user.id],
  }),
  members: many(groupMembers),
  messages: many(groupMessages),
  readingPlans: many(groupReadingPlans),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(user, {
    fields: [groupMembers.userId],
    references: [user.id],
  }),
}));

// Forum Relations
export const forumTopicsRelations = relations(forumTopics, ({ one, many }) => ({
  category: one(forumCategories, {
    fields: [forumTopics.categoryId],
    references: [forumCategories.id],
  }),
  user: one(user, {
    fields: [forumTopics.userId],
    references: [user.id],
  }),
  replies: many(forumReplies),
}));

export const forumRepliesRelations = relations(forumReplies, ({ one, many }) => ({
  topic: one(forumTopics, {
    fields: [forumReplies.topicId],
    references: [forumTopics.id],
  }),
  user: one(user, {
    fields: [forumReplies.userId],
    references: [user.id],
  }),
  votes: many(forumVotes),
}));

// Mentorship Relations
export const mentorshipsRelations = relations(mentorships, ({ one, many }) => ({
  mentor: one(user, {
    fields: [mentorships.mentorId],
    references: [user.id],
    relationName: 'mentor',
  }),
  mentee: one(user, {
    fields: [mentorships.menteeId],
    references: [user.id],
    relationName: 'mentee',
  }),
  messages: many(mentorshipMessages),
}));

// Reflection Relations
export const reflectionsEnhancedRelations = relations(reflections, ({ many }) => ({
  comments: many(reflectionComments),
  reactions: many(reflectionReactions),
}));

// Challenge Relations
export const challengesRelations = relations(challenges, ({ one, many }) => ({
  rewardBadge: one(rareBadges, {
    fields: [challenges.rewardBadgeId],
    references: [rareBadges.id],
  }),
  participants: many(challengeParticipants),
}));

// Church Relations
export const churchesRelations = relations(churches, ({ one, many }) => ({
  admin: one(user, {
    fields: [churches.adminId],
    references: [user.id],
  }),
  members: many(churchMembers),
  sermons: many(sermons),
}));

export const sermonsRelations = relations(sermons, ({ one }) => ({
  church: one(churches, {
    fields: [sermons.churchId],
    references: [churches.id],
  }),
  pastor: one(user, {
    fields: [sermons.pastorId],
    references: [user.id],
  }),
}));
