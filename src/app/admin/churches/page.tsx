import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChurchesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Church Accounts</h1>
      <Card>
        <CardHeader><CardTitle>Registered Churches</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Church management coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
