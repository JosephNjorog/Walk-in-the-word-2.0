import { db } from '@/lib/db';
import { user, readingProgress } from '@/lib/schema';
import { sql, desc, asc, or, like } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Search, Filter, Download, UserPlus, Shield, Ban, 
  CheckCircle, Clock, Crown 
} from 'lucide-react';

interface SearchParams {
  search?: string;
  role?: string;
  level?: string;
  sort?: string;
  page?: string;
}

export default async function UsersManagementPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 50;
  const offset = (page - 1) * pageSize;

  // Build query conditions
  let query = db.select({
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
    level: user.level,
    reputation: user.reputation,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    lastReadAt: user.lastReadAt,
  }).from(user);

  // Apply search filter
  if (searchParams.search) {
    query = query.where(
      or(
        like(user.name, `%${searchParams.search}%`),
        like(user.email, `%${searchParams.search}%`),
        like(user.username, `%${searchParams.search}%`)
      )
    ) as any;
  }

  // Apply sorting
  if (searchParams.sort === 'newest') {
    query = query.orderBy(desc(user.createdAt)) as any;
  } else if (searchParams.sort === 'oldest') {
    query = query.orderBy(asc(user.createdAt)) as any;
  } else if (searchParams.sort === 'active') {
    query = query.orderBy(desc(user.lastReadAt)) as any;
  } else {
    query = query.orderBy(desc(user.createdAt)) as any;
  }

  const users = await query.limit(pageSize).offset(offset);

  // Get total count
  const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(user);
  const total = totalUsers[0]?.count || 0;
  const totalPages = Math.ceil(total / pageSize);

  // Get stats
  const stats = {
    totalUsers: total,
    admins: await db.select({ count: sql<number>`count(*)` })
      .from(user)
      .where(sql`${user.role} = 'admin'`)
      .then(r => r[0]?.count || 0),
    pastors: await db.select({ count: sql<number>`count(*)` })
      .from(user)
      .where(sql`${user.role} = 'pastor'`)
      .then(r => r[0]?.count || 0),
    verified: await db.select({ count: sql<number>`count(*)` })
      .from(user)
      .where(sql`${user.isVerified} = true`)
      .then(r => r[0]?.count || 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-2">
            Manage all registered users, roles, and permissions
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
            <div className="text-sm text-gray-500">Administrators</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.pastors}</div>
            <div className="text-sm text-gray-500">Pastors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
            <div className="text-sm text-gray-500">Verified Users</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name, email, or username..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="pastor">Pastor</option>
              <option value="member">Member</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
              <option value="">All Levels</option>
              <option value="Seeker">Seeker</option>
              <option value="Disciple">Disciple</option>
              <option value="Teacher">Teacher</option>
              <option value="Scholar">Scholar</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="active">Most Active</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reputation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Streak</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-sm flex items-center gap-2">
                            {u.name}
                            {u.isVerified && (
                              <CheckCircle className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                          {u.username && (
                            <div className="text-xs text-gray-400">@{u.username}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {u.role === 'admin' && (
                        <Badge variant="default" className="bg-purple-100 text-purple-800 flex items-center gap-1 w-fit">
                          <Shield className="w-3 h-3" />
                          Admin
                        </Badge>
                      )}
                      {u.role === 'pastor' && (
                        <Badge variant="default" className="bg-blue-100 text-blue-800 flex items-center gap-1 w-fit">
                          <Crown className="w-3 h-3" />
                          Pastor
                        </Badge>
                      )}
                      {u.role === 'member' && (
                        <Badge variant="secondary" className="w-fit">Member</Badge>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="outline" className="w-fit">{u.level}</Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium">{u.reputation || 0}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <span className="font-medium text-orange-600">{u.currentStreak || 0}</span>
                        <span className="text-gray-400 text-xs"> / {u.longestStreak || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-600">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                      {u.lastReadAt && (
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {new Date(u.lastReadAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="default" className="bg-green-100 text-green-800 w-fit">
                        Active
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/users/${u.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {offset + 1} to {Math.min(offset + pageSize, total)} of {total} users
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? 'default' : 'outline'}
                    size="sm"
                    className="w-8"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
