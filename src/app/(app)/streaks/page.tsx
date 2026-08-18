"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Flame, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { BIBLE_BOOKS } from "@/lib/bible-utils";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { toast } from "sonner";

interface ProgressRow {
  book: string;
  chapter: number;
  readAt: string;
}

interface Partner {
  id: string;
  partner: { id: string; name: string; username: string | null; currentStreak: number | null };
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export default function StreaksPage() {
  const { t } = useTranslation();
  const { data: session } = authClient.useSession();
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [nudging, setNudging] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/progress").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/partnerships").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([progressData, partnersData]) => {
        setProgress(Array.isArray(progressData) ? progressData : []);
        const active = (Array.isArray(partnersData) ? partnersData : []).find((p: any) => p.status === "active");
        setPartner(active || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleNudge = async () => {
    if (!partner) return;
    setNudging(true);
    try {
      const res = await fetch("/api/partnerships/nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnershipId: partner.id }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Nudged ${partner.partner.name}!`);
    } catch {
      toast.error("Failed to send nudge");
    } finally {
      setNudging(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentStreak = (session?.user as any)?.currentStreak || 0;

  const readDates = new Set(progress.map((p) => startOfDay(new Date(p.readAt)).getTime()));
  const today = startOfDay(new Date());
  const weekDots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return { label: DAY_LABELS[d.getDay()], done: readDates.has(d.getTime()) };
  });

  const readSet = new Set(progress.map((p) => `${p.book}-${p.chapter}`));
  const inProgressBook = BIBLE_BOOKS.find((b) => {
    const read = Array.from({ length: b.chapters }, (_, i) => i + 1).filter((c) => readSet.has(`${b.name}-${c}`)).length;
    return read > 0 && read < b.chapters;
  }) || BIBLE_BOOKS.find((b) => !Array.from({ length: b.chapters }, (_, i) => i + 1).some((c) => readSet.has(`${b.name}-${c}`)));
  const inProgressRead = inProgressBook
    ? Array.from({ length: inProgressBook.chapters }, (_, i) => i + 1).filter((c) => readSet.has(`${inProgressBook.name}-${c}`)).length
    : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 lg:px-10 lg:py-8">
      <div className="mb-4 flex items-center gap-2.5 lg:hidden">
        <Link href="/dashboard" className="p-1">
          <ArrowLeft className="h-[22px] w-[22px] text-foreground" />
        </Link>
        <h1 style={{ fontFamily: "var(--font-heading)" }} className="text-xl font-bold text-foreground">
          {t("nav.streaks")}
        </h1>
      </div>

      <div className="mb-4 rounded-[22px] px-6 py-7 text-center text-white" style={{ background: "var(--blue-gradient)" }}>
        <Flame className="mx-auto mb-1.5 h-[46px] w-[46px]" fill="#F59E0B" stroke="#F59E0B" />
        <div style={{ fontFamily: "var(--font-heading)" }} className="text-[38px] font-extrabold">
          {currentStreak}
        </div>
        <div className="text-[13px] opacity-90">day streak</div>
      </div>

      <div className="mb-4 flex justify-between rounded-2xl border border-border bg-card p-4">
        {weekDots.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{ background: d.done ? "hsl(var(--primary))" : "hsl(40 33% 92%)" }}
            >
              {d.done && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-[10.5px] font-semibold text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>

      {partner && (
        <div className="mb-4 rounded-2xl border border-border bg-card p-[18px]">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">
            Accountability Partner
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: "hsl(258 90% 66%)" }}
            >
              {partner.partner.name?.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-[14.5px] font-bold text-foreground">{partner.partner.name}</div>
              <div className="text-[12.5px] font-semibold" style={{ color: "hsl(38 92% 42%)" }}>
                {partner.partner.currentStreak || 0}-day streak
              </div>
            </div>
            <button
              onClick={handleNudge}
              disabled={nudging}
              className="flex-shrink-0 rounded-[10px] bg-primary px-3.5 py-2.5 text-[12.5px] font-bold text-primary-foreground disabled:opacity-50"
            >
              {nudging ? "…" : "Nudge"}
            </button>
          </div>
        </div>
      )}

      {inProgressBook && (
        <div className="rounded-2xl border border-border bg-card p-[18px]">
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">
            Next Milestone
          </div>
          <div className="mb-2 text-sm font-semibold text-foreground">
            Complete {inProgressBook.name} — {inProgressRead} of {inProgressBook.chapters} chapters
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              style={{ width: `${(inProgressRead / inProgressBook.chapters) * 100}%`, background: "hsl(38 92% 50%)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
