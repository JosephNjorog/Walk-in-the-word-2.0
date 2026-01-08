import { db } from '@/lib/db';
import { memoryVerses } from '@/lib/schema';
import { sql } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, Brain, Star, TrendingUp, Users,
  Plus, Award, CheckCircle
} from 'lucide-react';

export default async function MemoryVersesPage() {
  // Get memory verse stats
  const totalVerses = await db.select({ count: sql<number>`count(*)` }).from(memoryVerses);

  const popularVerses = [
    { reference: 'John 3:16', count: 0, category: 'Salvation' },
    { reference: 'Philippians 4:13', count: 0, category: 'Strength' },
    { reference: 'Jeremiah 29:11', count: 0, category: 'Hope' },
    { reference: 'Proverbs 3:5-6', count: 0, category: 'Trust' },
    { reference: 'Romans 8:28', count: 0, category: 'Faith' },
  ];

  const categories = [
    { name: 'Salvation', icon: '✝️', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { name: 'Love', icon: '❤️', color: 'text-red-600', bgColor: 'bg-red-50' },
    { name: 'Faith', icon: '🙏', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { name: 'Hope', icon: '✨', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { name: 'Courage', icon: '🦁', color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { name: 'Wisdom', icon: '🧐', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Memory Verses</h1>
        <p className="text-gray-500 mt-2">
          Manage Scripture memorization system
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalVerses[0].count}</div>
                <div className="text-sm text-gray-500">Memorizing Users</div>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">100+</div>
                <div className="text-sm text-gray-500">Suggested Verses</div>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{categories.length}</div>
                <div className="text-sm text-gray-500">Categories</div>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Completed Today</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verse Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Verse Categories</CardTitle>
          <CardDescription>
            Organize verses by theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <div key={category.name} className={`p-4 border rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer ${category.bgColor}`}>
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className={`font-semibold ${category.color}`}>{category.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Verses */}
      <Card>
        <CardHeader>
          <CardTitle>Most Memorized Verses</CardTitle>
          <CardDescription>
            Verses users are memorizing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {popularVerses.map((verse, index) => (
              <div key={verse.reference} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-sm">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{verse.reference}</div>
                    <div className="text-sm text-gray-500">{verse.category}</div>
                  </div>
                </div>
                <Badge variant="secondary">{verse.count} users</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Verse Library */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Suggested Verse Library</CardTitle>
              <CardDescription>
                Curated verses for memorization
              </CardDescription>
            </div>
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Add Verse
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Verse library system coming soon</p>
            <p className="text-sm mt-1">Curated Scripture for memorization</p>
          </div>
        </CardContent>
      </Card>

      {/* Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Management Actions</CardTitle>
          <CardDescription>
            Memory verse system tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Create Verse Collection</div>
              <div className="text-sm text-gray-500">Group verses by theme or topic</div>
            </div>
            <Button disabled>Create</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Review Schedule Settings</div>
              <div className="text-sm text-gray-500">Configure spaced repetition</div>
            </div>
            <Button variant="outline" disabled>Configure</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Export User Progress</div>
              <div className="text-sm text-gray-500">Download memorization analytics</div>
            </div>
            <Button variant="outline" disabled>Export</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
