"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Flame,
  BookOpen,
  Calendar,
  Award,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PartnerProfilePage() {
  const params = useParams();
  const partnerId = params.id as string;
  
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any[]>([]);

  useEffect(() => {
    fetchPartnerProfile();
  }, [partnerId]);

  const fetchPartnerProfile = async () => {
    try {
      const res = await fetch(`/api/profile/${partnerId}`);
      if (res.ok) {
        const data = await res.json();
        setPartner(data.user);
        setProgress(data.progress || []);
      } else {
        toast.error("Failed to load partner profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Partner Not Found</h2>
          <p className="text-muted-foreground mb-4">This user doesn't exist or you don't have access.</p>
          <Link href="/partnerships">
            <Button>Back to Partnerships</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalChapters = 1189;
  const readPercentage = (progress.length / totalChapters) * 100;
  const lastRead = partner.lastReadAt 
    ? new Date(partner.lastReadAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Not yet started';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/partnerships">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Partner Profile
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Header */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-primary via-primary/90 to-accent relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200')] bg-cover bg-center opacity-10" />
            </div>
            <CardContent className="relative -mt-16 pb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-6">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src={partner.image} />
                  <AvatarFallback className="text-3xl">{partner.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-3xl font-bold">{partner.name}</h2>
                  <p className="text-muted-foreground">@{partner.username || 'user'}</p>
                </div>
                <Link href="/partnerships">
                  <Button className="btn-primary gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Send Encouragement
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-secondary/20">
                    <Flame className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-3xl font-bold">{partner.currentStreak || 0}</p>
                    <p className="text-xs text-muted-foreground">days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/20">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Chapters Read</p>
                    <p className="text-3xl font-bold">{progress.length}</p>
                    <p className="text-xs text-muted-foreground">of {totalChapters}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-accent/20">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Longest Streak</p>
                    <p className="text-3xl font-bold">{partner.longestStreak || 0}</p>
                    <p className="text-xs text-muted-foreground">days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Bible Reading Progress</h3>
                  <span className="text-sm text-muted-foreground">
                    {readPercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={readPercentage} className="h-3" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{progress.length} chapters completed</span>
                  <span>{totalChapters - progress.length} remaining</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Activity */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-muted">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Read</p>
                  <p className="text-lg font-semibold">{lastRead}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Chapters */}
          {progress.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Chapters</h3>
                <div className="space-y-2">
                  {progress.slice(0, 10).map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {item.book} {item.chapter}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(item.readAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
}
