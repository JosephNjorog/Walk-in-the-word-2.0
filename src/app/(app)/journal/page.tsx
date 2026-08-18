"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface JournalEntry {
  id: string;
  book: string;
  chapter: number;
  scripture: string | null;
  observation: string | null;
  application: string | null;
  prayer: string | null;
  isPublic: boolean;
  createdAt: string;
}

const FIELDS = [
  { key: "scripture" as const, label: "Scripture", placeholder: "Which verse stood out to you?" },
  { key: "observation" as const, label: "Observation", placeholder: "What is happening in this passage?" },
  { key: "application" as const, label: "Application", placeholder: "How does this apply to your life?" },
  { key: "prayer" as const, label: "Prayer", placeholder: "Turn this into a prayer." },
];

export default function JournalPage() {
  const searchParams = useSearchParams();
  const prefilledBook = searchParams.get("book");
  const prefilledChapter = searchParams.get("chapter");

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const [book, setBook] = useState(prefilledBook || "");
  const [chapter, setChapter] = useState(prefilledChapter || "");
  const [scripture, setScripture] = useState("");
  const [observation, setObservation] = useState("");
  const [application, setApplication] = useState("");
  const [prayer, setPrayer] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const isChapterLocked = !!prefilledBook && !!prefilledChapter;

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/journal");
      if (!response.ok) throw new Error("Failed to fetch entries");
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      toast.error("Failed to load journal entries");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!book.trim() || !chapter || !scripture.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book: book.trim(),
          chapter: parseInt(chapter),
          scripture,
          observation,
          application,
          prayer,
          isPublic,
        }),
      });

      if (!response.ok) throw new Error("Failed to create entry");

      toast.success("Journal entry saved!");
      setScripture("");
      setObservation("");
      setApplication("");
      setPrayer("");
      setIsPublic(false);
      if (!isChapterLocked) {
        setBook("");
        setChapter("");
      }
      fetchEntries();
    } catch (error) {
      toast.error("Failed to save entry");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const values = { scripture, observation, application, prayer };
  const setters = { scripture: setScripture, observation: setObservation, application: setApplication, prayer: setPrayer };
  const canSave = book.trim() && chapter && scripture.trim() && !submitting;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-10 lg:py-8">
      <div className="mb-4 flex items-center gap-2.5">
        <Link href="/read" className="p-1 lg:hidden">
          <ArrowLeft className="h-[22px] w-[22px] text-foreground" />
        </Link>
        <h1 style={{ fontFamily: "var(--font-heading)" }} className="text-xl font-bold text-foreground">
          SOAP Journal
        </h1>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
        {isChapterLocked ? (
          <div className="text-sm font-bold text-foreground">
            {book} {chapter}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Book (e.g. Genesis)" value={book} onChange={(e) => setBook(e.target.value)} />
            <Input placeholder="Chapter" type="number" value={chapter} onChange={(e) => setChapter(e.target.value)} />
          </div>
        )}

        {FIELDS.map((f) => (
          <div key={f.key}>
            <div
              className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.05em]"
              style={{ color: f.key === "scripture" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
            >
              {f.label}
            </div>
            <Textarea
              value={values[f.key]}
              onChange={(e) => setters[f.key](e.target.value)}
              placeholder={f.placeholder}
              className="min-h-[44px] resize-none text-sm"
            />
          </div>
        ))}

        <div className="flex items-center justify-between pt-1">
          <button onClick={() => setIsPublic((p) => !p)} className="flex items-center gap-1.5">
            <span
              className="relative h-[19px] w-[34px] rounded-full transition-colors"
              style={{ background: isPublic ? "hsl(var(--primary))" : "hsl(40 20% 85%)" }}
            >
              <span
                className="absolute top-0.5 h-[15px] w-[15px] rounded-full bg-white transition-all"
                style={{ left: isPublic ? "18px" : "2px" }}
              />
            </span>
            <span className="text-xs font-semibold text-muted-foreground">Share publicly</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSave}
            className={cn(
              "rounded-[10px] bg-primary px-[18px] py-2.5 text-[13.5px] font-bold text-primary-foreground transition-opacity",
              !canSave && "opacity-50"
            )}
          >
            {submitting ? "Saving…" : "Save Entry"}
          </button>
        </div>
      </div>

      {entries.length > 0 && (
        <>
          <div className="mb-2.5 text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">Past Entries</div>
          <div className="flex flex-col gap-2.5">
            {entries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="rounded-[14px] border border-border bg-card px-4 py-3.5 text-left"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[13.5px] font-bold text-foreground">
                    {entry.book} {entry.chapter}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{format(new Date(entry.createdAt), "MMM d")}</span>
                </div>
                {entry.scripture && (
                  <div className="line-clamp-2 text-[13px] text-muted-foreground">{entry.scripture}</div>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          {selectedEntry && (
            <>
              <DialogHeader>
                <DialogTitle style={{ fontFamily: "var(--font-heading)" }}>
                  {selectedEntry.book} {selectedEntry.chapter}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {FIELDS.map((f) =>
                  selectedEntry[f.key] ? (
                    <div key={f.key}>
                      <h4 className="mb-1.5 text-xs font-bold uppercase tracking-[0.05em] text-primary">{f.label}</h4>
                      <p className="whitespace-pre-wrap text-sm text-muted-foreground">{selectedEntry[f.key]}</p>
                    </div>
                  ) : null
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
