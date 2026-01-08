"use client";

import { useEffect, useState } from "react";

interface SubscriptionStatus {
  premium: boolean;
  lifetime: boolean;
  tier: string | null;
  status: string | null;
  expiresAt: string | null;
  loading: boolean;
}

export function useSubscription(): SubscriptionStatus {
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
      try {
        const response = await fetch("/api/subscription/check");
        if (response.ok) {
          const data = await response.json();
          setSubscription({
            premium: data.premium || false,
            lifetime: data.lifetime || false,
            tier: data.tier || null,
            status: data.status || null,
            expiresAt: data.expiresAt || null,
            loading: false,
          });
        } else {
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
        console.error("Failed to check subscription:", error);
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
  }, []);

  return subscription;
}
