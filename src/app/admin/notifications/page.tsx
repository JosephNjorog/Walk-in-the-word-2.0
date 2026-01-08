import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notifications</h1>
      <Card>
        <CardHeader><CardTitle>Send Notifications</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Notification system coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
