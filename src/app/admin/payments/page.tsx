import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, CreditCard, TrendingUp, Users, CheckCircle,
  XCircle, Clock, Download, RefreshCw
} from 'lucide-react';

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payments & Transactions</h1>
        <p className="text-gray-500 mt-2">
          Monitor payment processing and transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">$0</div>
                <div className="text-sm text-gray-500">Total Revenue</div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Successful</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Failed</div>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Gateway */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Gateway</CardTitle>
          <CardDescription>
            Paystack integration status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border rounded-lg bg-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="font-semibold text-lg">Paystack</div>
                  <div className="text-sm text-gray-600">Payment processing for Africa</div>
                </div>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
            <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">USD</div>
                <div className="text-sm text-gray-600">Currency</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">KSH</div>
                <div className="text-sm text-gray-600">Currency</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">Live</div>
                <div className="text-sm text-gray-600">Mode</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Latest payment activity
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No transactions yet</p>
            <p className="text-sm mt-1">Payment records will appear here once Paystack is integrated</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Payment Methods</CardTitle>
          <CardDescription>
            Available payment options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Card', 'Mobile Money', 'Bank Transfer', 'USSD'].map((method) => (
              <div key={method} className="p-4 border rounded-lg text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <div className="font-medium text-sm">{method}</div>
                <Badge variant="secondary" className="mt-2">Soon</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Management</CardTitle>
          <CardDescription>
            Administrative tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Issue Refund</div>
              <div className="text-sm text-gray-500">Process refunds for transactions</div>
            </div>
            <Button variant="outline" disabled>Refund</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Generate Invoice</div>
              <div className="text-sm text-gray-500">Create custom invoices</div>
            </div>
            <Button variant="outline" disabled>Create</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Webhook Logs</div>
              <div className="text-sm text-gray-500">View Paystack webhook events</div>
            </div>
            <Button variant="outline" disabled>View Logs</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Test Payment</div>
              <div className="text-sm text-gray-500">Run test transactions</div>
            </div>
            <Button variant="outline" disabled>Test</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
