"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Church, Loader2, Pin } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface ChurchDetail {
  church: { id: string; name: string; location: string | null; denomination: string | null; isVerified: boolean; memberCount: number };
  isAdmin: boolean;
  announcements: { id: string; title: string; body: string; isPinned: boolean; createdAt: string }[];
  sermons: { id: string; title: string; description: string | null; pastorName: string | null; createdAt: string }[];
  members: { id: string; name: string; role: string }[];
}

export default function ChurchAccountPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [hasChurch, setHasChurch] = useState(false);
  const [detail, setDetail] = useState<ChurchDetail | null>(null);
  const [tab, setTab] = useState<"announcements" | "sermons" | "ministry">("announcements");

  useEffect(() => {
    fetch("/api/churches")
      .then((r) => r.json())
      .then((data) => {
        if (data.church) {
          setHasChurch(true);
          return fetch(`/api/churches/${data.church.id}`)
            .then((r) => r.json())
            .then(setDetail);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasChurch || !detail) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 lg:px-10 lg:py-8">
        <h1 style={{ fontFamily: "var(--font-heading)" }} className="mb-4 text-[22px] font-bold text-foreground">
          {t("nav.church")}
        </h1>
        <div className="flex flex-col items-center gap-3 rounded-[20px] border border-border bg-card px-6 py-14 text-center">
          <Church className="h-9 w-9 text-primary" />
          <p className="text-[15px] font-bold text-foreground">You're not part of a church yet</p>
          <p className="max-w-xs text-[13px] text-muted-foreground">
            Ask your church admin to add you, or register your own church to get started.
          </p>
          <Link href="/church/create" className="mt-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
            Register Your Church
          </Link>
        </div>
      </div>
    );
  }

  const { church } = detail;

  return (
    <div>
      <div className="relative h-[110px]" style={{ background: "var(--blue-gradient)" }}>
        <Link href="/profile" className="absolute left-4 top-3.5 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/25 lg:hidden">
          <ArrowLeft className="h-[18px] w-[18px] text-white" />
        </Link>
        {detail.isAdmin && (
          <Link href="/church/admin" className="absolute right-4 top-3.5 rounded-xl bg-white/25 px-3.5 py-2 text-[12.5px] font-bold text-white">
            Manage
          </Link>
        )}
      </div>

      <div className="mx-auto max-w-3xl px-5 lg:px-10">
        <div className="-mt-9 flex h-[72px] w-[72px] items-center justify-center rounded-[20px] border-4 border-background bg-card shadow">
          <Church className="h-[34px] w-[34px] text-primary" />
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <span style={{ fontFamily: "var(--font-heading)" }} className="text-[19px] font-bold text-foreground">
            {church.name}
          </span>
          {church.isVerified && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="hsl(var(--primary))">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )}
        </div>
        <div className="mb-4 text-[12.5px] text-muted-foreground">
          {church.memberCount} congregants{church.location ? ` · ${church.location}` : ""}
        </div>

        <div className="mb-4 flex gap-4 border-b border-border">
          {(["announcements", "sermons", "ministry"] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className="pb-2.5 text-[13px] font-bold capitalize"
              style={{
                color: tab === tabKey ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                borderBottom: tab === tabKey ? "2px solid hsl(var(--primary))" : "2px solid transparent",
              }}
            >
              {tabKey}
            </button>
          ))}
        </div>

        {tab === "announcements" && (
          <div className="flex flex-col gap-3 pb-8">
            {detail.announcements.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No announcements yet.</p>
            ) : (
              detail.announcements.map((a) => (
                <div key={a.id} className="rounded-[14px] border border-border bg-card p-3.5">
                  {a.isPinned && (
                    <div className="mb-1.5 flex items-center gap-1.5 text-[hsl(38,92%,42%)]">
                      <Pin className="h-3 w-3" />
                      <span className="text-xs font-bold">PINNED</span>
                    </div>
                  )}
                  <div className="mb-1 text-sm font-bold text-foreground">{a.title}</div>
                  <div className="text-[13px] leading-relaxed text-muted-foreground">{a.body}</div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "sermons" && (
          <div className="flex flex-col gap-2.5 pb-8">
            {detail.sermons.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No sermons posted yet.</p>
            ) : (
              detail.sermons.map((s) => (
                <div key={s.id} className="flex items-center gap-3 rounded-[14px] border border-border bg-card p-3.5">
                  <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full bg-primary">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M7 4l13 8-13 8V4Z" /></svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-bold text-foreground">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{s.pastorName}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "ministry" && (
          <div className="flex flex-col gap-2 pb-8">
            {detail.members.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-xl border border-border bg-card px-3.5 py-2.5">
                <span className="text-[13.5px] font-semibold text-foreground">{m.name}</span>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold capitalize text-primary">{m.role}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
