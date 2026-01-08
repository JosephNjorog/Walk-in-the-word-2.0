import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Revenue Reports</h1>
      <Card>
        <CardHeader><CardTitle>Financial Analytics</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Revenue reports coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
