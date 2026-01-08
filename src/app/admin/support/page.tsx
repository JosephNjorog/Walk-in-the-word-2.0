import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, MessageSquare, Mail, CheckCircle,
  Clock, AlertCircle, Users, Send
} from 'lucide-react';

export default function SupportPage() {
  const ticketStats = [
    { status: 'Open', count: 0, color: 'text-blue-600', bgColor: 'bg-blue-50', icon: MessageSquare },
    { status: 'In Progress', count: 0, color: 'text-orange-600', bgColor: 'bg-orange-50', icon: Clock },
    { status: 'Resolved', count: 0, color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle },
    { status: 'Urgent', count: 0, color: 'text-red-600', bgColor: 'bg-red-50', icon: AlertCircle },
  ];

  const categories = [
    'Technical Issue',
    'Account Problem',
    'Billing Question',
    'Feature Request',
    'Bug Report',
    'General Inquiry',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Support</h1>
        <p className="text-gray-500 mt-2">
          Manage user support tickets and inquiries
        </p>
      </div>

      {/* Ticket Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {ticketStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.status}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stat.count}</div>
                    <div className="text-sm text-gray-500">{stat.status}</div>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Support Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Support Channels</CardTitle>
          <CardDescription>
            Ways users can reach out for help
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Mail className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <div className="font-semibold mb-1">Email Support</div>
              <div className="text-sm text-gray-500">support@walktheword.app</div>
              <Badge variant="secondary" className="mt-2">Active</Badge>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <div className="font-semibold mb-1">Live Chat</div>
              <div className="text-sm text-gray-500">In-app messaging</div>
              <Badge variant="secondary" className="mt-2">Coming Soon</Badge>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <HelpCircle className="h-8 w-8 mx-auto mb-3 text-purple-600" />
              <div className="font-semibold mb-1">Help Center</div>
              <div className="text-sm text-gray-500">Knowledge base</div>
              <Badge variant="secondary" className="mt-2">Coming Soon</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Categories</CardTitle>
          <CardDescription>
            Common support request types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <div key={category} className="p-3 border rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="font-medium">{category}</div>
                <Badge variant="secondary" className="mt-2">0 tickets</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Support Tickets</CardTitle>
              <CardDescription>
                Latest user inquiries
              </CardDescription>
            </div>
            <Button disabled>
              <Send className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <HelpCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No support tickets</p>
            <p className="text-sm mt-1">User inquiries will appear here</p>
          </div>
        </CardContent>
      </Card>

      {/* Support Team */}
      <Card>
        <CardHeader>
          <CardTitle>Support Team</CardTitle>
          <CardDescription>
            Team members handling support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-6">
            <Users className="h-10 w-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Support team configuration coming soon</p>
          </div>
        </CardContent>
      </Card>

      {/* Canned Responses */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Responses</CardTitle>
          <CardDescription>
            Pre-written responses for common issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { title: 'Welcome Message', preview: 'Thank you for contacting Walk in the Word support...' },
            { title: 'Password Reset', preview: 'To reset your password, please follow these steps...' },
            { title: 'Feature Request', preview: 'Thank you for your feedback! We\'ve noted your request...' },
          ].map((response) => (
            <div key={response.title} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">{response.title}</div>
                <div className="text-sm text-gray-500">{response.preview}</div>
              </div>
              <Button variant="ghost" size="sm" disabled>Use</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Support Metrics</CardTitle>
          <CardDescription>
            Team performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">0h</div>
              <div className="text-sm text-gray-500 mt-1">Avg Response Time</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">0%</div>
              <div className="text-sm text-gray-500 mt-1">Resolution Rate</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-gray-500 mt-1">Satisfaction Score</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">0d</div>
              <div className="text-sm text-gray-500 mt-1">Avg Resolution Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
