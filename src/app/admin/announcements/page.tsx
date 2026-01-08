import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Announcements</h1>
      <Card>
        <CardHeader><CardTitle>App Announcements</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Announcements system coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
