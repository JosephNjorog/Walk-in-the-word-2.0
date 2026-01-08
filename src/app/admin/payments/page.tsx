import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payments & Transactions</h1>
      <Card>
        <CardHeader><CardTitle>Transaction Log</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Payments management coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
