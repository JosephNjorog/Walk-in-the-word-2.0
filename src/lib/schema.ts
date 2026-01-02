import { pgTable, text, timestamp, uuid, integer, boolean, unique } from 'drizzle-orm/pg-core';

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
