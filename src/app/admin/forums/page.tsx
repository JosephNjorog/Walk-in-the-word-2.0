import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForumsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Forums Management</h1>
      <Card>
        <CardHeader><CardTitle>Categories & Topics</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Forums management coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
