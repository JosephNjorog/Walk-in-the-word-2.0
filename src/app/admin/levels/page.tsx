import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, Star, Crown, Shield, Target,
  BookOpen, Award, Zap
} from 'lucide-react';

export default function LevelsPage() {
  const levels = [
    { 
      id: 1, 
      name: 'Seeker', 
      minXP: 0, 
      maxXP: 99,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      icon: BookOpen,
      description: 'Just beginning your journey'
    },
    { 
      id: 2, 
      name: 'Disciple', 
      minXP: 100, 
      maxXP: 499,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: Star,
      description: 'Growing in the Word'
    },
    { 
      id: 3, 
      name: 'Teacher', 
      minXP: 500, 
      maxXP: 1499,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: Award,
      description: 'Sharing wisdom with others'
    },
    { 
      id: 4, 
      name: 'Scholar', 
      minXP: 1500, 
      maxXP: 4999,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      icon: Crown,
      description: 'Deep knowledge of Scripture'
    },
    { 
      id: 5, 
      name: 'Master', 
      minXP: 5000, 
      maxXP: null,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: Shield,
      description: 'Elite Bible scholar'
    },
  ];

  const xpActions = [
    { action: 'Read a chapter', xp: 10, icon: BookOpen },
    { action: 'Complete a reading plan day', xp: 15, icon: Target },
    { action: 'Write a reflection', xp: 20, icon: Star },
    { action: '7-day streak', xp: 50, icon: Zap },
    { action: 'Complete a book', xp: 100, icon: Award },
    { action: 'Join a group', xp: 25, icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Levels & XP System</h1>
        <p className="text-gray-500 mt-2">
          Configure gamification and progression system
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{levels.length}</div>
                <div className="text-sm text-gray-500">Total Levels</div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{xpActions.length}</div>
                <div className="text-sm text-gray-500">XP Actions</div>
              </div>
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">5,000</div>
                <div className="text-sm text-gray-500">Max XP Required</div>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">Active</div>
                <div className="text-sm text-gray-500">System Status</div>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Level Tiers</CardTitle>
          <CardDescription>
            Progression system and requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {levels.map((level) => {
              const Icon = level.icon;
              return (
                <div key={level.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full ${level.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${level.color}`} />
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {level.name}
                        <Badge variant="secondary">Level {level.id}</Badge>
                      </div>
                      <div className="text-sm text-gray-500">{level.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {level.minXP} - {level.maxXP || '∞'} XP
                    </div>
                    <div className="text-sm text-gray-500">Required</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* XP Actions */}
      <Card>
        <CardHeader>
          <CardTitle>XP Rewards</CardTitle>
          <CardDescription>
            Experience points awarded for actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {xpActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-gray-400" />
                    <div className="font-medium">{action.action}</div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    +{action.xp} XP
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>
            Manage XP and level settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Add New Level</div>
              <div className="text-sm text-gray-500">Create additional progression tiers</div>
            </div>
            <Button disabled>Add Level</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Adjust XP Values</div>
              <div className="text-sm text-gray-500">Modify experience point rewards</div>
            </div>
            <Button variant="outline" disabled>Adjust</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Grant XP to Users</div>
              <div className="text-sm text-gray-500">Manually award experience points</div>
            </div>
            <Button variant="outline" disabled>Grant XP</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Level Leaderboard</div>
              <div className="text-sm text-gray-500">View top users by level</div>
            </div>
            <Button variant="outline" disabled>View</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
