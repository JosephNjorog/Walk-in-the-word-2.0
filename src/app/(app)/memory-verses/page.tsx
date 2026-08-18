"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MemoryVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  masteryLevel: number;
  reviewCount: number;
  nextReviewAt: string;
}

function normalize(text: string) {
  return text.trim().toLowerCase().replace(/[.,!?;:]/g, "");
}

export default function MemoryVersesPage() {
  const { premium, lifetime } = useSubscription();
  const [verses, setVerses] = useState<MemoryVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [practicingId, setPracticingId] = useState<string | null>(null);
  const [typeDraft, setTypeDraft] = useState("");
  const [typeResult, setTypeResult] = useState<"correct" | "incorrect" | null>(null);

  const [formData, setFormData] = useState({ book: "", chapter: "", verse: "", verseText: "" });

  useEffect(() => {
    fetchVerses();
  }, []);

  const fetchVerses = async () => {
    try {
      const response = await fetch("/api/memory-verses");
      if (!response.ok) throw new Error("Failed to fetch verses");
      const data = await response.json();
      const allVerses: MemoryVerse[] = data.verses || [];
      allVerses.sort((a, b) => new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime());
      setVerses(allVerses);
    } catch (error) {
      toast.error("Failed to load verses");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVerse = async () => {
    if (!formData.book || !formData.chapter || !formData.verse || !formData.verseText) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!premium && !lifetime && verses.length >= 10) {
      toast.error("Free tier limited to 10 active verses. Upgrade to Premium for unlimited!");
      return;
    }
    try {
      const response = await fetch("/api/memory-verses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          chapter: parseInt(formData.chapter),
          verse: parseInt(formData.verse),
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      toast.success("Verse added to memory system!");
      setAddDialogOpen(false);
      setFormData({ book: "", chapter: "", verse: "", verseText: "" });
      fetchVerses();
    } catch (error: any) {
      toast.error(error.message || "Failed to add verse");
      console.error(error);
    }
  };

  const startPractice = (v: MemoryVerse) => {
    setPracticingId(v.id);
    setTypeDraft("");
    setTypeResult(null);
  };

  const cancelPractice = () => {
    setPracticingId(null);
    setTypeDraft("");
    setTypeResult(null);
  };

  const checkTypeOut = async (v: MemoryVerse) => {
    const isCorrect = normalize(typeDraft) === normalize(v.verseText);
    setTypeResult(isCorrect ? "correct" : "incorrect");

    try {
      const res = await fetch("/api/memory-verses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verseId: v.id, accuracy: isCorrect ? 100 : 40, isCorrect }),
      });
      if (res.ok) {
        const data = await res.json();
        setVerses((prev) => prev.map((p) => (p.id === v.id ? { ...p, ...data.verse } : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const dueCount = verses.filter((v) => new Date(v.nextReviewAt) <= new Date()).length;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-10 lg:py-8">
      <div className="mb-4 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <Link href="/read" className="p-1 lg:hidden">
            <ArrowLeft className="h-[22px] w-[22px] text-foreground" />
          </Link>
          <h1 style={{ fontFamily: "var(--font-heading)" }} className="text-xl font-bold text-foreground">
            Memory Verses
          </h1>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Memory Verse</DialogTitle>
              <DialogDescription>Add a new verse to your memory practice</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="book">Book *</Label>
                <Input id="book" placeholder="e.g., John" value={formData.book} onChange={(e) => setFormData({ ...formData, book: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chapter">Chapter *</Label>
                  <Input id="chapter" type="number" placeholder="3" value={formData.chapter} onChange={(e) => setFormData({ ...formData, chapter: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verse">Verse *</Label>
                  <Input id="verse" type="number" placeholder="16" value={formData.verse} onChange={(e) => setFormData({ ...formData, verse: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="verseText">Verse Text *</Label>
                <Textarea id="verseText" placeholder="Enter the verse text..." value={formData.verseText} onChange={(e) => setFormData({ ...formData, verseText: e.target.value })} rows={5} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddVerse}>Add Verse</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {dueCount > 0 && (
        <div className="mb-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-2.5 text-center text-[13px] font-semibold text-primary">
          {dueCount} verse{dueCount !== 1 ? "s" : ""} ready for review today
        </div>
      )}

      {verses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[20px] border border-border bg-card px-6 py-14 text-center">
          <p className="text-[15px] font-bold text-foreground">No verses yet</p>
          <p className="max-w-xs text-[13px] text-muted-foreground">
            Start memorizing Scripture — add a verse to begin spaced-repetition practice.
          </p>
          <Button onClick={() => setAddDialogOpen(true)} size="sm" className="mt-1 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Your First Verse
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {verses.map((v) => {
            const isFlipped = !!flipped[v.id];
            const isPracticing = practicingId === v.id;
            return (
              <div key={v.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                    {v.book} {v.chapter}:{v.verse}
                  </span>
                  <div className="flex gap-[3px]">
                    {Array.from({ length: 6 }, (_, i) => (
                      <span
                        key={i}
                        className="h-[7px] w-[7px] rounded-full"
                        style={{ background: i < v.masteryLevel ? "hsl(258 90% 66%)" : "hsl(40 20% 88%)" }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setFlipped((prev) => ({ ...prev, [v.id]: !prev[v.id] }))}
                  className="scripture-text w-full rounded-[14px] px-[18px] py-[18px] text-center text-[15.5px] leading-[1.5] text-white"
                  style={{ background: "linear-gradient(135deg,#8B5CF6,#A78BFA)", minHeight: 90 }}
                >
                  {isFlipped ? v.verseText : "Tap to reveal verse"}
                </button>

                {isPracticing ? (
                  <div className="mt-2.5">
                    <Textarea
                      value={typeDraft}
                      onChange={(e) => {
                        setTypeDraft(e.target.value);
                        setTypeResult(null);
                      }}
                      placeholder="Type the verse from memory…"
                      className="min-h-[60px] text-sm"
                    />
                    {typeResult === "correct" && (
                      <div className="mt-1 text-xs font-bold" style={{ color: "hsl(142 60% 32%)" }}>
                        Correct! Well done.
                      </div>
                    )}
                    {typeResult === "incorrect" && (
                      <div className="mt-1 text-xs font-bold text-destructive">Not quite — try again.</div>
                    )}
                    <div className="mt-2 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={cancelPractice}>
                        Cancel
                      </Button>
                      <Button size="sm" className="flex-1 btn-primary" onClick={() => checkTypeOut(v)}>
                        Check
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startPractice(v)}
                    className={cn(
                      "mt-2.5 w-full rounded-[10px] border border-dashed border-primary/50 bg-primary/5 py-2.5 text-xs font-bold text-primary"
                    )}
                  >
                    Type-out Challenge
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
