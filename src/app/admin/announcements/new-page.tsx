import { db } from '@/lib/db';
import { user } from '@/lib/schema';
import { sql, desc } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Megaphone, Bell, AlertCircle, CheckCircle, Clock,
  Users, Eye, Send
} from 'lucide-react';

export default async function AnnouncementsPage() {
  // Get user count for announcements
  const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(user);
  const premiumUsers = await db
    .select({ count: sql<number>`count(*)` })
    .from(user)
    .where(sql`${user.subscriptionTier} = 'premium'`);

  const announcementTypes = [
    {
      id: 'general',
      name: 'General Update',
      description: 'App updates and general news',
      icon: Megaphone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'feature',
      name: 'New Feature',
      description: 'Announce new features',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      description: 'Scheduled downtime',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'alert',
      name: 'Important Alert',
      description: 'Critical notifications',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
        <p className="text-gray-500 mt-2">
          Send app-wide announcements and notifications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalUsers[0].count}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{premiumUsers[0].count}</div>
                <div className="text-sm text-gray-500">Premium Users</div>
              </div>
              <Badge className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Sent Today</div>
              </div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Announcement */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Announcement</CardTitle>
          <CardDescription>
            Send notifications to all or specific user groups
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcementTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-full ${type.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${type.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{type.name}</h3>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Button className="w-full" size="lg" disabled>
            <Megaphone className="h-4 w-4 mr-2" />
            Create Announcement (Coming Soon)
          </Button>
        </CardContent>
      </Card>

      {/* Target Audiences */}
      <Card>
        <CardHeader>
          <CardTitle>Target Audiences</CardTitle>
          <CardDescription>
            Choose who receives your announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">All Users</div>
                  <div className="text-sm text-gray-500">{totalUsers[0].count} recipients</div>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>Select</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-medium">Premium Users Only</div>
                  <div className="text-sm text-gray-500">{premiumUsers[0].count} recipients</div>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>Select</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Free Users Only</div>
                  <div className="text-sm text-gray-500">{totalUsers[0].count - premiumUsers[0].count} recipients</div>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>Select</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
          <CardDescription>
            View announcement history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Megaphone className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No announcements sent yet</p>
            <p className="text-sm mt-1">Your announcement history will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
