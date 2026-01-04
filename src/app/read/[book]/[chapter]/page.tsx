"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Bookmark,
  Share2,
  Settings2,
  Sun,
  Moon,
  Type,
  Check,
  Sparkles,
  Loader2,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Confetti from "react-confetti";
import { useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { getChapterId, getNavigation } from "@/lib/bible-utils";

type Theme = "light" | "sepia" | "dark";

const themeClasses: Record<Theme, string> = {
  light: "bg-white text-foreground",
  sepia: "bg-amber-50 text-amber-950",
  dark: "bg-slate-900 text-slate-100",
};

export default function ReadingPage() {
  const params = useParams();
  const book = decodeURIComponent(params.book as string);
  const chapter = params.chapter as string;
  const chapterNum = parseInt(chapter);
  
  const { data: session } = authClient.useSession();
  const [bibleId, setBibleId] = useState("9879dbb7cfe39e4d-01"); // WEB - World English Bible
  const [versions, setVersions] = useState<{ id: string; abbreviation: string; name: string }[]>([]);
  const [versionSearch, setVersionSearch] = useState("");
  const [content, setContent] = useState<{ content: string; reference: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<{ chaptersRead: number; streak: number }>({ chaptersRead: 0, streak: 0 });

  const [fontSize, setFontSize] = useState([18]);
  const [theme, setTheme] = useState<Theme>("light");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState("");
  const [isShared, setIsShared] = useState(false);

  const displayBook = book.charAt(0).toUpperCase() + book.slice(1);
  const navigation = useMemo(() => getNavigation(book, chapterNum), [book, chapterNum]);

  useEffect(() => {
    async function fetchVersions() {
      try {
        const res = await fetch("/api/bible/versions");
        if (!res.ok) throw new Error("Failed to fetch versions");
        const data = await res.json();
        setVersions(data);
        if ((session?.user as any)?.preferredVersion) {
          const pref = data.find((v: { abbreviation: string }) => v.abbreviation === (session.user as any).preferredVersion);
          if (pref) setBibleId(pref.id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchVersions();
  }, [session]);

  useEffect(() => {
    async function fetchContent() {
      setIsLoading(true);
      try {
        const chapterId = getChapterId(displayBook, chapter);
        const res = await fetch(`/api/bible/chapter?bibleId=${bibleId}&chapterId=${chapterId}`);
        if (!res.ok) throw new Error("Failed to fetch chapter");
        const data = await res.json();
        setContent(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load chapter content");
      } finally {
        setIsLoading(false);
      }
    }
    if (book && chapter) fetchContent();
  }, [book, chapter, bibleId, displayBook]);

  useEffect(() => {
    async function fetchProgress() {
      if (!session) return;
      try {
        const res = await fetch("/api/progress");
        if (!res.ok) return;
        const data = await res.json();
        setUserProgress({
          chaptersRead: Array.isArray(data) ? data.length : 0,
          streak: (session.user as any).currentStreak || 0,
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchProgress();
  }, [session]);

  const handleComplete = async () => {
    if (!session) {
      toast.error("Please sign in to save progress");
      return;
    }
    
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book: displayBook, chapter: chapterNum }),
      });
      
      if (!res.ok) throw new Error("Failed to save progress");
      
      setUserProgress(prev => ({
        chaptersRead: prev.chaptersRead + 1,
        streak: prev.streak + 1,
      }));
      
      setShowCompletion(true);
      setTimeout(() => {
        setShowReflection(true);
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save progress");
    }
  };

  const handleSaveReflection = async () => {
    try {
      const res = await fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          book: displayBook, 
          chapter: chapterNum,
          content: reflection,
          isPublic: isShared
        }),
      });
      
      if (!res.ok) throw new Error("Failed to save reflection");
      
      toast.success("Reflection saved!");
      setShowReflection(false);
      setShowCompletion(false);
      setReflection("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save reflection");
    }
  };

  const handleVersionChange = (newBibleId: string) => {
    setBibleId(newBibleId);
    setVersionSearch("");
  };

  const filteredVersions = versions.filter((v) => 
    v.name.toLowerCase().includes(versionSearch.toLowerCase()) ||
    v.abbreviation.toLowerCase().includes(versionSearch.toLowerCase())
  );

  const currentVersion = versions.find(v => v.id === bibleId);

  return (
    <div className={cn("min-h-screen transition-colors duration-300", themeClasses[theme])}>
      <AnimatePresence>
        {showCompletion && (
          <Confetti
            width={typeof window !== "undefined" ? window.innerWidth : 800}
            height={typeof window !== "undefined" ? window.innerHeight : 600}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-50 border-b backdrop-blur-xl bg-inherit/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>

            <div className="flex items-center gap-1">
              <span className="font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                {displayBook} {chapter}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
                    <BookOpen className="h-3 w-3" />
                    {currentVersion?.abbreviation || "WEB"}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Select Bible Version</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search translations..."
                        value={versionSearch}
                        onChange={(e) => setVersionSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="space-y-2 max-h-[calc(80vh-180px)] overflow-y-auto">
                      {filteredVersions.length > 0 ? (
                        filteredVersions.map((v) => (
                          <Button
                            key={v.id}
                            variant={bibleId === v.id ? "default" : "ghost"}
                            className="w-full justify-start text-left"
                            onClick={() => handleVersionChange(v.id)}
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-semibold">{v.abbreviation}</span>
                              <span className="text-xs text-muted-foreground">{v.name}</span>
                            </div>
                          </Button>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          No versions found
                        </p>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark
                  className={cn("h-4 w-4", isBookmarked && "fill-current text-secondary")}
                />
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Reading Settings</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Font Size
                      </label>
                      <Slider
                        value={fontSize}
                        onValueChange={setFontSize}
                        min={14}
                        max={28}
                        step={2}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>A</span>
                        <span className="text-lg">A</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Theme</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "light" as Theme, icon: Sun, label: "Light" },
                          { id: "sepia" as Theme, icon: BookOpen, label: "Sepia" },
                          { id: "dark" as Theme, icon: Moon, label: "Dark" },
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={cn(
                              "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all",
                              theme === t.id
                                ? "border-primary bg-primary/10"
                                : "border-muted hover:border-primary/50"
                            )}
                          >
                            <t.icon className="h-5 w-5" />
                            <span className="text-xs">{t.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 sm:px-8 py-8 sm:py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Loading Scripture...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <p className="text-sm text-muted-foreground mb-2">{content?.reference || `${displayBook} ${chapter}`}</p>
              <h1
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {displayBook} {chapter}
              </h1>
              <p className="text-sm text-muted-foreground">~8 min read</p>
            </div>

            <div
              className="scripture-text leading-relaxed space-y-4"
              style={{ fontSize: `${fontSize[0]}px` }}
              dangerouslySetInnerHTML={{ __html: content?.content || "" }}
            />

            <div className="pt-8 border-t">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Ready to finish?</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleComplete} className="btn-primary">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Mark as Read & Reflect
                  </Button>
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Chapter
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="sticky bottom-0 border-t backdrop-blur-xl bg-inherit/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            {navigation.prev ? (
              <Link href={`/read/${encodeURIComponent(navigation.prev.book.toLowerCase())}/${navigation.prev.chapter}`}>
                <Button variant="ghost" size="sm" className="gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{navigation.prev.book} {navigation.prev.chapter}</span>
                  <span className="sm:hidden">Prev</span>
                </Button>
              </Link>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <div className="h-1 w-32 sm:w-48 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                  style={{ width: "100%" }}
                />
              </div>
              <span className="text-xs text-muted-foreground">100%</span>
            </div>

            {navigation.next ? (
              <Link href={`/read/${encodeURIComponent(navigation.next.book.toLowerCase())}/${navigation.next.chapter}`}>
                <Button variant="ghost" size="sm" className="gap-1">
                  <span className="hidden sm:inline">{navigation.next.book} {navigation.next.chapter}</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </footer>

      <Dialog open={showCompletion && showReflection} onOpenChange={setShowReflection}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle style={{ fontFamily: "var(--font-heading)" }}>
                  Great Job!
                </DialogTitle>
                <DialogDescription>
                  You&apos;ve completed {displayBook} {chapter}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                What stood out to you in this chapter?
              </label>
              <Textarea
                placeholder="Share your thoughts, insights, or prayers..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="min-h-32 scripture-text"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="share"
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <label htmlFor="share" className="text-sm">
                Share with my reading partners
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowReflection(false);
                  setShowCompletion(false);
                }}
              >
                Skip for Now
              </Button>
              <Button className="flex-1 btn-primary" onClick={handleSaveReflection}>
                Save Reflection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {showCompletion && !showReflection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-card p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-4"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Chapter Complete!
              </h2>
              <p className="text-muted-foreground mb-4">
                You&apos;ve read {displayBook} {chapter}
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{userProgress.chaptersRead}</div>
                  <div className="text-muted-foreground">Chapters Read</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{userProgress.streak}</div>
                  <div className="text-muted-foreground">Day Streak!</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
