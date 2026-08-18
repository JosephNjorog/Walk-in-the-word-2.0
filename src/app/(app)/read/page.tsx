"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { BIBLE_BOOKS } from "@/lib/bible-utils";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const TOTAL_CHAPTERS = BIBLE_BOOKS.reduce((sum, b) => sum + b.chapters, 0);

export default function BibleBooksPage() {
  const { t } = useTranslation();
  const { data: session } = authClient.useSession();
  const [readSet, setReadSet] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProgress() {
      if (!session) return;
      try {
        const res = await fetch("/api/progress");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) {
          setReadSet(new Set(data.map((p: { book: string; chapter: number }) => `${p.book}-${p.chapter}`)));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchProgress();
  }, [session]);

  const totalRead = readSet.size;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-10 lg:py-8">
      <div className="mb-3 flex items-center justify-between">
        <h1 style={{ fontFamily: "var(--font-heading)" }} className="text-[22px] font-bold text-foreground">
          {t("nav.bible")}
        </h1>
        <Link
          href="/search"
          className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-muted text-foreground"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Link>
      </div>

      <div className="mb-4 rounded-2xl bg-primary px-[18px] py-4 text-white">
        <div className="mb-1 text-xs opacity-85">Reading Progress</div>
        <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${Math.min(100, (totalRead / TOTAL_CHAPTERS) * 100)}%` }}
          />
        </div>
        <div className="text-xs opacity-85">
          {totalRead} of {TOTAL_CHAPTERS} chapters read
        </div>
      </div>

      <div className="mb-3 text-[13px] font-bold tracking-[0.05em] text-muted-foreground">BOOKS</div>
      <div className="flex flex-col gap-2.5">
        {BIBLE_BOOKS.map((book) => {
          const chaptersRead = Array.from({ length: book.chapters }, (_, i) => i + 1).filter((c) =>
            readSet.has(`${book.name}-${c}`)
          ).length;
          const isExpanded = expanded === book.name;
          return (
            <div key={book.name}>
              <button
                onClick={() => setExpanded(isExpanded ? null : book.name)}
                className="flex w-full items-center justify-between rounded-[14px] border border-border bg-card px-4 py-3.5 text-left"
              >
                <div>
                  <div className="text-[15px] font-bold text-foreground">{book.name}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {chaptersRead > 0 ? `${chaptersRead} of ${book.chapters} chapters` : `${book.chapters} chapters`}
                  </div>
                </div>
                <ChevronDown
                  className={cn("h-4 w-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")}
                />
              </button>
              {isExpanded && (
                <div className="-mt-1 flex flex-wrap gap-2 rounded-b-[14px] bg-muted p-3">
                  {Array.from({ length: book.chapters }, (_, i) => i + 1).map((c) => {
                    const isRead = readSet.has(`${book.name}-${c}`);
                    return (
                      <Link
                        key={c}
                        href={`/read/${encodeURIComponent(book.name.toLowerCase())}/${c}`}
                        className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] text-[13px] font-bold"
                        style={{
                          background: isRead ? "hsl(var(--primary))" : "#fff",
                          color: isRead ? "#fff" : "hsl(var(--foreground))",
                        }}
                      >
                        {c}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
