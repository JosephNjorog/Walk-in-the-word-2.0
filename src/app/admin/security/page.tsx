import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Security</h1>
      <Card>
        <CardHeader><CardTitle>Security Monitoring</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Security features coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
