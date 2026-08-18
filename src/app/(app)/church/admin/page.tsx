"use client";

import { ShieldCheck } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function ChurchAdminPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-10 lg:py-8">
      <h1
        style={{ fontFamily: "var(--font-heading)" }}
        className="mb-4 text-[22px] font-bold text-foreground"
      >
        {t("nav.churchAdmin")}
      </h1>
      <div className="flex flex-col items-center gap-3 rounded-[20px] border border-border bg-card px-6 py-12 text-center">
        <ShieldCheck className="h-9 w-9 text-primary" />
        <p className="text-[15px] font-bold text-foreground">{t("common.comingSoon")}</p>
        <p className="max-w-xs text-[13px] text-muted-foreground">
          A dashboard for managing your church — congregants, announcements, sermons — is being built next.
        </p>
      </div>
    </div>
  );
}
