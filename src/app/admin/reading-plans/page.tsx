import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReadingPlansPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reading Plans</h1>
      <Card>
        <CardHeader><CardTitle>All Reading Plans</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Reading plans management coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
