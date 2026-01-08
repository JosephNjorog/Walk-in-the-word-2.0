import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Church, Users, Crown, DollarSign, CheckCircle,
  Building, MapPin, Calendar
} from 'lucide-react';

export default function ChurchesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Church Accounts</h1>
        <p className="text-gray-500 mt-2">
          Manage church and ministry subscriptions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Total Churches</div>
              </div>
              <Church className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-gray-500">Active Subscriptions</div>
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
                <div className="text-sm text-gray-500">Total Members</div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">$0</div>
                <div className="text-sm text-gray-500">Monthly Revenue</div>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Church Features */}
      <Card>
        <CardHeader>
          <CardTitle>Church Tier Features</CardTitle>
          <CardDescription>
            What church subscriptions include
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Unlimited Members</h3>
                  <p className="text-sm text-gray-500">All church members get premium features</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                  <Building className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Church Dashboard</h3>
                  <p className="text-sm text-gray-500">Track congregation engagement</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Reading Plans</h3>
                  <p className="text-sm text-gray-500">Create church-wide reading plans</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-50 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Priority Support</h3>
                  <p className="text-sm text-gray-500">Dedicated support team</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registered Churches */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Churches</CardTitle>
          <CardDescription>
            View and manage church accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Church className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No churches registered yet</p>
            <p className="text-sm mt-1">Church accounts will appear here</p>
            <Button className="mt-4" disabled>Add Church</Button>
          </div>
        </CardContent>
      </Card>

      {/* Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Management Actions</CardTitle>
          <CardDescription>
            Church account administration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Create Church Account</div>
              <div className="text-sm text-gray-500">Set up new church subscription</div>
            </div>
            <Button disabled>Create</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Bulk Member Import</div>
              <div className="text-sm text-gray-500">Import church members via CSV</div>
            </div>
            <Button variant="outline" disabled>Import</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Generate Reports</div>
              <div className="text-sm text-gray-500">Church engagement analytics</div>
            </div>
            <Button variant="outline" disabled>Generate</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
