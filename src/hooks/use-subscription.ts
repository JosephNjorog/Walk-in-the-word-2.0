"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface SubscriptionStatus {
  premium: boolean;
  lifetime: boolean;
  tier: string | null;
  status: string | null;
  expiresAt: string | null;
  loading: boolean;
}

export function useSubscription(): SubscriptionStatus {
  const { data: session, isPending } = authClient.useSession();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    premium: false,
    lifetime: false,
    tier: null,
    status: null,
    expiresAt: null,
    loading: true,
  });

  useEffect(() => {
    async function checkSubscription() {
      // Wait for session to load
      if (isPending) {
        return;
      }

      // If no session, user is not logged in
      if (!session) {
        console.log("[Subscription Hook] No session found");
        setSubscription({
          premium: false,
          lifetime: false,
          tier: null,
          status: null,
          expiresAt: null,
          loading: false,
        });
        return;
      }

      try {
        console.log("[Subscription Hook] Fetching subscription status...");
        const response = await fetch("/api/subscription/check");
        
        if (response.ok) {
          const data = await response.json();
          console.log("[Subscription Hook] Received data:", data);
          
          setSubscription({
            premium: data.premium || false,
            lifetime: data.lifetime || false,
            tier: data.tier || null,
            status: data.status || null,
            expiresAt: data.expiresAt || null,
            loading: false,
          });
        } else {
          console.error("[Subscription Hook] API returned error:", response.status);
          setSubscription({
            premium: false,
            lifetime: false,
            tier: null,
            status: null,
            expiresAt: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error("[Subscription Hook] Failed to check subscription:", error);
        setSubscription({
          premium: false,
          lifetime: false,
          tier: null,
          status: null,
          expiresAt: null,
          loading: false,
        });
      }
    }

    checkSubscription();
  }, [session, isPending]);

  return subscription;
}
