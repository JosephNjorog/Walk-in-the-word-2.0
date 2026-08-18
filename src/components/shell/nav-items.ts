import { Home, BookOpen, MessageCircle, Heart, User, Flame } from "lucide-react";

// The 5 tabs shown in the mobile bottom bar (matches the prototype's tab bar exactly).
export const primaryNavItems = [
  { key: "home", href: "/dashboard", labelKey: "nav.home", icon: Home },
  { key: "bible", href: "/read", labelKey: "nav.bible", icon: BookOpen },
  { key: "groups", href: "/community/groups", labelKey: "nav.groups", icon: MessageCircle },
  { key: "prayer", href: "/community/prayer", labelKey: "nav.prayer", icon: Heart },
  { key: "profile", href: "/profile", labelKey: "nav.profile", icon: User },
] as const;

// The desktop sidebar shows one extra item (Streak & Partner) between Prayer and Profile.
export const desktopPrimaryNavItems = [
  primaryNavItems[0],
  primaryNavItems[1],
  primaryNavItems[2],
  primaryNavItems[3],
  { key: "streaks", href: "/streaks", labelKey: "nav.streaks", icon: Flame },
  primaryNavItems[4],
] as const;

export function isNavItemActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Screens with their own full-bleed bottom bar (e.g. the chapter reader's
// prev/next footer) hide the shared tab bar, matching the prototype's
// per-screen `showTabBar` behavior.
const HIDDEN_TAB_BAR_PATTERNS = [/^\/read\/[^/]+\/[^/]+/];

export function shouldShowTabBar(pathname: string) {
  return !HIDDEN_TAB_BAR_PATTERNS.some((pattern) => pattern.test(pathname));
}

// Same screens also render their own sticky header, so the shared desktop
// top bar is hidden there too (avoids two stacked sticky headers).
export function shouldShowTopBar(pathname: string) {
  return !HIDDEN_TAB_BAR_PATTERNS.some((pattern) => pattern.test(pathname));
}
