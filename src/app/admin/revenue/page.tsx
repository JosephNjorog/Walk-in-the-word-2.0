import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, TrendingUp, TrendingDown, BarChart,
  Calendar, Download, Users, CreditCard
} from 'lucide-react';

export default function RevenuePage() {
  const revenueMetrics = [
    { period: 'Today', amount: 0, change: 0, trend: 'neutral' },
    { period: 'This Week', amount: 0, change: 0, trend: 'neutral' },
    { period: 'This Month', amount: 0, change: 0, trend: 'neutral' },
    { period: 'This Year', amount: 0, change: 0, trend: 'neutral' },
  ];

  const revenueByTier = [
    { tier: 'Premium Monthly', revenue: 0, users: 0, percentage: 0 },
    { tier: 'Premium Yearly', revenue: 0, users: 0, percentage: 0 },
    { tier: 'Church Monthly', revenue: 0, users: 0, percentage: 0 },
    { tier: 'Church Yearly', revenue: 0, users: 0, percentage: 0 },
    { tier: 'Lifetime', revenue: 0, users: 0, percentage: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Revenue Reports</h1>
        <p className="text-gray-500 mt-2">
          Financial analytics and revenue tracking
        </p>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {revenueMetrics.map((metric) => (
          <Card key={metric.period}>
            <CardContent className="pt-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">{metric.period}</div>
                <div className="text-2xl font-bold">${metric.amount.toLocaleString()}</div>
                <div className="flex items-center gap-1 mt-1">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  ) : null}
                  <span className={`text-sm ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MRR & ARR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">MRR</div>
                <div className="text-2xl font-bold">$0</div>
                <div className="text-xs text-gray-500 mt-1">Monthly Recurring Revenue</div>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">ARR</div>
                <div className="text-2xl font-bold">$0</div>
                <div className="text-xs text-gray-500 mt-1">Annual Recurring Revenue</div>
              </div>
              <BarChart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">ARPU</div>
                <div className="text-2xl font-bold">$0</div>
                <div className="text-xs text-gray-500 mt-1">Avg Revenue Per User</div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Subscription Tier */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Subscription Tier</CardTitle>
          <CardDescription>
            Breakdown of revenue sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {revenueByTier.map((item) => (
              <div key={item.tier} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{item.tier}</div>
                    <div className="text-sm text-gray-500">{item.users} subscribers</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${item.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>
            Monthly revenue over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-12">
            <BarChart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p>Revenue chart coming soon</p>
            <p className="text-sm mt-1">Visual analytics will appear here</p>
          </div>
        </CardContent>
      </Card>

      {/* Export Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>
            Download financial reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Monthly Revenue Report</div>
              <div className="text-sm text-gray-500">Detailed monthly breakdown</div>
            </div>
            <Button variant="outline" disabled>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Yearly Financial Summary</div>
              <div className="text-sm text-gray-500">Annual revenue report</div>
            </div>
            <Button variant="outline" disabled>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Subscription Analytics</div>
              <div className="text-sm text-gray-500">Subscriber trends and metrics</div>
            </div>
            <Button variant="outline" disabled>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Growth Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Indicators</CardTitle>
          <CardDescription>
            Key performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">0%</div>
              <div className="text-sm text-gray-500 mt-1">Growth Rate</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">0%</div>
              <div className="text-sm text-gray-500 mt-1">Churn Rate</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-gray-500 mt-1">New Subscribers</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold">$0</div>
              <div className="text-sm text-gray-500 mt-1">LTV</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
