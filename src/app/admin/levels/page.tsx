import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LevelsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Levels & XP System</h1>
      <Card>
        <CardHeader><CardTitle>Level Configuration</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Levels management coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
