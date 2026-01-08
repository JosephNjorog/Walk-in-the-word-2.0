import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DatabasePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Database Management</h1>
      <Card>
        <CardHeader><CardTitle>Database Tools</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Database tools coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
