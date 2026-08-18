"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { primaryNavItems, isNavItemActive, shouldShowTabBar } from "./nav-items";

export function BottomTabBar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  if (!shouldShowTabBar(pathname)) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-card px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 lg:hidden"
      aria-label="Primary"
    >
      {primaryNavItems.map((item) => {
        const active = isNavItemActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.key}
            href={item.href}
            className="flex flex-col items-center gap-1 px-2 py-1 text-muted-foreground"
            style={active ? { color: "hsl(var(--primary))" } : undefined}
          >
            <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
            <span className="text-[10.5px] font-bold">{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
