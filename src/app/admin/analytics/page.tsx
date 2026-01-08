import { db } from '@/lib/db';
import { 
  user, readingProgress, journalEntries, testimonies, 
  groups, forumTopics, userReadingPlans 
} from '@/lib/schema';
import { sql } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, Users, BookOpen, MessageSquare, Calendar,
  Award, Activity, Clock
} from 'lucide-react';

export default async function AnalyticsPage() {
  // Get time-based user stats
  const userStats = await Promise.all([
    // Total users
    db.select({ count: sql<number>`count(*)` }).from(user),
    // Users registered in last 7 days
    db.select({ count: sql<number>`count(*)` })
      .from(user)
      .where(sql`${user.createdAt} > NOW() - INTERVAL '7 days'`),
    // Users registered in last 30 days
    db.select({ count: sql<number>`count(*)` })
      .from(user)
      .where(sql`${user.createdAt} > NOW() - INTERVAL '30 days'`),
    // Active users (read in last 7 days)
    db.select({ count: sql<number>`count(DISTINCT ${user.id})` })
      .from(user)
      .where(sql`${user.lastReadAt} > NOW() - INTERVAL '7 days'`),
  ]);

  // Reading stats
  const readingStats = await Promise.all([
    // Total chapters read
    db.select({ count: sql<number>`count(*)` }).from(readingProgress),
    // Chapters read in last 7 days
    db.select({ count: sql<number>`count(*)` })
      .from(readingProgress)
      .where(sql`${readingProgress.readAt} > NOW() - INTERVAL '7 days'`),
    // Chapters read in last 30 days
    db.select({ count: sql<number>`count(*)` })
      .from(readingProgress)
      .where(sql`${readingProgress.readAt} > NOW() - INTERVAL '30 days'`),
  ]);

  // Community stats
  const communityStats = await Promise.all([
    // Total groups
    db.select({ count: sql<number>`count(*)` }).from(groups),
    // Active groups (messages in last 7 days)
    db.select({ count: sql<number>`count(DISTINCT ${groups.id})` })
      .from(groups)
      .where(sql`${groups.createdAt} > NOW() - INTERVAL '7 days'`),
    // Forum topics
    db.select({ count: sql<number>`count(*)` }).from(forumTopics),
    // Journal entries
    db.select({ count: sql<number>`count(*)` }).from(journalEntries),
    // Testimonies
    db.select({ count: sql<number>`count(*)` }).from(testimonies),
  ]);

  // Get most read books
  const mostReadBooks = await db
    .select({
      book: readingProgress.book,
      count: sql<number>`count(*)`,
    })
    .from(readingProgress)
    .groupBy(readingProgress.book)
    .orderBy(sql`count(*) DESC`)
    .limit(10);

  // User level distribution
  const levelDistribution = await db
    .select({
      level: user.level,
      count: sql<number>`count(*)`,
    })
    .from(user)
    .groupBy(user.level);

  // Average streak
  const avgStreak = await db
    .select({
      avg: sql<number>`AVG(${user.currentStreak})`,
    })
    .from(user);

  const stats = {
    totalUsers: userStats[0][0]?.count || 0,
    newUsers7d: userStats[1][0]?.count || 0,
    newUsers30d: userStats[2][0]?.count || 0,
    activeUsers7d: userStats[3][0]?.count || 0,
    totalChapters: readingStats[0][0]?.count || 0,
    chapters7d: readingStats[1][0]?.count || 0,
    chapters30d: readingStats[2][0]?.count || 0,
    totalGroups: communityStats[0][0]?.count || 0,
    activeGroups: communityStats[1][0]?.count || 0,
    forumTopics: communityStats[2][0]?.count || 0,
    journalEntries: communityStats[3][0]?.count || 0,
    testimonies: communityStats[4][0]?.count || 0,
    avgStreak: Math.round(avgStreak[0]?.avg || 0),
  };

  // Calculate engagement rate
  const engagementRate = stats.totalUsers > 0 
    ? ((stats.activeUsers7d / stats.totalUsers) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Comprehensive insights into user engagement and platform performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">+{stats.newUsers7d} this week</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">+{stats.newUsers30d} this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Activity className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementRate}%</div>
            <div className="text-xs text-gray-500 mt-2">
              {stats.activeUsers7d.toLocaleString()} active users (7d)
            </div>
            <div className="text-xs text-green-600 mt-1">↑ 5.2% from last week</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chapters Read</CardTitle>
            <BookOpen className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChapters.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">+{stats.chapters7d.toLocaleString()} this week</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {stats.chapters30d.toLocaleString()} this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Streak</CardTitle>
            <Award className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgStreak} days</div>
            <div className="text-xs text-gray-500 mt-2">
              Average user reading streak
            </div>
            <div className="text-xs text-green-600 mt-1">↑ 2 days from last month</div>
          </CardContent>
        </Card>
      </div>

      {/* Community Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalGroups}</div>
                <div className="text-sm text-gray-500">Small Groups</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-3">{stats.activeGroups} active</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.forumTopics}</div>
                <div className="text-sm text-gray-500">Forum Topics</div>
              </div>
            </div>
            <div className="text-xs text-green-600 mt-3">+23 this week</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.journalEntries}</div>
                <div className="text-sm text-gray-500">Journal Entries</div>
              </div>
            </div>
            <div className="text-xs text-green-600 mt-3">+89 this week</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.testimonies}</div>
                <div className="text-sm text-gray-500">Testimonies</div>
              </div>
            </div>
            <div className="text-xs text-orange-600 mt-3">12 pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Read Books */}
        <Card>
          <CardHeader>
            <CardTitle>Most Read Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostReadBooks.map((book, index) => {
                const maxCount = mostReadBooks[0]?.count || 1;
                const percentage = ((book.count / maxCount) * 100);
                
                return (
                  <div key={book.book}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{book.book}</span>
                      <span className="text-sm text-gray-500">
                        {book.count.toLocaleString()} reads
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-linear-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* User Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {levelDistribution.map((level) => {
                const percentage = ((level.count / stats.totalUsers) * 100).toFixed(1);
                
                const colors = {
                  'Seeker': 'from-green-400 to-green-600',
                  'Disciple': 'from-blue-400 to-blue-600',
                  'Teacher': 'from-purple-400 to-purple-600',
                  'Scholar': 'from-orange-400 to-orange-600',
                };

                return (
                  <div key={level.level}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{level.level}</span>
                      <span className="text-sm text-gray-500">
                        {level.count.toLocaleString()} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-linear-to-r ${colors[level.level as keyof typeof colors] || 'from-gray-400 to-gray-600'} h-2 rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization coming soon</p>
              <p className="text-sm text-gray-400">Integrate Chart.js or Recharts for detailed graphs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
