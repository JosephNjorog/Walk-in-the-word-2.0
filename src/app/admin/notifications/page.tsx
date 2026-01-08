import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, Mail, Smartphone, MessageSquare, Clock,
  Send, Users, CheckCircle, Settings
} from 'lucide-react';

export default function NotificationsPage() {
  const notificationChannels = [
    { name: 'Email', icon: Mail, color: 'text-blue-600', bgColor: 'bg-blue-50', enabled: true },
    { name: 'Push', icon: Smartphone, color: 'text-green-600', bgColor: 'bg-green-50', enabled: true },
    { name: 'In-App', icon: Bell, color: 'text-purple-600', bgColor: 'bg-purple-50', enabled: true },
    { name: 'SMS', icon: MessageSquare, color: 'text-orange-600', bgColor: 'bg-orange-50', enabled: false },
  ];

  const notificationTypes = [
    { type: 'Reading Reminder', desc: 'Daily Bible reading notifications', enabled: true },
    { type: 'Streak Alert', desc: 'Remind users to maintain streaks', enabled: true },
    { type: 'Group Messages', desc: 'New messages in groups', enabled: true },
    { type: 'Achievements', desc: 'Achievement unlock notifications', enabled: true },
    { type: 'Forum Replies', desc: 'New replies to forum topics', enabled: true },
    { type: 'Partner Updates', desc: 'Updates from prayer partners', enabled: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500 mt-2">
          Manage notification system and campaigns
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Sent Today</div>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0%</div>
                <div className="text-sm text-gray-500">Open Rate</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Subscribers</div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>
            Delivery methods for notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notificationChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <div key={channel.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full ${channel.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${channel.color}`} />
                    </div>
                    <div>
                      <div className="font-semibold">{channel.name}</div>
                      <div className="text-sm text-gray-500">
                        {channel.enabled ? 'Active' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                  <Badge variant={channel.enabled ? "default" : "secondary"}>
                    {channel.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>
            Manage automated notification triggers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notificationTypes.map((notif) => (
              <div key={notif.type} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{notif.type}</div>
                  <div className="text-sm text-gray-500">{notif.desc}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={notif.enabled ? "default" : "secondary"}>
                    {notif.enabled ? 'Active' : 'Paused'}
                  </Badge>
                  <Button variant="ghost" size="sm" disabled>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Send Notification */}
      <Card>
        <CardHeader>
          <CardTitle>Send Manual Notification</CardTitle>
          <CardDescription>
            Create and send one-time notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 mb-4">Send targeted notifications to users</p>
            <Button disabled>
              <Send className="h-4 w-4 mr-2" />
              Compose Notification (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>
            View notification history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No notifications sent yet</p>
            <p className="text-sm mt-1">Notification history will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
