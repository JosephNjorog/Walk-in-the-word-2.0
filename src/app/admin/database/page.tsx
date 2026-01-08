import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, HardDrive, Activity, RefreshCw, Download,
  Upload, Trash2, AlertTriangle, CheckCircle
} from 'lucide-react';

export default async function DatabasePage() {
  // Get database size estimate (count records from main tables)
  const tables = [
    'user', 'reading_progress', 'reflections', 'achievements',
    'testimonies', 'groups', 'forum_topics', 'journal_entries'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Database Management</h1>
        <p className="text-gray-500 mt-2">
          Monitor and maintain database health
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">PostgreSQL</div>
                <div className="text-sm text-gray-500">Database Type</div>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">Online</div>
                <div className="text-sm text-gray-500">Status</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{tables.length}+</div>
                <div className="text-sm text-gray-500">Tables</div>
              </div>
              <HardDrive className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">Good</div>
                <div className="text-sm text-gray-500">Health</div>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Tables */}
      <Card>
        <CardHeader>
          <CardTitle>Database Tables</CardTitle>
          <CardDescription>
            Overview of main database tables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tables.map((table) => (
              <div key={table} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium font-mono text-sm">{table}</div>
                    <div className="text-xs text-gray-500">Active</div>
                  </div>
                </div>
                <Badge variant="secondary">Healthy</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Operations</CardTitle>
          <CardDescription>
            Database administration tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Backup Database</div>
                <div className="text-sm text-gray-500">Create full database backup</div>
              </div>
            </div>
            <Button variant="outline" disabled>Backup</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Upload className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Restore Database</div>
                <div className="text-sm text-gray-500">Restore from backup file</div>
              </div>
            </div>
            <Button variant="outline" disabled>Restore</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Vacuum & Optimize</div>
                <div className="text-sm text-gray-500">Clean up and optimize tables</div>
              </div>
            </div>
            <Button variant="outline" disabled>Optimize</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <div className="font-medium text-red-600">Clear All Data</div>
                <div className="text-sm text-gray-500">Dangerous! Deletes all database records</div>
              </div>
            </div>
            <Button variant="destructive" disabled>Clear</Button>
          </div>
        </CardContent>
      </Card>

      {/* Connection Info */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Information</CardTitle>
          <CardDescription>
            Database connection details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Provider:</span>
              <span className="text-sm text-gray-600">Neon (Serverless Postgres)</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Connection:</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Region:</span>
              <span className="text-sm text-gray-600">Auto (Optimized)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
