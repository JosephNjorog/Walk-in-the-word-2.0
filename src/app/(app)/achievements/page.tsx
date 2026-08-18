"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Award, Star, TrendingUp, Flame, Target, Crown, Zap } from "lucide-react";
import { toast } from "sonner";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string | null;
}

interface Level {
  level: number;
  currentXP: number;
  xpToNext: number;
  title: string;
}

export default function AchievementsPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [level, setLevel] = useState<Level>({ level: 1, currentXP: 0, xpToNext: 100, title: "Seeker" });
  const [stats, setStats] = useState({
    totalXP: 0,
    streak: 0,
    chaptersRead: 0,
    versesMemorized: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Mock data - replace with actual API calls
      setBadges([
        { id: "1", name: "First Steps", description: "Read your first chapter", icon: "📖", earnedAt: new Date().toISOString() },
        { id: "2", name: "Week Warrior", description: "Maintain 7-day reading streak", icon: "🔥", earnedAt: null },
        { id: "3", name: "Memory Master", description: "Memorize 10 verses", icon: "🧠", earnedAt: null },
        { id: "4", name: "Community Builder", description: "Join a small group", icon: "👥", earnedAt: new Date().toISOString() },
        { id: "5", name: "Discussion Leader", description: "Start 5 forum topics", icon: "💬", earnedAt: null },
        { id: "6", name: "Testament Complete", description: "Read entire New Testament", icon: "📕", earnedAt: null },
      ]);

      setLevel({ level: 3, currentXP: 250, xpToNext: 400, title: "Disciple" });
      setStats({ totalXP: 650, streak: 5, chaptersRead: 42, versesMemorized: 3 });
    } catch (error) {
      toast.error("Failed to load achievements");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const earnedBadges = badges.filter(b => b.earnedAt);
  const lockedBadges = badges.filter(b => !b.earnedAt);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Achievements & Progress
        </h1>
        <p className="text-muted-foreground">
          Track your spiritual growth journey and earn rewards
        </p>
      </div>

      {/* Level Card */}
      <Card className="mb-8 bg-linear-to-r from-purple-500 to-blue-500 text-white border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Crown className="h-6 w-6" />
                Level {level.level} - {level.title}
              </CardTitle>
              <CardDescription className="text-white/80 mt-1">
                {level.currentXP} / {level.xpToNext} XP to next level
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.totalXP}</div>
              <div className="text-sm text-white/80">Total XP</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress 
            value={(level.currentXP / level.xpToNext) * 100} 
            className="h-3 bg-white/20"
          />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reading Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streak} days</div>
            <p className="text-xs text-muted-foreground">Keep it going!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chapters Read</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.chaptersRead}</div>
            <p className="text-xs text-muted-foreground">Out of 1,189 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verses Memorized</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.versesMemorized}</div>
            <p className="text-xs text-muted-foreground">Hidden in your heart</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            <Award className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnedBadges.length}</div>
            <p className="text-xs text-muted-foreground">
              {lockedBadges.length} more to unlock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      <Tabs defaultValue="earned" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="earned">Earned ({earnedBadges.length})</TabsTrigger>
          <TabsTrigger value="locked">Locked ({lockedBadges.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="earned" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedBadges.map((badge) => (
              <Card key={badge.id} className="border-yellow-200 dark:border-yellow-800">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{badge.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{badge.name}</CardTitle>
                      <CardDescription>{badge.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant="default" className="bg-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    Earned
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locked" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedBadges.map((badge) => (
              <Card key={badge.id} className="opacity-60">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="text-4xl grayscale">{badge.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{badge.name}</CardTitle>
                      <CardDescription>{badge.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">
                    Locked
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Level Titles Reference */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Level Progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-bold">Level 1-5</div>
              <div className="text-muted-foreground">Seeker</div>
            </div>
            <div>
              <div className="font-bold">Level 6-10</div>
              <div className="text-muted-foreground">Disciple</div>
            </div>
            <div>
              <div className="font-bold">Level 11-20</div>
              <div className="text-muted-foreground">Scholar</div>
            </div>
            <div>
              <div className="font-bold">Level 21-30</div>
              <div className="text-muted-foreground">Teacher</div>
            </div>
            <div>
              <div className="font-bold">Level 31-40</div>
              <div className="text-muted-foreground">Shepherd</div>
            </div>
            <div>
              <div className="font-bold">Level 41-50</div>
              <div className="text-muted-foreground">Elder</div>
            </div>
            <div>
              <div className="font-bold">Level 51+</div>
              <div className="text-muted-foreground">Sage</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
