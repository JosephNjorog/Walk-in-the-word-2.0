import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BibleContentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bible Content Management</h1>
      <Card>
        <CardHeader><CardTitle>Translations</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Manage Bible translations...</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Commentaries</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Manage commentaries...</p></CardContent>
      </Card>
    </div>
  );
}
