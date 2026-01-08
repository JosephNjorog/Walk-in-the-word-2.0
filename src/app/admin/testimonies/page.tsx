import { db } from '@/lib/db';
import { testimonies, user } from '@/lib/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, XCircle, Eye, Trash2, Star, Clock,
  MessageSquare, AlertCircle 
} from 'lucide-react';

export default async function TestimoniesManagementPage() {
  // Get all testimonies with user info
  const allTestimonies = await db
    .select({
      id: testimonies.id,
      title: testimonies.title,
      content: testimonies.content,
      category: testimonies.category,
      isFeatured: testimonies.isFeatured,
      isPublic: testimonies.isPublic,
      createdAt: testimonies.createdAt,
      userId: testimonies.userId,
      userName: user.name,
      userEmail: user.email,
    })
    .from(testimonies)
    .leftJoin(user, eq(testimonies.userId, user.id))
    .orderBy(desc(testimonies.createdAt));

  // Get stats - using isPublic as proxy for approval
  const pending = allTestimonies.filter(t => !t.isPublic);
  const approved = allTestimonies.filter(t => t.isPublic);
  const featured = allTestimonies.filter(t => t.isFeatured);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Testimonies Management</h1>
        <p className="text-gray-500 mt-2">
          Review, approve, and manage user testimonies
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{allTestimonies.length}</div>
            <div className="text-sm text-gray-500">Total Testimonies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{pending.length}</div>
            <div className="text-sm text-gray-500">Pending Approval</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{approved.length}</div>
            <div className="text-sm text-gray-500">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{featured.length}</div>
            <div className="text-sm text-gray-500">Featured</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Testimonies */}
      {pending.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader className="bg-orange-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Pending Approval ({pending.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {pending.map((testimony) => (
                <div key={testimony.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{testimony.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">by {testimony.userName}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <Badge variant="outline">{testimony.category}</Badge>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {testimony.createdAt ? new Date(testimony.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {testimony.content}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Full
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Feature
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approved Testimonies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Approved Testimonies ({approved.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {approved.map((testimony) => (
              <div key={testimony.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{testimony.title}</h3>
                      {testimony.isFeatured && (
                        <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">by {testimony.userName}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <Badge variant="outline">{testimony.category}</Badge>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {testimony.createdAt ? new Date(testimony.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Approved</Badge>
                </div>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {testimony.content}
                </p>

                <div className="flex items-center gap-2">
                  {!testimony.isFeatured ? (
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Feature
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      Unfeature
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
