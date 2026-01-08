import { db } from '@/lib/db';
import { groups, groupMembers } from '@/lib/schema';
import { sql } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, UserPlus, Shield, Lock, Globe,
  MessageSquare, Calendar, TrendingUp
} from 'lucide-react';

export default async function GroupsPage() {
  // Get group stats
  const totalGroups = await db.select({ count: sql<number>`count(*)` }).from(groups);
  const totalMembers = await db.select({ count: sql<number>`count(*)` }).from(groupMembers);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Small Groups Management</h1>
        <p className="text-gray-500 mt-2">
          Manage Bible study groups and communities
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalGroups[0].count}</div>
                <div className="text-sm text-gray-500">Total Groups</div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalMembers[0].count}</div>
                <div className="text-sm text-gray-500">Total Members</div>
              </div>
              <UserPlus className="h-8 w-8 text-green-600" />
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
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Messages Today</div>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Group Types */}
      <Card>
        <CardHeader>
          <CardTitle>Group Categories</CardTitle>
          <CardDescription>
            Different types of groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Small Groups</h3>
                  <p className="text-sm text-gray-500">Intimate Bible study groups (8-12 members)</p>
                  <Badge variant="secondary" className="mt-2">0 groups</Badge>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Study Groups</h3>
                  <p className="text-sm text-gray-500">Topical or book studies</p>
                  <Badge variant="secondary" className="mt-2">0 groups</Badge>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Church Groups</h3>
                  <p className="text-sm text-gray-500">Official church groups</p>
                  <Badge variant="secondary" className="mt-2">0 groups</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Groups */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Groups</CardTitle>
              <CardDescription>
                Manage existing groups
              </CardDescription>
            </div>
            <Button disabled>Create Group</Button>
          </div>
        </CardHeader>
        <CardContent>
          {totalGroups[0].count === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No groups created yet</p>
              <p className="text-sm mt-1">Small groups will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-gray-500 py-4">Loading groups...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Group Privacy Options</CardTitle>
          <CardDescription>
            Understand group visibility settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Lock className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <div className="font-medium">Private Groups</div>
                <div className="text-sm text-gray-500">Invite-only, not visible in search</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Globe className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <div className="font-medium">Public Groups</div>
                <div className="text-sm text-gray-500">Anyone can discover and join</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Management Actions</CardTitle>
          <CardDescription>
            Group administration tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Featured Groups</div>
              <div className="text-sm text-gray-500">Promote specific groups</div>
            </div>
            <Button variant="outline" disabled>Manage</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Export Group Data</div>
              <div className="text-sm text-gray-500">Download group analytics</div>
            </div>
            <Button variant="outline" disabled>Export</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Archive Inactive Groups</div>
              <div className="text-sm text-gray-500">Clean up old groups</div>
            </div>
            <Button variant="outline" disabled>Archive</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
