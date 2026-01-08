import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ModerationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Content Moderation</h1>
      <Card>
        <CardHeader><CardTitle>Moderation Queue</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Moderation tools coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
