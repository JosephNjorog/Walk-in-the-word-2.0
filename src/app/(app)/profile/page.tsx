"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Settings,
  Award,
  BookOpen,
  Calendar,
  MessageCircle,
  Flame,
  Edit,
  Camera,
  Share2,
  Lock,
  Loader2,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { TIERS } from "@/lib/gamification";

interface GamificationData {
  level: { currentLevel: number; levelName: string; totalXp: number; nextLevelXp: number };
  badges: { type: string; name: string; letter: string; unlocked: boolean }[];
  challenges: { id: string; name: string; description: string | null; participantCount: number; goalCount: number; joined: boolean; progress: number }[];
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [gamification, setGamification] = useState<GamificationData | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
    fetch("/api/gamification")
      .then((r) => (r.ok ? r.json() : null))
      .then(setGamification)
      .catch(console.error);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setEditData({
          name: data.name,
          username: data.username,
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        fetchProfile();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setSaving(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        // Update user image in DB
        await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: url }),
        });
        toast.success("Image uploaded successfully");
        fetchProfile();
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("An error occurred during upload");
    } finally {
      setSaving(false);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    setJoiningId(challengeId);
    try {
      const res = await fetch(`/api/challenges/${challengeId}/join`, { method: "POST" });
      if (!res.ok) throw new Error();
      const { joined } = await res.json();
      setGamification((prev) =>
        prev
          ? {
              ...prev,
              challenges: prev.challenges.map((c) =>
                c.id === challengeId
                  ? { ...c, joined, participantCount: c.participantCount + (joined ? 1 : -1) }
                  : c
              ),
            }
          : prev
      );
    } catch {
      toast.error("Failed to update challenge");
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <div className="h-48 sm:h-64 bg-gradient-to-br from-primary/20 via-accent/10 to-background">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <header className="absolute top-0 left-0 right-0 z-10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex h-16 items-center justify-between">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm">
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </header>
      </div>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 -mt-20 relative z-10 pb-8">
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
              <AvatarImage src={user.image} />
              <AvatarFallback className="text-4xl">{user.name?.[0]}</AvatarFallback>
            </Avatar>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
              className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </div>

          <div className="flex-1 pt-4 sm:pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {isEditing ? (
                <div className="space-y-4 w-full max-w-sm">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Display Name</label>
                    <Input 
                      value={editData.name} 
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <Input 
                      value={editData.username} 
                      onChange={(e) => setEditData({...editData, username: e.target.value})}
                      placeholder="@username"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleUpdateProfile} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Changes
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                      {user.name}
                    </h1>
                    <p className="text-muted-foreground">{user.username || `@user_${user.id.slice(0, 5)}`}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Profile link copied!");
                    }}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <p className="mb-4 text-muted-foreground">
              {user.bio || "Sharing my journey through the Word of God."}
            </p>
            <div className="p-4 rounded-xl bg-muted/50 scripture-text italic border-l-4 border-primary">
              <p className="text-sm">
                &ldquo;Thy word is a lamp unto my feet, and a light unto my path.&rdquo; - Psalm 119:105
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Member since {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/5 to-transparent">
            <CardContent className="p-4 text-center">
              <Flame className="h-6 w-6 mx-auto mb-2 text-secondary" />
              <p className="text-2xl font-bold">{user.currentStreak}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Day Streak</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{user.chaptersRead}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Chapters</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/5 to-transparent">
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-6 w-6 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold">{user.reflectionsCount}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Reflections</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/5 to-transparent">
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 mx-auto mb-2 text-secondary" />
              <p className="text-2xl font-bold">{user.longestStreak}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Best Streak</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="achievements">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="reflections">Public Reflections</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-6">
            {!gamification ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="rounded-[20px] p-[18px] text-white" style={{ background: "var(--purple-gradient)" }}>
                  <div className="mb-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      <span className="text-base font-bold">{gamification.level.levelName}</span>
                    </div>
                    <span className="text-xs opacity-90">
                      Level {gamification.level.currentLevel} of {TIERS.length}
                    </span>
                  </div>
                  <div className="mb-1.5 h-[7px] overflow-hidden rounded-full bg-white/30">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{
                        width: `${Math.min(100, gamification.level.nextLevelXp > 0 ? (gamification.level.totalXp / gamification.level.nextLevelXp) * 100 : 100)}%`,
                      }}
                    />
                  </div>
                  <div className="mb-2.5 text-[11.5px] opacity-90">
                    {gamification.level.totalXp} / {gamification.level.nextLevelXp} XP
                  </div>
                  <div className="flex gap-1">
                    {TIERS.map((t, i) => {
                      const active = i + 1 <= gamification.level.currentLevel;
                      return (
                        <div
                          key={t.name}
                          className="flex-1 rounded-lg py-1 text-center text-[10px] font-bold"
                          style={{ background: active ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.2)", color: active ? "hsl(258 90% 45%)" : "#fff" }}
                        >
                          {t.name}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-2.5 text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">Badges</div>
                  <div className="grid grid-cols-4 gap-3">
                    {gamification.badges.map((b) => (
                      <div key={b.type} className="flex flex-col items-center gap-1.5" style={{ opacity: b.unlocked ? 1 : 0.4 }}>
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
                          style={{ background: b.unlocked ? "var(--blue-gradient)" : "hsl(var(--muted-foreground))" }}
                        >
                          {b.unlocked ? <span className="text-lg font-extrabold">{b.letter}</span> : <Lock className="h-[18px] w-[18px]" />}
                        </div>
                        <span className="text-center text-[9.5px] font-semibold leading-tight text-muted-foreground">{b.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {gamification.challenges.length > 0 && (
                  <div>
                    <div className="mb-2.5 text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">
                      Community Challenges
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {gamification.challenges.map((c) => (
                        <div key={c.id} className="rounded-2xl border border-border bg-card p-4">
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-sm font-bold text-foreground">{c.name}</span>
                            <span className="text-[11px] text-muted-foreground">{c.participantCount} joined</span>
                          </div>
                          {c.description && <div className="mb-2 text-xs text-muted-foreground">{c.description}</div>}
                          <div className="flex items-center gap-2.5">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${c.goalCount > 0 ? Math.min(100, (c.progress / c.goalCount) * 100) : 0}%` }}
                              />
                            </div>
                            <button
                              onClick={() => handleJoinChallenge(c.id)}
                              disabled={joiningId === c.id}
                              className="flex-shrink-0 rounded-lg px-3 py-1.5 text-[11.5px] font-bold"
                              style={{
                                background: c.joined ? "hsl(40 33% 94%)" : "hsl(var(--primary))",
                                color: c.joined ? "hsl(var(--muted-foreground))" : "#fff",
                              }}
                            >
                              {c.joined ? "Joined" : "Join"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="reflections">
            <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Your public reflections will appear here for others to see.</p>
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
