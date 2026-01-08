import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Support</h1>
      <Card>
        <CardHeader><CardTitle>Support Tickets</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Support system coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
