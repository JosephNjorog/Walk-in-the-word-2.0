"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  BookOpen,
  CheckCircle,
  Circle,
  ChevronRight,
  Flame,
  Award,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const bibleBooks = [
  { name: "Genesis", chapters: 50, completed: 47, testament: "old" },
  { name: "Exodus", chapters: 40, completed: 0, testament: "old" },
  { name: "Leviticus", chapters: 27, completed: 0, testament: "old" },
  { name: "Numbers", chapters: 36, completed: 0, testament: "old" },
  { name: "Deuteronomy", chapters: 34, completed: 0, testament: "old" },
  { name: "Joshua", chapters: 24, completed: 0, testament: "old" },
  { name: "Judges", chapters: 21, completed: 0, testament: "old" },
  { name: "Ruth", chapters: 4, completed: 0, testament: "old" },
  { name: "Matthew", chapters: 28, completed: 0, testament: "new" },
  { name: "Mark", chapters: 16, completed: 0, testament: "new" },
  { name: "Luke", chapters: 24, completed: 0, testament: "new" },
  { name: "John", chapters: 21, completed: 0, testament: "new" },
  { name: "Acts", chapters: 28, completed: 0, testament: "new" },
  { name: "Romans", chapters: 16, completed: 0, testament: "new" },
  { name: "Revelation", chapters: 22, completed: 0, testament: "new" },
];

const readingStats = {
  totalChapters: 1189,
  chaptersRead: 47,
  currentStreak: 14,
  longestStreak: 21,
  averagePerDay: 1.2,
  totalMinutes: 320,
  estimatedCompletion: "3.2 years",
};

const weeklyActivity = [
  { day: "Mon", read: true, chapters: 1 },
  { day: "Tue", read: true, chapters: 2 },
  { day: "Wed", read: true, chapters: 1 },
  { day: "Thu", read: false, chapters: 0 },
  { day: "Fri", read: true, chapters: 1 },
  { day: "Sat", read: true, chapters: 3 },
  { day: "Sun", read: false, chapters: 0 },
];

export default function ProgressPage() {
  const progressPercent = (readingStats.chaptersRead / readingStats.totalChapters) * 100;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <h1 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Reading Progress
            </h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-accent" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Overall Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold gradient-text">
                        {readingStats.chaptersRead}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        of {readingStats.totalChapters} chapters
                      </p>
                    </div>
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
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
                          stroke="url(#progressGradient)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${progressPercent * 2.51} 251`}
                          transform="rotate(-90 50 50)"
                        />
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="hsl(var(--accent))" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">{progressPercent.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <Flame className="h-5 w-5 mx-auto mb-1 text-secondary" />
                      <p className="text-xl font-bold">{readingStats.currentStreak}</p>
                      <p className="text-xs text-muted-foreground">Day Streak</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <Award className="h-5 w-5 mx-auto mb-1 text-secondary" />
                      <p className="text-xl font-bold">{readingStats.longestStreak}</p>
                      <p className="text-xs text-muted-foreground">Best Streak</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <BookOpen className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-xl font-bold">{readingStats.averagePerDay}</p>
                      <p className="text-xs text-muted-foreground">Avg/Day</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-xl font-bold">{readingStats.totalMinutes}</p>
                      <p className="text-xs text-muted-foreground">Minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Bible Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="w-full">
                    <div className="flex gap-2 pb-4">
                      {bibleBooks.map((book) => {
                        const percent = book.completed / book.chapters;
                        return (
                          <Link key={book.name} href={`/read/${book.name.toLowerCase()}/1`}>
                            <div
                              className={cn(
                                "flex-shrink-0 w-20 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                                percent === 1
                                  ? "bg-green-100 border-green-300 dark:bg-green-900/30"
                                  : percent > 0
                                  ? "bg-primary/10 border-primary/30"
                                  : "bg-muted/30 border-muted"
                              )}
                            >
                              <p className="text-xs font-medium truncate">{book.name}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {book.completed}/{book.chapters}
                              </p>
                              <div className="h-1 bg-muted rounded-full mt-2 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-primary to-accent"
                                  style={{ width: `${percent * 100}%` }}
                                />
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {weeklyActivity.map((day) => (
                      <div key={day.day} className="text-center">
                        <p className="text-xs text-muted-foreground mb-2">{day.day}</p>
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg mx-auto flex items-center justify-center",
                            day.read
                              ? "bg-green-500 text-white"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {day.read ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </div>
                        <p className="text-xs mt-1">
                          {day.chapters > 0 ? `${day.chapters} ch` : "-"}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">
                      5 of 7 days completed this week
                    </p>
                    <Progress value={71} className="h-2 mt-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-accent/10">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Estimated Completion
                    </p>
                    <p className="text-2xl font-bold gradient-text">
                      {readingStats.estimatedCompletion}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      at your current pace of {readingStats.averagePerDay} chapters/day
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Up Next</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { chapter: "Genesis 48", time: "6 min" },
                    { chapter: "Genesis 49", time: "8 min" },
                    { chapter: "Genesis 50", time: "5 min" },
                  ].map((item) => (
                    <Link
                      key={item.chapter}
                      href={`/read/${item.chapter.toLowerCase().replace(" ", "/")}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <span className="font-medium">{item.chapter}</span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {item.time}
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
