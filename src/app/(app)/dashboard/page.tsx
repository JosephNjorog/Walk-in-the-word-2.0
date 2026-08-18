"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Flame,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Loader2,
  BookMarked,
  Brain,
  FileText,
  Users2,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { BIBLE_BOOKS } from "@/lib/bible-utils";
import { useSubscription } from "@/hooks/use-subscription";
import { useTranslation, type Lang } from "@/lib/i18n/LanguageProvider";

const dailyVerse = {
  text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
  reference: "Proverbs 3:5-6",
};

const TOTAL_CHAPTERS = 1189;

function getNextChapter(progress: { book: string; chapter: number }[]): { book: string; chapter: number } {
  if (progress.length === 0) {
    return { book: "Genesis", chapter: 1 };
  }
  const completedSet = new Set(progress.map((p) => `${p.book}-${p.chapter}`));
  for (const bookInfo of BIBLE_BOOKS) {
    for (let ch = 1; ch <= bookInfo.chapters; ch++) {
      if (!completedSet.has(`${bookInfo.name}-${ch}`)) {
        return { book: bookInfo.name, chapter: ch };
      }
    }
  }
  return { book: "Genesis", chapter: 1 };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

const quickAccess = [
  { href: "/plans", labelKey: "Reading Plans", icon: BookMarked, bg: "hsl(222 89% 94%)", fg: "hsl(222 89% 40%)" },
  { href: "/memory-verses", labelKey: "Memory Verses", icon: Brain, bg: "hsl(258 90% 94%)", fg: "hsl(258 90% 55%)" },
  { href: "/journal", labelKey: "SOAP Journal", icon: FileText, bg: "hsl(142 60% 92%)", fg: "hsl(142 60% 32%)" },
  { href: "/community/forums", labelKey: "Forums", icon: MessageCircle, bg: "hsl(24 90% 92%)", fg: "hsl(24 90% 40%)" },
  { href: "/community/groups", labelKey: "Small Groups", icon: Users2, bg: "hsl(330 80% 94%)", fg: "hsl(330 70% 45%)" },
  { href: "/community/prayer?tab=testimony", labelKey: "Testimonies", icon: Sparkles, bg: "hsl(38 92% 92%)", fg: "hsl(38 92% 38%)" },
];

export default function HomePage() {
  const { data: session } = authClient.useSession();
  const { premium, lifetime } = useSubscription();
  const { t, lang, setLang } = useTranslation();
  const [progress, setProgress] = useState<{ book: string; chapter: number }[]>([]);
  const [reflections, setReflections] = useState<
    { id: string; book: string; chapter: number; content: string; createdAt: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!session) return;
      try {
        const [progressRes, reflectionsRes] = await Promise.all([
          fetch("/api/progress"),
          fetch("/api/reflections"),
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

  if (!session) return null;

  const user = session.user;
  const chaptersReadCount = progress.length;
  const currentStreak = (user as any).currentStreak || 0;
  const nextChapter = getNextChapter(progress);
  const readerHref = `/read/${encodeURIComponent(nextChapter.book.toLowerCase())}/${nextChapter.chapter}`;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t("home.greetingMorning") : hour < 18 ? t("home.greetingAfternoon") : t("home.greetingEvening");

  const userInitials =
    user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="mx-auto max-w-3xl px-5 py-3 lg:max-w-none lg:px-10 lg:py-8">
      {/* Mobile-only greeting header (desktop gets its title from the shared top bar) */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <div>
          <div className="text-[13px] text-muted-foreground">{greeting}</div>
          <div style={{ fontFamily: "var(--font-heading)" }} className="text-[21px] font-bold text-foreground">
            {user.name}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex rounded-full border border-border bg-card p-[3px]">
            {(["en", "sw"] as const).map((code: Lang) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className="rounded-full px-2.5 py-[5px] text-[11px] font-bold"
                style={{
                  background: lang === code ? "hsl(var(--primary))" : "transparent",
                  color: lang === code ? "#fff" : "hsl(var(--muted-foreground))",
                }}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <Avatar className="h-[38px] w-[38px]">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback style={{ background: "hsl(258 90% 66%)", color: "#fff" }}>
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile">{t("nav.profile")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">{t("common.settings")}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <div className="flex flex-1 flex-col gap-4">
          {/* Streak banner / start-streak CTA */}
          {chaptersReadCount === 0 ? (
            <div className="rounded-[20px] border border-border bg-card px-[22px] py-[22px] text-center">
              <div className="mb-1.5 text-[15px] font-bold text-foreground">{t("home.startStreakTitle")}</div>
              <div className="mb-3.5 text-[13px] text-muted-foreground">{t("home.startStreakBody")}</div>
              <Link
                href="/plans"
                className="inline-block rounded-xl bg-primary px-5 py-[11px] text-sm font-bold text-primary-foreground"
              >
                {t("home.browsePlans")}
              </Link>
            </div>
          ) : (
            <Link
              href="/streaks"
              className="flex items-center gap-3.5 rounded-[20px] px-[18px] py-4 text-white"
              style={{ background: "var(--blue-gradient)" }}
            >
              <Flame className="h-[30px] w-[30px] flex-shrink-0" style={{ color: "#F59E0B" }} fill="#F59E0B" />
              <div className="flex-1">
                <div className="text-[18px] font-extrabold">
                  {currentStreak} {t("home.dayStreak")}
                </div>
                <div className="text-[12.5px] opacity-90">
                  {t("home.chaptersOf", { total: TOTAL_CHAPTERS })}
                </div>
              </div>
              <ChevronRight className="h-[18px] w-[18px] flex-shrink-0" />
            </Link>
          )}

          {/* Verse of the day */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-[20px] border border-border bg-card px-5 py-5">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-primary">
                  {t("home.verseOfTheDay")}
                </span>
                <button className="text-muted-foreground">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
              <p
                style={{ fontFamily: "var(--font-scripture)" }}
                className="mb-2 text-[18px] italic leading-[1.55] text-foreground"
              >
                &ldquo;{dailyVerse.text}&rdquo;
              </p>
              <p className="text-[13px] font-semibold text-muted-foreground">{dailyVerse.reference}</p>
            </div>
          </motion.div>

          {/* Continue reading */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="rounded-[20px] border border-border bg-card px-5 py-5">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                {t("home.continueReading")}
              </div>
              <div style={{ fontFamily: "var(--font-heading)" }} className="mb-3.5 text-[19px] font-bold text-foreground">
                {nextChapter.book} {nextChapter.chapter}
              </div>
              <Link
                href={readerHref}
                className="inline-block w-full rounded-2xl bg-primary py-[13px] text-center text-[15px] font-bold text-primary-foreground lg:w-auto lg:px-6"
              >
                {t("home.startReading")}
              </Link>
            </div>
          </motion.div>

          {/* Quick access */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {quickAccess.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-2 rounded-[16px] border border-border bg-card px-4 py-5 text-center"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                  style={{ background: item.bg }}
                >
                  <item.icon className="h-5 w-5" style={{ color: item.fg }} />
                </div>
                <span className="text-[13px] font-semibold text-foreground">{item.labelKey}</span>
              </Link>
            ))}
          </div>

          {/* Reflections feed */}
          <div className="mt-1 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 style={{ fontFamily: "var(--font-heading)" }} className="text-lg font-bold text-foreground">
                My Reflections
              </h2>
              <Link href="/reflections" className="flex items-center text-sm text-muted-foreground">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
            ) : reflections.length === 0 ? (
              <div className="rounded-[16px] border border-border bg-card px-6 py-8 text-center">
                <MessageCircle className="mx-auto mb-3 h-9 w-9 text-muted-foreground" />
                <p className="mb-3 text-sm text-muted-foreground">
                  No reflections yet. Start reading and share your thoughts!
                </p>
                <Link href={readerHref} className="text-sm font-bold text-primary">
                  Start Reading
                </Link>
              </div>
            ) : (
              reflections.slice(0, 3).map((reflection, index) => (
                <motion.div
                  key={reflection.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <div className="rounded-[16px] border border-border bg-card p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{user.name}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{formatDate(reflection.createdAt)}</span>
                        </div>
                        <Link
                          href={`/read/${encodeURIComponent(reflection.book.toLowerCase())}/${reflection.chapter}`}
                          className="mb-2 inline-block text-sm text-primary hover:underline"
                        >
                          {reflection.book} {reflection.chapter}
                        </Link>
                        <p className="mb-3 text-sm text-muted-foreground">{reflection.content}</p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Heart className="h-4 w-4" />
                          </button>
                          <button className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <button className="text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Desktop side card */}
        <div className="hidden w-[280px] flex-shrink-0 lg:block">
          <Link
            href="/streaks"
            className="block rounded-[20px] px-5 py-5 text-white"
            style={{ background: "var(--blue-gradient)" }}
          >
            <div className="text-[22px] font-extrabold">
              {currentStreak} {t("home.dayStreak")}
            </div>
            <div className="mt-1 text-xs opacity-90">{t("home.chaptersOf", { total: TOTAL_CHAPTERS })}</div>
          </Link>
          {!premium && !lifetime && (
            <Link
              href="/pricing"
              className="mt-4 block rounded-[16px] border border-border bg-card px-4 py-4 text-center text-sm font-bold text-primary"
            >
              Upgrade for more features
            </Link>
          )}
          {lifetime && (
            <div className="mt-4 rounded-[16px] border border-border bg-card px-4 py-4 text-center text-sm font-bold text-secondary">
              Lifetime Access
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
