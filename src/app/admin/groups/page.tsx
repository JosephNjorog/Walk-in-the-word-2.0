import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GroupsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Small Groups Management</h1>
      <Card>
        <CardHeader><CardTitle>All Groups</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Groups management coming soon...</p></CardContent>
      </Card>
    </div>
  );
}
