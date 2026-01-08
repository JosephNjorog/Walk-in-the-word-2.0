import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, CreditCard, TrendingUp, Users } from 'lucide-react';

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscriptions</h1>
        <p className="text-gray-500 mt-2">Manage user subscriptions and premium accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-500">Active Premium</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-500">Free Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₦0</div>
            <div className="text-sm text-gray-500">MRR</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">0%</div>
            <div className="text-sm text-gray-500">Churn Rate</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Subscription management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
