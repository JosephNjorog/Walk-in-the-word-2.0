"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BIBLE_BOOKS } from "@/lib/bible-utils";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function BibleBooksPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-10 lg:py-8">
      <h1
        style={{ fontFamily: "var(--font-heading)" }}
        className="mb-4 text-[22px] font-bold text-foreground"
      >
        {t("nav.bible")}
      </h1>
      <div className="mb-3 text-[13px] font-bold tracking-[0.05em] text-muted-foreground">BOOKS</div>
      <div className="flex flex-col gap-2.5">
        {BIBLE_BOOKS.map((book) => (
          <Link
            key={book.name}
            href={`/read/${encodeURIComponent(book.name.toLowerCase())}/1`}
            className="flex items-center justify-between rounded-[14px] border border-border bg-card px-4 py-3.5"
          >
            <div>
              <div className="text-[15px] font-bold text-foreground">{book.name}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{book.chapters} chapters</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
