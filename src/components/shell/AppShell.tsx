"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { BottomTabBar } from "./BottomTabBar";
import { DesktopSidebar } from "./DesktopSidebar";
import { DesktopTopBar } from "./DesktopTopBar";
import { shouldShowTabBar, shouldShowTopBar } from "./nav-items";

const SUPER_ADMIN_EMAIL = "mwangijoenjoroge@gmail.com";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const showTabBar = shouldShowTabBar(pathname);
  const showTopBar = shouldShowTopBar(pathname);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    } else if (session?.user?.email === SUPER_ADMIN_EMAIL) {
      router.push("/admin");
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const user = session.user;
  const userInitials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar userName={user.name ?? "User"} userInitials={userInitials} />
      <div className="lg:pl-[232px]">
        {showTopBar && (
          <DesktopTopBar userName={user.name ?? "User"} userEmail={user.email ?? ""} userImage={user.image} />
        )}
        <main className={showTabBar ? "pb-[86px] lg:pb-0" : ""}>{children}</main>
      </div>
      <BottomTabBar />
    </div>
  );
}
