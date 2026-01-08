import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, Lock, Key, AlertTriangle, CheckCircle,
  Eye, Activity, UserX, Settings
} from 'lucide-react';

export default function SecurityPage() {
  const securityFeatures = [
    { name: 'SSL/TLS Encryption', status: 'active', icon: Lock, color: 'text-green-600' },
    { name: 'Two-Factor Auth', status: 'optional', icon: Key, color: 'text-blue-600' },
    { name: 'Session Management', status: 'active', icon: Activity, color: 'text-green-600' },
    { name: 'Rate Limiting', status: 'active', icon: Shield, color: 'text-green-600' },
    { name: 'Password Policy', status: 'active', icon: Lock, color: 'text-green-600' },
    { name: 'IP Blocking', status: 'inactive', icon: UserX, color: 'text-gray-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Security</h1>
        <p className="text-gray-500 mt-2">
          Monitor and manage application security
        </p>
      </div>

      {/* Security Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">Secure</div>
                <div className="text-sm text-gray-500">System Status</div>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Threats Blocked</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Failed Logins</div>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Active Sessions</div>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle>Security Features</CardTitle>
          <CardDescription>
            Active protection mechanisms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${feature.color}`} />
                    <div>
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-sm text-gray-500 capitalize">{feature.status}</div>
                    </div>
                  </div>
                  <Badge variant={feature.status === 'active' ? 'default' : 'secondary'}>
                    {feature.status === 'active' ? <CheckCircle className="h-3 w-3" /> : null}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Security Events</CardTitle>
          <CardDescription>
            Recent security-related activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No security events</p>
            <p className="text-sm mt-1">Security logs will appear here</p>
          </div>
        </CardContent>
      </Card>

      {/* Authentication Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Settings</CardTitle>
          <CardDescription>
            Configure login security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Password Requirements</div>
              <div className="text-sm text-gray-500">Min 8 chars, uppercase, numbers</div>
            </div>
            <Button variant="outline" size="sm" disabled>Configure</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Session Timeout</div>
              <div className="text-sm text-gray-500">Current: 7 days</div>
            </div>
            <Button variant="outline" size="sm" disabled>Change</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-gray-500">Optional for all users</div>
            </div>
            <Button variant="outline" size="sm" disabled>Enforce</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Security Actions</CardTitle>
          <CardDescription>
            Administrative security tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Force Password Reset</div>
              <div className="text-sm text-gray-500">Require all users to reset passwords</div>
            </div>
            <Button variant="outline" disabled>Reset All</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Revoke All Sessions</div>
              <div className="text-sm text-gray-500">Log out all active users</div>
            </div>
            <Button variant="outline" disabled>Revoke</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Export Security Audit</div>
              <div className="text-sm text-gray-500">Download security logs</div>
            </div>
            <Button variant="outline" disabled>Export</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
            <div>
              <div className="font-medium text-red-600">Emergency Lockdown</div>
              <div className="text-sm text-gray-500">Temporarily disable all logins</div>
            </div>
            <Button variant="destructive" disabled>Lockdown</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
