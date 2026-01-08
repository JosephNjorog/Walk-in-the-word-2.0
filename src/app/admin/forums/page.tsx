import { db } from '@/lib/db';
import { forumCategories, forumTopics, forumReplies } from '@/lib/schema';
import { sql } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, Folder, TrendingUp, Users, Eye,
  Pin, Lock, Trash2, Plus
} from 'lucide-react';

export default async function ForumsPage() {
  // Get forum stats
  const totalTopics = await db.select({ count: sql<number>`count(*)` }).from(forumTopics);
  const totalReplies = await db.select({ count: sql<number>`count(*)` }).from(forumReplies);
  const totalCategories = await db.select({ count: sql<number>`count(*)` }).from(forumCategories);

  const categories = [
    { name: 'Bible Study', slug: 'bible-study', topics: 0, icon: '📖' },
    { name: 'Prayer Requests', slug: 'prayer', topics: 0, icon: '🙏' },
    { name: 'Testimonies', slug: 'testimonies', topics: 0, icon: '✨' },
    { name: 'Questions', slug: 'questions', topics: 0, icon: '❓' },
    { name: 'General Discussion', slug: 'general', topics: 0, icon: '💬' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Forums Management</h1>
        <p className="text-gray-500 mt-2">
          Manage discussion categories and topics
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalCategories[0].count}</div>
                <div className="text-sm text-gray-500">Categories</div>
              </div>
              <Folder className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalTopics[0].count}</div>
                <div className="text-sm text-gray-500">Topics</div>
              </div>
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalReplies[0].count}</div>
                <div className="text-sm text-gray-500">Replies</div>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Active Today</div>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forum Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Forum Categories</CardTitle>
              <CardDescription>
                Manage discussion categories
              </CardDescription>
            </div>
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.slug} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{category.icon}</div>
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-gray-500">
                      {category.topics} topics • /{category.slug}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" disabled>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" disabled>
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Topics</CardTitle>
          <CardDescription>
            Latest forum discussions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalTopics[0].count === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No topics yet</p>
              <p className="text-sm mt-1">Forum topics will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Topics will be listed here */}
              <p className="text-center text-gray-500 py-4">Loading topics...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Moderation Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Moderation Tools</CardTitle>
          <CardDescription>
            Forum administration actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Pin className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Pin/Unpin Topics</div>
                <div className="text-sm text-gray-500">Highlight important discussions</div>
              </div>
            </div>
            <Button variant="outline" disabled>Manage</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Lock/Unlock Topics</div>
                <div className="text-sm text-gray-500">Prevent new replies</div>
              </div>
            </div>
            <Button variant="outline" disabled>Manage</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-red-500" />
              <div>
                <div className="font-medium text-red-600">Delete Topics/Replies</div>
                <div className="text-sm text-gray-500">Remove inappropriate content</div>
              </div>
            </div>
            <Button variant="destructive" disabled>Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
