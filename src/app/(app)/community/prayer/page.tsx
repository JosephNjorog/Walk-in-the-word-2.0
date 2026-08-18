"use client";

import { Heart } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function PrayerWallPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-10 lg:py-8">
      <h1
        style={{ fontFamily: "var(--font-heading)" }}
        className="mb-4 text-[22px] font-bold text-foreground"
      >
        {t("nav.prayer")}
      </h1>
      <div className="flex flex-col items-center gap-3 rounded-[20px] border border-border bg-card px-6 py-12 text-center">
        <Heart className="h-9 w-9" style={{ color: "hsl(258 90% 66%)" }} />
        <p className="text-[15px] font-bold text-foreground">{t("common.comingSoon")}</p>
        <p className="max-w-xs text-[13px] text-muted-foreground">
          Share prayer requests and testimonies with your community — this space is being built next.
        </p>
      </div>
    </div>
  );
}
