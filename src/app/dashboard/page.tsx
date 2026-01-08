"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  Users,
  MessageCircle,
  Award,
  ChevronRight,
  Calendar,
  Flame,
  Heart,
  Share2,
  MoreHorizontal,
  Plus,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { BIBLE_BOOKS } from "@/lib/bible-utils";

const dailyVerse = {
  text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
  reference: "Proverbs 3:5-6",
};

const TOTAL_CHAPTERS = 1189;

function getNextChapter(progress: { book: string; chapter: number }[]): { book: string; chapter: number } {
  if (progress.length === 0) {
    return { book: "Genesis", chapter: 1 };
  }
  
  const completedSet = new Set(progress.map(p => `${p.book}-${p.chapter}`));
  
  for (const bookInfo of BIBLE_BOOKS) {
    for (let ch = 1; ch <= bookInfo.chapters; ch++) {
      if (!completedSet.has(`${bookInfo.name}-${ch}`)) {
        return { book: bookInfo.name, chapter: ch };
      }
    }
  }
  
  return { book: "Genesis", chapter: 1 };
}

function getReadingLevel(chaptersRead: number): string {
  if (chaptersRead < 10) return "New Reader";
  if (chaptersRead < 50) return "Growing Reader";
  if (chaptersRead < 100) return "Devoted Reader";
  if (chaptersRead < 500) return "Scripture Scholar";
  return "Bible Master";
}

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [progress, setProgress] = useState<{ book: string; chapter: number }[]>([]);
  const [reflections, setReflections] = useState<{ id: string; book: string; chapter: number; content: string; createdAt: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const notifications = 0;

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    } else if (session?.user?.email === 'mwangijoenjoroge@gmail.com') {
      // Direct check for admin email - redirect immediately
      router.push('/admin');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    async function fetchData() {
      if (!session) return;
      try {
        const [progressRes, reflectionsRes] = await Promise.all([
          fetch("/api/progress"),
          fetch("/api/reflections")
        ]);
        
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgress(Array.isArray(progressData) ? progressData : []);
        }
        
        if (reflectionsRes.ok) {
          const reflectionsData = await reflectionsRes.json();
          setReflections(Array.isArray(reflectionsData) ? reflectionsData : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [session]);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const user = session.user;
  const chaptersReadCount = progress.length;
  const progressPercent = (chaptersReadCount / TOTAL_CHAPTERS) * 100;
  const currentStreak = (user as any).currentStreak || 0;
  const level = getReadingLevel(chaptersReadCount);
  const nextChapter = getNextChapter(progress);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold hidden sm:block" style={{ fontFamily: "var(--font-heading)" }}>
                Walk in the Word
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback>{user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <Award className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3 space-y-6">
            <Card className="card-hover border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback className="text-2xl">{user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                  {user.name}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">{level}</p>

                <div className="flex justify-center gap-6 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-secondary streak-fire">
                      <Flame className="h-6 w-6" />
                      {currentStreak}
                    </div>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">
                      {chaptersReadCount}
                    </div>
                    <p className="text-xs text-muted-foreground">Chapters</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{progressPercent.toFixed(1)}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {chaptersReadCount} of {TOTAL_CHAPTERS} chapters
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {[
                    { icon: BookOpen, label: "My Reflections", href: "/reflections" },
                    { icon: TrendingUp, label: "Reading Plan", href: "/progress" },
                    { icon: Award, label: "Achievements", href: "/profile" },
                    { icon: Users, label: "Partnerships", href: "/partnerships" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>

          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="card-hover border-0 shadow-lg overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-accent" />
                <CardContent className="p-6">
                  <p className="scripture-text text-lg italic mb-2">
                    &ldquo;{dailyVerse.text}&rdquo;
                  </p>
                  <p className="text-sm text-muted-foreground">{dailyVerse.reference}</p>
                  <Button variant="ghost" size="sm" className="mt-2 -ml-2">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Verse
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="card-hover border-0 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm opacity-90">Today&apos;s Reading</span>
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                      Day {chaptersReadCount + 1}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                    {nextChapter.book} {nextChapter.chapter}
                  </h3>
                  <p className="text-sm opacity-90 mb-4">Continue your reading journey</p>
                  <div className="flex items-center gap-4">
                    <Link href={`/read/${encodeURIComponent(nextChapter.book.toLowerCase())}/${nextChapter.chapter}`}>
                      <Button className="bg-white text-primary hover:bg-white/90">
                        Start Reading
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                    <span className="text-sm opacity-75">~8 min read</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  My Reflections
                </h2>
                <Link href="/reflections">
                  <Button variant="ghost" size="sm">
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : reflections.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No reflections yet. Start reading and share your thoughts!</p>
                    <Link href={`/read/${encodeURIComponent(nextChapter.book.toLowerCase())}/${nextChapter.chapter}`}>
                      <Button className="btn-primary">Start Reading</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                reflections.slice(0, 3).map((reflection, index) => (
                  <motion.div
                    key={reflection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="card-hover border-0 shadow-lg">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.image || undefined} />
                            <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{user.name}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{formatDate(reflection.createdAt)}</span>
                            </div>
                            <Link 
                              href={`/read/${encodeURIComponent(reflection.book.toLowerCase())}/${reflection.chapter}`}
                              className="text-sm text-primary hover:underline mb-2 inline-block"
                            >
                              {reflection.book} {reflection.chapter}
                            </Link>
                            <p className="text-sm text-muted-foreground mb-3">
                              {reflection.content}
                            </p>
                            <div className="flex items-center gap-4">
                              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors">
                                <Heart className="h-4 w-4" />
                              </button>
                              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <Share2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <aside className="lg:col-span-3 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Reading Progress</span>
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${progressPercent * 2.51} 251`}
                      transform="rotate(-90 50 50)"
                      className="progress-ring"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{chaptersReadCount}</span>
                    <span className="text-xs text-muted-foreground">chapters</span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {[...Array(28)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-4 rounded-sm ${
                        i < currentStreak % 28
                          ? "bg-green-500"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Current Streak: {currentStreak} days
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Reading Partners</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground text-center py-4">
                  Invite friends to read with you!
                </p>
                <Link href="/partnerships">
                  <Button variant="outline" className="w-full" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Invite Partner
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/10 to-secondary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="h-8 w-8 text-secondary" />
                  <div>
                    <p className="font-semibold">Next Milestone</p>
                    <p className="text-sm text-muted-foreground">
                      {chaptersReadCount < 50 
                        ? `${50 - chaptersReadCount} chapters to Devoted Reader!`
                        : chaptersReadCount < 100
                        ? `${100 - chaptersReadCount} chapters to Scripture Scholar!`
                        : "Keep growing in the Word!"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{chaptersReadCount}/{chaptersReadCount < 50 ? 50 : chaptersReadCount < 100 ? 100 : 500}</span>
                  </div>
                  <Progress 
                    value={(chaptersReadCount / (chaptersReadCount < 50 ? 50 : chaptersReadCount < 100 ? 100 : 500)) * 100} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
