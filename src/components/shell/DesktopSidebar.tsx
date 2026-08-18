"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { desktopPrimaryNavItems, isNavItemActive } from "./nav-items";

interface DesktopSidebarProps {
  userName: string;
  userInitials: string;
}

const secondaryNavItems = [
  { key: "church", href: "/church", labelKey: "nav.church" },
  { key: "churchAdmin", href: "/church/admin", labelKey: "nav.churchAdmin" },
] as const;

export function DesktopSidebar({ userName, userInitials }: DesktopSidebarProps) {
  const pathname = usePathname();
  const { t, lang, setLang } = useTranslation();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[232px] flex-col border-r border-border bg-background p-3.5 lg:flex">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 pb-5">
        <div
          className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px] text-white"
          style={{ background: "var(--blue-gradient)" }}
        >
          <span style={{ fontFamily: "var(--font-heading)" }} className="text-lg font-extrabold">
            W
          </span>
        </div>
        <span style={{ fontFamily: "var(--font-heading)" }} className="text-[14.5px] font-bold text-foreground">
          Walk in the Word
        </span>
      </Link>

      <nav className="flex flex-col gap-0.5" aria-label="Primary">
        {desktopPrimaryNavItems.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-[10px] px-2.5 py-2.5 text-left text-[13.5px] font-bold"
              style={{
                background: active ? "hsl(var(--primary))" : "transparent",
                color: active ? "#fff" : "hsl(var(--muted-foreground))",
              }}
            >
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="my-3 h-px bg-border" />

      <nav className="flex flex-col gap-0.5" aria-label="Church">
        {secondaryNavItems.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-[10px] px-2.5 py-2.5 text-left text-[13.5px] font-bold"
              style={{
                background: active ? "hsl(var(--primary))" : "transparent",
                color: active ? "#fff" : "hsl(var(--foreground))",
              }}
            >
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <div className="mb-3 flex rounded-full border border-border bg-card p-[3px]">
        {(["en", "sw"] as const).map((code) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className="flex-1 rounded-full py-1.5 text-[11px] font-bold uppercase"
            style={{
              background: lang === code ? "hsl(var(--primary))" : "transparent",
              color: lang === code ? "#fff" : "hsl(var(--muted-foreground))",
            }}
          >
            {code}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2">
        <div
          className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ background: "hsl(258 90% 66%)" }}
        >
          {userInitials}
        </div>
        <span className="truncate text-[12.5px] font-semibold text-foreground">{userName}</span>
      </div>
    </aside>
  );
}
