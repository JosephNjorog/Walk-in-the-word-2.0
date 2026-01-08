import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AchievementsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Achievements & Badges</h1>
      <Card>
        <CardHeader><CardTitle>Badge Management</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Achievements management coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
