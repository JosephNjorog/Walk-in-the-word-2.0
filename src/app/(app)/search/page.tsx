"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Search as SearchIcon } from "lucide-react";
import { getChapterId } from "@/lib/bible-utils";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface SearchResult {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export default function SearchPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const handle = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/bible/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [query]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-10 lg:py-8">
      <div className="mb-4 flex items-center gap-2.5">
        <Link href="/read" className="p-1 lg:hidden">
          <ArrowLeft className="h-[22px] w-[22px] text-foreground" />
        </Link>
        <h1 style={{ fontFamily: "var(--font-heading)" }} className="text-xl font-bold text-foreground">
          {t("search.title")}
        </h1>
      </div>

      <div className="relative mb-4">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search verses…"
          className="w-full rounded-[14px] border border-border bg-card py-3.5 pl-11 pr-4 text-sm outline-none"
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && query.trim().length >= 2 && results.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">No verses found for &ldquo;{query}&rdquo;.</p>
      )}

      <div className="flex flex-col gap-2.5">
        {results.map((r) => (
          <Link
            key={`${r.book}-${r.chapter}-${r.verse}`}
            href={`/read/${encodeURIComponent(r.book.toLowerCase())}/${r.chapter}#${getChapterId(r.book, r.chapter)}.${r.verse}`}
            className="rounded-[14px] border border-border bg-card px-4 py-3.5"
          >
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[13.5px] font-bold text-foreground">
                {r.book} {r.chapter}:{r.verse}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                Verse
              </span>
            </div>
            <div className="text-[13.5px] leading-relaxed text-muted-foreground">{r.text}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
