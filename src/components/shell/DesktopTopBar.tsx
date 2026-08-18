"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, LogOut, Settings, Award } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const TITLE_MAP: Record<string, string> = {
  "/dashboard": "nav.home",
  "/read": "nav.bible",
  "/community/groups": "nav.groups",
  "/community/prayer": "nav.prayer",
  "/search": "search.title",
  "/streaks": "nav.streaks",
  "/profile": "nav.profile",
  "/church": "nav.church",
  "/church/admin": "nav.churchAdmin",
};

function titleKeyFor(pathname: string) {
  const match = Object.keys(TITLE_MAP)
    .sort((a, b) => b.length - a.length)
    .find((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return match ? TITLE_MAP[match] : null;
}

interface DesktopTopBarProps {
  userName: string;
  userEmail: string;
  userImage?: string | null;
}

export function DesktopTopBar({ userName, userEmail, userImage }: DesktopTopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const titleKey = titleKeyFor(pathname);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-20 hidden h-[60px] flex-shrink-0 items-center justify-between border-b border-border bg-background px-7 lg:flex">
      <span style={{ fontFamily: "var(--font-heading)" }} className="text-lg font-bold text-foreground">
        {titleKey ? t(titleKey) : "Walk in the Word"}
      </span>

      <div className="flex items-center gap-3">
        <button className="relative rounded-full p-2 text-muted-foreground hover:bg-muted" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full px-1.5 py-1 hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userImage || undefined} />
                <AvatarFallback>{userName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="font-medium">{userName}</p>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <Award className="mr-2 h-4 w-4" />
                {t("nav.profile")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                {t("common.settings")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              {t("common.logOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
