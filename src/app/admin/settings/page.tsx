import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, Shield, Bell, Database, Palette, 
  Globe, Mail, Lock, Zap, Code, ToggleLeft 
} from 'lucide-react';

export default function SettingsPage() {
  const settingSections = [
    {
      title: 'General Settings',
      icon: SettingsIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      settings: [
        { label: 'App Name', value: 'Walk in the Word', action: 'Edit' },
        { label: 'Default Bible Translation', value: 'KJV', action: 'Change' },
        { label: 'Default Reading Pace', value: '1 chapter/day', action: 'Adjust' },
        { label: 'Maintenance Mode', value: 'Off', action: 'Toggle', status: 'success' },
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      settings: [
        { label: 'Two-Factor Authentication', value: 'Optional', action: 'Enforce' },
        { label: 'Session Timeout', value: '7 days', action: 'Configure' },
        { label: 'Password Requirements', value: 'Strong', action: 'Modify' },
        { label: 'IP Whitelist', value: 'Disabled', action: 'Configure' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      settings: [
        { label: 'Email Notifications', value: 'Enabled', action: 'Configure', status: 'success' },
        { label: 'Push Notifications', value: 'Enabled', action: 'Configure', status: 'success' },
        { label: 'Admin Alerts', value: 'Enabled', action: 'Configure', status: 'success' },
        { label: 'Newsletter Schedule', value: 'Weekly', action: 'Change' },
      ]
    },
    {
      title: 'Database',
      icon: Database,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      settings: [
        { label: 'Storage Used', value: '24GB / 100GB', action: 'Manage' },
        { label: 'Auto Backup', value: 'Daily', action: 'Configure', status: 'success' },
        { label: 'Last Backup', value: '2 hours ago', action: 'Restore' },
        { label: 'Data Retention', value: '365 days', action: 'Adjust' },
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      settings: [
        { label: 'Primary Color', value: '#3B82F6', action: 'Change' },
        { label: 'Logo', value: 'logo.png', action: 'Upload' },
        { label: 'Favicon', value: 'favicon.ico', action: 'Upload' },
        { label: 'Theme Mode', value: 'Light/Dark', action: 'Configure' },
      ]
    },
    {
      title: 'Integrations',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      settings: [
        { label: 'Paystack API', value: 'Connected', action: 'Configure', status: 'success' },
        { label: 'Anthropic AI', value: 'Connected', action: 'Configure', status: 'success' },
        { label: 'Email Service (Resend)', value: 'Connected', action: 'Configure', status: 'success' },
        { label: 'CDN', value: 'Cloudflare', action: 'Configure' },
      ]
    },
  ];

  const featureFlags = [
    { name: 'Forums', enabled: true, description: 'Community discussion forums' },
    { name: 'Small Groups', enabled: true, description: 'Private study groups' },
    { name: 'Memory Verses', enabled: true, description: 'Scripture memorization tool' },
    { name: 'SOAP Journal', enabled: true, description: 'Personal Bible journaling' },
    { name: 'Testimonies', enabled: true, description: 'User testimony submissions' },
    { name: 'AI Insights', enabled: true, description: 'AI-powered Bible explanations' },
    { name: 'Gamification', enabled: true, description: 'Badges and achievements' },
    { name: 'Partnerships', enabled: true, description: 'Accountability partners' },
    { name: 'Video Calls', enabled: false, description: 'In-app video conferencing' },
    { name: 'Audio Bible', enabled: false, description: 'Audio playback of scripture' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500 mt-2">
          Configure app settings, features, and integrations
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.bgColor}`}>
                    <Icon className={`w-5 h-5 ${section.color}`} />
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.settings.map((setting, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <div className="text-sm font-medium">{setting.label}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          {setting.value}
                          {setting.status === 'success' && (
                            <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        {setting.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50">
              <ToggleLeft className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>Enable or disable app features</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featureFlags.map((feature) => (
              <div key={feature.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div>
                  <div className="font-medium text-sm">{feature.name}</div>
                  <div className="text-xs text-gray-500">{feature.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  {feature.enabled ? (
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  ) : (
                    <Badge variant="secondary">Disabled</Badge>
                  )}
                  <Button size="sm" variant="ghost">
                    <ToggleLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Keys & Environment */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <Code className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <CardTitle>API Keys & Environment</CardTitle>
              <CardDescription>Manage environment variables and API keys</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { key: 'PAYSTACK_SECRET_KEY', value: 'sk_test_••••••••••••••••', status: 'Set' },
              { key: 'ANTHROPIC_API_KEY', value: 'sk-ant-••••••••••••••••', status: 'Set' },
              { key: 'RESEND_API_KEY', value: 're_••••••••••••••••', status: 'Set' },
              { key: 'DATABASE_URL', value: 'postgresql://••••••', status: 'Set' },
              { key: 'NEXTAUTH_SECRET', value: '••••••••••••••••', status: 'Set' },
            ].map((env) => (
              <div key={env.key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <div className="text-sm font-medium font-mono">{env.key}</div>
                  <div className="text-xs text-gray-500">{env.value}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">{env.status}</Badge>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <Lock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-900">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Clear All Cache</div>
                <div className="text-xs text-gray-500">Clear application cache and rebuild</div>
              </div>
              <Button variant="destructive" size="sm">Clear Cache</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Reset All Statistics</div>
                <div className="text-xs text-gray-500">Reset analytics and metrics</div>
              </div>
              <Button variant="destructive" size="sm">Reset</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Factory Reset</div>
                <div className="text-xs text-gray-500">⚠️ Delete all data and restore defaults</div>
              </div>
              <Button variant="destructive" size="sm">Factory Reset</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
