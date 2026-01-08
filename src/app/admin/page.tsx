import { db } from '@/lib/db';
import { 
  user, readingProgress, journalEntries, testimonies, 
  groups, forumTopics, userReadingPlans, achievements 
} from '@/lib/schema';
import { sql } from 'drizzle-orm';
import { 
  Users, BookOpen, MessageSquare, Award, TrendingUp, 
  DollarSign, Activity, Calendar 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getDashboardStats() {
  // Total users
  const totalUsers = await db.select({ count: sql<number>`count(*)` })
    .from(user);

  // Active users (last 7 days)
  const activeUsers = await db.select({ count: sql<number>`count(*)` })
    .from(user)
    .where(sql`${user.lastReadAt} > NOW() - INTERVAL '7 days'`);

  // Total chapters read
  const chaptersRead = await db.select({ count: sql<number>`count(*)` })
    .from(readingProgress);

  // Total journal entries
  const journalCount = await db.select({ count: sql<number>`count(*)` })
    .from(journalEntries);

  // Total testimonies
  const testimonyCount = await db.select({ count: sql<number>`count(*)` })
    .from(testimonies);

  // Total groups
  const groupCount = await db.select({ count: sql<number>`count(*)` })
    .from(groups);

  // Total forum topics
  const forumCount = await db.select({ count: sql<number>`count(*)` })
    .from(forumTopics);

  // Active reading plans
  const activePlans = await db.select({ count: sql<number>`count(*)` })
    .from(userReadingPlans)
    .where(sql`${userReadingPlans.completed} = false`);

  return {
    totalUsers: totalUsers[0]?.count || 0,
    activeUsers: activeUsers[0]?.count || 0,
    chaptersRead: chaptersRead[0]?.count || 0,
    journalCount: journalCount[0]?.count || 0,
    testimonyCount: testimonyCount[0]?.count || 0,
    groupCount: groupCount[0]?.count || 0,
    forumCount: forumCount[0]?.count || 0,
    activePlans: activePlans[0]?.count || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      description: `${stats.activeUsers} active (7 days)`,
      trend: '+12% from last month',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Chapters Read',
      value: stats.chaptersRead.toLocaleString(),
      icon: BookOpen,
      description: 'All-time total',
      trend: '+1,234 this week',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Reading Plans',
      value: stats.activePlans.toLocaleString(),
      icon: Calendar,
      description: 'Currently enrolled',
      trend: '87% completion rate',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Community Groups',
      value: stats.groupCount.toLocaleString(),
      icon: Users,
      description: 'Active groups',
      trend: '+5 new this week',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Forum Topics',
      value: stats.forumCount.toLocaleString(),
      icon: MessageSquare,
      description: 'Total discussions',
      trend: '+23 today',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Journal Entries',
      value: stats.journalCount.toLocaleString(),
      icon: BookOpen,
      description: 'SOAP reflections',
      trend: '+89 this week',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Testimonies',
      value: stats.testimonyCount.toLocaleString(),
      icon: Award,
      description: 'User testimonies',
      trend: '12 pending approval',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Revenue (MTD)',
      value: '₦450,000',
      icon: DollarSign,
      description: 'Premium subscriptions',
      trend: '+18% from last month',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">
          Welcome back! Here's what's happening with Walk in the Word today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                <p className="text-xs text-green-600 mt-2 font-medium">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="font-medium text-blue-900">Create Announcement</div>
              <div className="text-sm text-blue-600">Broadcast to all users</div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="font-medium text-green-900">Approve Testimonies</div>
              <div className="text-sm text-green-600">12 pending review</div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="font-medium text-purple-900">Moderate Forum</div>
              <div className="text-sm text-purple-600">3 flagged posts</div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <div className="font-medium text-orange-900">View Reports</div>
              <div className="text-sm text-orange-600">Generate custom report</div>
            </button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">API Status</span>
              </div>
              <span className="text-sm text-green-600">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Database</span>
              </div>
              <span className="text-sm text-green-600">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Payment Gateway</span>
              </div>
              <span className="text-sm text-green-600">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Storage Usage</span>
              </div>
              <span className="text-sm text-yellow-600">73% (24GB)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Server Uptime</span>
              </div>
              <span className="text-sm text-green-600">99.9%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      U{i}
                    </div>
                    <div>
                      <div className="font-medium text-sm">User {i}</div>
                      <div className="text-xs text-gray-500">user{i}@example.com</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">2h ago</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Moderation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium text-sm">Testimonies</div>
                  <div className="text-xs text-gray-500">12 pending approval</div>
                </div>
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200">
                  Review
                </button>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium text-sm">Forum Posts</div>
                  <div className="text-xs text-gray-500">3 flagged posts</div>
                </div>
                <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium hover:bg-orange-200">
                  Review
                </button>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium text-sm">Support Tickets</div>
                  <div className="text-xs text-gray-500">7 open tickets</div>
                </div>
                <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium hover:bg-purple-200">
                  View
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-sm">Church Registrations</div>
                  <div className="text-xs text-gray-500">2 pending verification</div>
                </div>
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200">
                  Verify
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
