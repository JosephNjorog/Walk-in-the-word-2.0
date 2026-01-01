"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  User,
  Bell,
  Lock,
  BookOpen,
  Trash2,
  Save,
  Loader2,
  Clock,
  Sparkles,
  Type,
  Sun,
  Moon,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notificationsSupported, setNotificationsSupported] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  
  const [settings, setSettings] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    preferredVersion: "KJV",
    readingPace: 1,
    emailNotifications: true,
    profileVisibility: "partners",
  });

  const [readingPrefs, setReadingPrefs] = useState({
    fontSize: 18,
    fontFamily: "serif",
    theme: "light",
    notificationsEnabled: true,
    dailyReminderTime: "08:00",
  });

  useEffect(() => {
    fetchSettings();
    
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationsSupported(true);
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const fetchSettings = async () => {
    try {
      const [profileRes, prefsRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/preferences"),
      ]);
      
      if (profileRes.ok) {
        const data = await profileRes.json();
        setSettings({
          name: data.name || "",
          username: data.username || "",
          email: data.email || "",
          bio: data.bio || "",
          preferredVersion: data.preferredVersion || "KJV",
          readingPace: data.readingPace || 1,
          emailNotifications: true,
          profileVisibility: "partners",
        });
      }
      
      if (prefsRes.ok) {
        const prefs = await prefsRes.json();
        setReadingPrefs({
          fontSize: prefs.fontSize || 18,
          fontFamily: prefs.fontFamily || "serif",
          theme: prefs.theme || "light",
          notificationsEnabled: prefs.notificationsEnabled ?? true,
          dailyReminderTime: prefs.dailyReminderTime || "08:00",
        });
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const requestNotificationPermission = async () => {
    if (!notificationsSupported) return;
    
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === "granted") {
        toast.success("Notifications enabled!");
        
        new Notification("Walk in the Word", {
          body: "You'll now receive daily verse reminders!",
          icon: "/icons/icon-192x192.png",
        });
        
        setReadingPrefs({ ...readingPrefs, notificationsEnabled: true });
        await savePreferences({ notificationsEnabled: true });
      } else {
        toast.error("Notification permission denied");
      }
    } catch (error) {
      toast.error("Failed to enable notifications");
    }
  };

  const savePreferences = async (prefs: Partial<typeof readingPrefs>) => {
    try {
      await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const [profileRes, prefsRes] = await Promise.all([
        fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        }),
        fetch("/api/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(readingPrefs),
        }),
      ]);

      if (profileRes.ok && prefsRes.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save some settings");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const sendTestNotification = () => {
    if (notificationPermission === "granted") {
      fetch("/api/verse-of-day")
        .then(res => res.json())
        .then(verse => {
          new Notification("Verse of the Day", {
            body: `"${verse.text.substring(0, 100)}..." - ${verse.reference}`,
            icon: "/icons/icon-192x192.png",
          });
        });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <h1 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Settings
            </h1>
            <Button size="sm" className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              Save
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="account" className="gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="reading" className="gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Reading</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-1">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={settings.username}
                    onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground italic">Email cannot be changed directly.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reading" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Reading Preferences</CardTitle>
                <CardDescription>Customize your reading experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Preferred Bible Version</Label>
                  <Select
                    value={settings.preferredVersion}
                    onValueChange={(value) => setSettings({ ...settings, preferredVersion: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KJV">KJV - King James Version</SelectItem>
                      <SelectItem value="WEB">WEB - World English Bible</SelectItem>
                      <SelectItem value="ASV">ASV - American Standard Version</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Daily Reading Goal (Chapters)</Label>
                  <Select
                    value={settings.readingPace.toString()}
                    onValueChange={(value) => setSettings({ ...settings, readingPace: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 chapter per day</SelectItem>
                      <SelectItem value="2">2 chapters per day</SelectItem>
                      <SelectItem value="3">3 chapters per day</SelectItem>
                      <SelectItem value="5">5 chapters per day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Font Size
                  </Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">A</span>
                    <input
                      type="range"
                      min={14}
                      max={28}
                      step={2}
                      value={readingPrefs.fontSize}
                      onChange={(e) => setReadingPrefs({ ...readingPrefs, fontSize: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-lg">A</span>
                    <span className="text-sm text-muted-foreground w-8">{readingPrefs.fontSize}px</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Font Style</Label>
                  <Select
                    value={readingPrefs.fontFamily}
                    onValueChange={(value) => setReadingPrefs({ ...readingPrefs, fontFamily: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="serif">Serif (Classic)</SelectItem>
                      <SelectItem value="sans">Sans-serif (Modern)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Reading Theme</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "light", icon: Sun, label: "Light" },
                      { id: "sepia", icon: BookOpen, label: "Sepia" },
                      { id: "dark", icon: Moon, label: "Dark" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setReadingPrefs({ ...readingPrefs, theme: t.id })}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                          readingPrefs.theme === t.id
                            ? "border-primary bg-primary/10"
                            : "border-muted hover:border-primary/50"
                        }`}
                      >
                        <t.icon className="h-5 w-5" />
                        <span className="text-xs">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Verse of the Day Notifications
                </CardTitle>
                <CardDescription>
                  Receive daily Scripture to start your morning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {notificationsSupported ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          {notificationPermission === "granted" 
                            ? "Notifications are enabled" 
                            : "Enable browser notifications"}
                        </p>
                      </div>
                      {notificationPermission === "granted" ? (
                        <Switch
                          checked={readingPrefs.notificationsEnabled}
                          onCheckedChange={(checked) =>
                            setReadingPrefs({ ...readingPrefs, notificationsEnabled: checked })
                          }
                        />
                      ) : (
                        <Button onClick={requestNotificationPermission} variant="outline" size="sm">
                          <Bell className="h-4 w-4 mr-2" />
                          Enable
                        </Button>
                      )}
                    </div>

                    {notificationPermission === "granted" && (
                      <>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Daily Reminder Time
                          </Label>
                          <Input
                            type="time"
                            value={readingPrefs.dailyReminderTime}
                            onChange={(e) => setReadingPrefs({ ...readingPrefs, dailyReminderTime: e.target.value })}
                          />
                          <p className="text-xs text-muted-foreground">
                            You&apos;ll receive the Verse of the Day at this time
                          </p>
                        </div>

                        <Button variant="outline" onClick={sendTestNotification} className="w-full">
                          <Bell className="h-4 w-4 mr-2" />
                          Send Test Notification
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Push notifications are not supported in this browser
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what emails you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Daily Reading Reminder</p>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily email reminder to read
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, emailNotifications: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your privacy and visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select
                    value={settings.profileVisibility}
                    onValueChange={(value) => setSettings({ ...settings, profileVisibility: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see</SelectItem>
                      <SelectItem value="partners">Partners Only</SelectItem>
                      <SelectItem value="private">Private - Only me</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
