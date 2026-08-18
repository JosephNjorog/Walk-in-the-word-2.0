"use client";

import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function StreaksPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-10 lg:py-8">
      <div className="mb-4 flex items-center gap-2.5 lg:hidden">
        <Link href="/dashboard" className="p-1">
          <ArrowLeft className="h-[22px] w-[22px] text-foreground" />
        </Link>
        <h1 style={{ fontFamily: "var(--font-heading)" }} className="text-xl font-bold text-foreground">
          {t("nav.streaks")}
        </h1>
      </div>
      <div className="flex flex-col items-center gap-3 rounded-[20px] border border-border bg-card px-6 py-12 text-center">
        <Flame className="h-9 w-9 text-secondary" />
        <p className="text-[15px] font-bold text-foreground">{t("common.comingSoon")}</p>
        <p className="max-w-xs text-[13px] text-muted-foreground">
          A dedicated streak calendar and accountability-partner view is being built next. In the meantime, see{" "}
          <Link href="/partnerships" className="text-primary underline">
            Accountability Partners
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
