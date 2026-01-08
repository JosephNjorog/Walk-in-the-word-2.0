import { db } from '@/lib/db';
import { readingPlans, userReadingPlans } from '@/lib/schema';
import { sql } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, BookOpen, Users, TrendingUp, Clock,
  Plus, Star, Target, CheckCircle
} from 'lucide-react';

export default async function ReadingPlansPage() {
  // Get reading plan stats
  const totalPlans = await db.select({ count: sql<number>`count(*)` }).from(readingPlans);
  const totalEnrollments = await db.select({ count: sql<number>`count(*)` }).from(userReadingPlans);

  const planTypes = [
    { name: 'Sequential', desc: 'Read Bible in order', icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { name: 'Chronological', desc: 'Historical order', icon: Clock, color: 'text-green-600', bgColor: 'bg-green-50' },
    { name: 'Thematic', desc: 'Topic-based reading', icon: Target, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { name: 'Devotional', desc: 'Daily devotions', icon: Star, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reading Plans</h1>
        <p className="text-gray-500 mt-2">
          Create and manage Bible reading plans
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalPlans[0].count}</div>
                <div className="text-sm text-gray-500">Total Plans</div>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalEnrollments[0].count}</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0%</div>
                <div className="text-sm text-gray-500">Completion Rate</div>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Types */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Categories</CardTitle>
          <CardDescription>
            Different types of reading plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {planTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.name} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className={`h-10 w-10 rounded-full ${type.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`h-5 w-5 ${type.color}`} />
                  </div>
                  <h3 className="font-semibold mb-1">{type.name}</h3>
                  <p className="text-sm text-gray-500">{type.desc}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* All Plans */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Reading Plans</CardTitle>
              <CardDescription>
                Manage existing plans
              </CardDescription>
            </div>
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {totalPlans[0].count === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No reading plans created yet</p>
              <p className="text-sm mt-1">Create your first reading plan to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-gray-500 py-4">Loading plans...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Featured Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Reading Plans</CardTitle>
          <CardDescription>
            Pre-built plans for users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Bible in a Year', duration: '365 days', users: 0 },
              { name: 'New Testament in 90 Days', duration: '90 days', users: 0 },
              { name: 'Psalms & Proverbs', duration: '60 days', users: 0 },
              { name: 'Gospels Journey', duration: '40 days', users: 0 },
            ].map((plan) => (
              <div key={plan.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-sm text-gray-500">{plan.duration} • {plan.users} users</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled>Edit</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Management</CardTitle>
          <CardDescription>
            Administrative tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Import Plan Template</div>
              <div className="text-sm text-gray-500">Upload reading plan from file</div>
            </div>
            <Button variant="outline" disabled>Import</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Generate Custom Plan</div>
              <div className="text-sm text-gray-500">Create plan with AI assistance</div>
            </div>
            <Button variant="outline" disabled>Generate</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Plan Analytics</div>
              <div className="text-sm text-gray-500">View completion statistics</div>
            </div>
            <Button variant="outline" disabled>View Stats</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
