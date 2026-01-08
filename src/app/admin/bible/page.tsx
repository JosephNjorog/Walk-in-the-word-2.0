import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, Languages, FileText, CheckCircle,
  Upload, Download, Database, Settings
} from 'lucide-react';

export default function BibleContentPage() {
  const translations = [
    { id: 'kjv', name: 'King James Version', abbr: 'KJV', status: 'active', verses: 31102 },
    { id: 'bbe', name: 'Bible in Basic English', abbr: 'BBE', status: 'active', verses: 31102 },
    { id: 'cuv', name: 'Chinese Union Version', abbr: 'CUV', status: 'active', verses: 31102 },
    { id: 'rvr', name: 'Reina Valera', abbr: 'RVR', status: 'active', verses: 31102 },
    { id: 'greek', name: 'Greek NT', abbr: 'GRK', status: 'active', verses: 7957 },
    { id: 'schlachter', name: 'Schlachter 2000', abbr: 'SCH', status: 'active', verses: 31102 },
    { id: 'apee', name: 'French Bible', abbr: 'APEE', status: 'active', verses: 31102 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bible Content Management</h1>
        <p className="text-gray-500 mt-2">
          Manage Bible translations, commentaries, and cross-references
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{translations.length}</div>
                <div className="text-sm text-gray-500">Translations</div>
              </div>
              <Languages className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">66</div>
                <div className="text-sm text-gray-500">Books</div>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">31,102</div>
                <div className="text-sm text-gray-500">Total Verses</div>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-gray-500">Imported</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bible Translations */}
      <Card>
        <CardHeader>
          <CardTitle>Bible Translations</CardTitle>
          <CardDescription>
            Manage available Bible versions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {translations.map((trans) => (
              <div key={trans.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{trans.name}</div>
                    <div className="text-sm text-gray-500">{trans.abbr} • {trans.verses.toLocaleString()} verses</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {trans.status}
                  </Badge>
                  <Button variant="outline" size="sm" disabled>Settings</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Management Actions</CardTitle>
          <CardDescription>
            Import and export Bible data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Upload className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Import New Translation</div>
                <div className="text-sm text-gray-500">Add Bible version from JSON/XML</div>
              </div>
            </div>
            <Button disabled>Import</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Export Translation</div>
                <div className="text-sm text-gray-500">Backup Bible data</div>
              </div>
            </div>
            <Button variant="outline" disabled>Export</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Rebuild Search Index</div>
                <div className="text-sm text-gray-500">Optimize search performance</div>
              </div>
            </div>
            <Button variant="outline" disabled>Rebuild</Button>
          </div>
        </CardContent>
      </Card>

      {/* Commentaries */}
      <Card>
        <CardHeader>
          <CardTitle>Commentaries</CardTitle>
          <CardDescription>
            Bible commentaries and study notes (Coming Soon)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Commentary system coming soon</p>
            <p className="text-sm mt-1">Matthew Henry, Gill's Exposition, and more</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
