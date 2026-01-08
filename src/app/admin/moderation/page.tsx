import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, AlertTriangle, Ban, CheckCircle, Eye,
  Flag, MessageSquare, Users, Clock
} from 'lucide-react';

export default function ModerationPage() {
  const moderationAreas = [
    { name: 'Forum Posts', pending: 0, icon: MessageSquare, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { name: 'Testimonies', pending: 0, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
    { name: 'User Reports', pending: 0, icon: Flag, color: 'text-red-600', bgColor: 'bg-red-50' },
    { name: 'Group Messages', pending: 0, icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  const moderationActions = [
    { label: 'Approve Content', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Flag for Review', icon: Flag, color: 'text-orange-600' },
    { label: 'Remove Content', icon: Ban, color: 'text-red-600' },
    { label: 'Ban User', icon: Shield, color: 'text-red-600' },
    { label: 'Warn User', icon: AlertTriangle, color: 'text-yellow-600' },
    { label: 'Dismiss Report', icon: CheckCircle, color: 'text-gray-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
        <p className="text-gray-500 mt-2">
          Review and moderate user-generated content
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Pending Reviews</div>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">User Reports</div>
              </div>
              <Flag className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Banned Users</div>
              </div>
              <Ban className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Actions Today</div>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Moderation Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Moderation Areas</CardTitle>
          <CardDescription>
            Content requiring review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moderationAreas.map((area) => {
              const Icon = area.icon;
              return (
                <div key={area.name} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${area.bgColor} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${area.color}`} />
                      </div>
                      <div>
                        <div className="font-semibold">{area.name}</div>
                        <div className="text-sm text-gray-500">{area.pending} pending</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled>Review</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Available Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Moderation Actions</CardTitle>
          <CardDescription>
            Tools available for content moderation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {moderationActions.map((action) => {
              const Icon = action.icon;
              return (
                <div key={action.label} className="p-3 border rounded-lg text-center">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${action.color}`} />
                  <div className="text-sm font-medium">{action.label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
          <CardDescription>
            Content awaiting moderation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Shield className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No pending moderation</p>
            <p className="text-sm mt-1">Flagged content will appear here</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Moderation Actions</CardTitle>
          <CardDescription>
            History of moderation decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No moderation actions yet</p>
            <p className="text-sm mt-1">Action history will appear here</p>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Moderation Settings</CardTitle>
          <CardDescription>
            Configure moderation rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Auto-moderation Rules</div>
              <div className="text-sm text-gray-500">Configure automatic content filtering</div>
            </div>
            <Button variant="outline" disabled>Configure</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Banned Words List</div>
              <div className="text-sm text-gray-500">Manage prohibited terms</div>
            </div>
            <Button variant="outline" disabled>Manage</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Moderator Roles</div>
              <div className="text-sm text-gray-500">Assign moderation permissions</div>
            </div>
            <Button variant="outline" disabled>Manage</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
