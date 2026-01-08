import { db } from '@/lib/db';
import { achievements, user } from '@/lib/schema';
import { sql, desc, eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Award, TrendingUp, Users, BookOpen, Target, Trophy,
  Star, Zap, Crown, Shield
} from 'lucide-react';

export default async function AchievementsPage() {
  // Get achievement stats
  const achievementStats = await db
    .select({
      type: achievements.type,
      count: sql<number>`count(*)`,
    })
    .from(achievements)
    .groupBy(achievements.type);

  // Get total achievements unlocked
  const totalUnlocked = await db
    .select({ count: sql<number>`count(*)` })
    .from(achievements);

  // Get top achievers
  const topAchievers = await db
    .select({
      userId: achievements.userId,
      userName: user.name,
      userEmail: user.email,
      achievementCount: sql<number>`count(*)`,
    })
    .from(achievements)
    .leftJoin(user, eq(achievements.userId, user.id))
    .groupBy(achievements.userId, user.name, user.email)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  // Define achievement types
  const achievementTypes = [
    { 
      id: 'first_chapter', 
      name: 'First Step', 
      description: 'Read your first chapter',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      id: '10_chapters', 
      name: 'Getting Started', 
      description: 'Read 10 chapters',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      id: '50_chapters', 
      name: 'Dedicated Reader', 
      description: 'Read 50 chapters',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      id: '100_chapters', 
      name: 'Bible Scholar', 
      description: 'Read 100 chapters',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    { 
      id: '7_day_streak', 
      name: 'Consistent Reader', 
      description: '7 day reading streak',
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      id: '30_day_streak', 
      name: 'Faithful', 
      description: '30 day reading streak',
      icon: Zap,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    { 
      id: 'testament_complete', 
      name: 'Testament Complete', 
      description: 'Complete Old or New Testament',
      icon: Crown,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    { 
      id: 'bible_complete', 
      name: 'Bible Master', 
      description: 'Complete entire Bible',
      icon: Shield,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Achievements & Badges</h1>
        <p className="text-gray-500 mt-2">
          Manage achievement system and track user progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalUnlocked[0].count}</div>
                <div className="text-sm text-gray-500">Total Unlocked</div>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{achievementTypes.length}</div>
                <div className="text-sm text-gray-500">Achievement Types</div>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{topAchievers.length}</div>
                <div className="text-sm text-gray-500">Active Achievers</div>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Types */}
      <Card>
        <CardHeader>
          <CardTitle>Achievement Types</CardTitle>
          <CardDescription>
            All available achievements in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievementTypes.map((achievement) => {
              const Icon = achievement.icon;
              const stat = achievementStats.find(s => s.type === achievement.id);
              return (
                <div key={achievement.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className={`h-12 w-12 rounded-full ${achievement.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`h-6 w-6 ${achievement.color}`} />
                  </div>
                  <h3 className="font-semibold mb-1">{achievement.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{achievement.description}</p>
                  <Badge variant="secondary">
                    {stat?.count || 0} unlocked
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Achievers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Achievers</CardTitle>
          <CardDescription>
            Users with the most achievements unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topAchievers.map((achiever, index) => (
              <div key={achiever.userId} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{achiever.userName}</div>
                    <div className="text-sm text-gray-500">{achiever.userEmail}</div>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Trophy className="h-3 w-3 mr-1" />
                  {achiever.achievementCount} achievements
                </Badge>
              </div>
            ))}
            {topAchievers.length === 0 && (
              <p className="text-center text-gray-500 py-8">No achievements unlocked yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Management Actions</CardTitle>
          <CardDescription>
            Configure achievement system settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Add New Achievement Type</div>
              <div className="text-sm text-gray-500">Create custom achievement badges</div>
            </div>
            <Button disabled>Coming Soon</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Grant Achievement</div>
              <div className="text-sm text-gray-500">Manually award achievements to users</div>
            </div>
            <Button disabled>Coming Soon</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Reset User Achievements</div>
              <div className="text-sm text-gray-500">Clear achievements for testing</div>
            </div>
            <Button variant="destructive" disabled>Coming Soon</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

