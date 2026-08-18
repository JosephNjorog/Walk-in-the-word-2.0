"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNowStrict } from "date-fns";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface PrayerRequest {
  id: string;
  content: string;
  category: string | null;
  isAnonymous: boolean;
  isAnswered: boolean;
  prayerCount: number;
  hasPrayed: boolean;
  createdAt: string;
  userName: string | null;
}

interface Testimony {
  id: string;
  title: string;
  content: string;
  likeCount: number;
  hasLiked: boolean;
  createdAt: string;
  userName: string | null;
}

const AVATAR_COLORS = ["hsl(222 89% 40%)", "hsl(258 90% 66%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)", "hsl(142 60% 42%)"];
function colorFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
function initialsFor(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function PrayerWallPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PrayerWallPageInner />
    </Suspense>
  );
}

function PrayerWallPageInner() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"wall" | "testimony">(searchParams.get("tab") === "testimony" ? "testimony" : "wall");

  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);

  const [prayerDraft, setPrayerDraft] = useState("");
  const [isAnon, setIsAnon] = useState(false);
  const [testimonyDraft, setTestimonyDraft] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchAll = async () => {
    try {
      const [prayerRes, testimonyRes] = await Promise.all([
        fetch("/api/prayer"),
        fetch("/api/testimonies?limit=100"),
      ]);
      if (prayerRes.ok) setRequests((await prayerRes.json()).requests || []);
      if (testimonyRes.ok) setTestimonies((await testimonyRes.json()).testimonies || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const postPrayer = async () => {
    if (!prayerDraft.trim() || posting) return;
    setPosting(true);
    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: prayerDraft.trim(), isAnonymous: isAnon }),
      });
      if (!res.ok) throw new Error();
      setPrayerDraft("");
      setIsAnon(false);
      fetchAll();
    } catch {
      toast.error("Failed to post prayer request");
    } finally {
      setPosting(false);
    }
  };

  const postTestimony = async () => {
    if (!testimonyDraft.trim() || posting) return;
    setPosting(true);
    try {
      const title = testimonyDraft.trim().slice(0, 60);
      const res = await fetch("/api/testimonies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: testimonyDraft.trim() }),
      });
      if (!res.ok) throw new Error();
      setTestimonyDraft("");
      fetchAll();
    } catch {
      toast.error("Failed to post testimony");
    } finally {
      setPosting(false);
    }
  };

  const togglePray = async (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, hasPrayed: !r.hasPrayed, prayerCount: r.prayerCount + (r.hasPrayed ? -1 : 1) } : r))
    );
    try {
      const res = await fetch(`/api/prayer/${id}/pray`, { method: "POST" });
      if (!res.ok) throw new Error();
    } catch {
      fetchAll();
    }
  };

  const toggleLike = async (id: string) => {
    setTestimonies((prev) =>
      prev.map((t) => (t.id === id ? { ...t, hasLiked: !t.hasLiked, likeCount: t.likeCount + (t.hasLiked ? -1 : 1) } : t))
    );
    try {
      const res = await fetch(`/api/testimonies/${id}/like`, { method: "POST" });
      if (!res.ok) throw new Error();
    } catch {
      fetchAll();
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-10 lg:py-8">
      <h1 style={{ fontFamily: "var(--font-heading)" }} className="mb-4 text-[22px] font-bold text-foreground">
        {t("nav.prayer")}
      </h1>

      <div className="mb-4 flex gap-1.5 rounded-xl bg-muted p-1">
        <button
          onClick={() => setTab("wall")}
          className="flex-1 rounded-[9px] py-2.5 text-[13px] font-bold"
          style={{ background: tab === "wall" ? "#fff" : "transparent", color: tab === "wall" ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}
        >
          Prayer Wall
        </button>
        <button
          onClick={() => setTab("testimony")}
          className="flex-1 rounded-[9px] py-2.5 text-[13px] font-bold"
          style={{ background: tab === "testimony" ? "#fff" : "transparent", color: tab === "testimony" ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}
        >
          Testimonies
        </button>
      </div>

      {tab === "wall" ? (
        <>
          <div className="mb-4 rounded-2xl border border-border bg-card p-3.5">
            <input
              value={prayerDraft}
              onChange={(e) => setPrayerDraft(e.target.value)}
              placeholder="Share a prayer request…"
              className="mb-2.5 w-full border-none text-sm outline-none"
            />
            <div className="flex items-center justify-between">
              <button onClick={() => setIsAnon((a) => !a)} className="flex items-center gap-1.5">
                <span className="relative block h-[19px] w-[34px] rounded-full transition-colors" style={{ background: isAnon ? "hsl(var(--primary))" : "hsl(40 20% 85%)" }}>
                  <span className="absolute top-0.5 h-[15px] w-[15px] rounded-full bg-white transition-all" style={{ left: isAnon ? "18px" : "2px" }} />
                </span>
                <span className="text-xs font-semibold text-muted-foreground">Anonymous</span>
              </button>
              <button
                onClick={postPrayer}
                disabled={!prayerDraft.trim() || posting}
                className="rounded-[10px] bg-primary px-4 py-2 text-[12.5px] font-bold text-primary-foreground disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
          ) : requests.length === 0 ? (
            <div className="rounded-[20px] border border-border bg-card px-6 py-12 text-center">
              <p className="text-[15px] font-bold text-foreground">Be the first to pray</p>
              <p className="text-[13px] text-muted-foreground">No prayer requests yet in your circle.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {requests.map((r) => (
                <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ background: r.isAnonymous ? "hsl(var(--muted-foreground))" : colorFor(r.id) }}
                      >
                        {r.isAnonymous ? "?" : initialsFor(r.userName || "U")}
                      </div>
                      <div>
                        <div className="text-[13.5px] font-bold text-foreground">{r.isAnonymous ? "Anonymous" : r.userName}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {r.category || "general"} · {formatDistanceToNowStrict(new Date(r.createdAt))} ago
                        </div>
                      </div>
                    </div>
                    {r.isAnswered && (
                      <span className="rounded-full bg-[hsl(38,92%,94%)] px-2.5 py-1 text-[10.5px] font-bold text-[hsl(38,92%,38%)]">Answered</span>
                    )}
                  </div>
                  <div className="mb-2.5 text-sm leading-relaxed text-foreground">{r.content}</div>
                  <button onClick={() => togglePray(r.id)} className="flex items-center gap-1.5">
                    <Heart className="h-4 w-4" fill={r.hasPrayed ? "hsl(0 70% 55%)" : "none"} stroke={r.hasPrayed ? "hsl(0 70% 55%)" : "hsl(var(--muted-foreground))"} strokeWidth={1.6} />
                    <span className="text-[12.5px] font-semibold text-muted-foreground">{r.prayerCount}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-4 rounded-2xl border border-border bg-card p-3.5">
            <input
              value={testimonyDraft}
              onChange={(e) => setTestimonyDraft(e.target.value)}
              placeholder="Share how God has worked in your life…"
              className="mb-2.5 w-full border-none text-sm outline-none"
            />
            <div className="flex justify-end">
              <button
                onClick={postTestimony}
                disabled={!testimonyDraft.trim() || posting}
                className="rounded-[10px] bg-primary px-4 py-2 text-[12.5px] font-bold text-primary-foreground disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
          ) : testimonies.length === 0 ? (
            <div className="rounded-[20px] border border-border bg-card px-6 py-12 text-center">
              <p className="text-[15px] font-bold text-foreground">No testimonies yet</p>
              <p className="text-[13px] text-muted-foreground">Be the first to share your story.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {testimonies.map((t) => (
                <div key={t.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: colorFor(t.id) }}>
                      {initialsFor(t.userName || "U")}
                    </div>
                    <div>
                      <div className="text-[13.5px] font-bold text-foreground">{t.userName}</div>
                      <div className="text-[11px] text-muted-foreground">{formatDistanceToNowStrict(new Date(t.createdAt))} ago</div>
                    </div>
                  </div>
                  <div className="mb-2.5 text-sm leading-relaxed text-foreground">{t.content}</div>
                  <div className="flex gap-4">
                    <button onClick={() => toggleLike(t.id)} className="flex items-center gap-1.5">
                      <Heart className="h-4 w-4" fill={t.hasLiked ? "hsl(0 70% 55%)" : "none"} stroke={t.hasLiked ? "hsl(0 70% 55%)" : "hsl(var(--muted-foreground))"} strokeWidth={1.6} />
                      <span className="text-[12.5px] font-semibold text-muted-foreground">{t.likeCount}</span>
                    </button>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
