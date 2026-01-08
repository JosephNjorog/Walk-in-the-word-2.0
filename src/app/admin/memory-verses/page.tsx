import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MemoryVersesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Memory Verses</h1>
      <Card>
        <CardHeader><CardTitle>Verse Library</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Memory verses management coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
