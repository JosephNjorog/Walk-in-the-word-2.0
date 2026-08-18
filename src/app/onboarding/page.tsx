"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Bell } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTranslation, type Lang } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const GOALS = [
  { key: "daily_reading", label: "Daily Bible reading" },
  { key: "accountability", label: "An accountability partner" },
  { key: "community", label: "Community & fellowship" },
];

interface ReadingPlan {
  id: number;
  name: string;
  description: string | null;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { lang, setLang, t } = useTranslation();

  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set());
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    } else if (session?.user && (session.user as any).hasOnboarded) {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    fetch("/api/reading-plans")
      .then((r) => r.json())
      .then((data) => setPlans(data.plans || []))
      .catch(console.error);
  }, []);

  const toggleGoal = (key: string) => {
    setSelectedGoals((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const requestNotifications = async () => {
    try {
      if (typeof Notification !== "undefined") {
        const permission = await Notification.requestPermission();
        await fetch("/api/user-preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationsEnabled: permission === "granted" }),
        });
      }
    } catch (err) {
      console.error(err);
    }
    setStep(4);
  };

  const finishOnboarding = async () => {
    setFinishing(true);
    try {
      if (selectedPlanId) {
        await fetch("/api/reading-plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: selectedPlanId }),
        }).catch(() => null);
      }
      await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests: Array.from(selectedGoals) }),
      });
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setFinishing(false);
    }
  };

  if (isPending || !session) return null;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-6">
      <div className="flex gap-1.5 py-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= step ? "hsl(var(--primary))" : "hsl(40 20% 88%)" }} />
        ))}
      </div>

      {step === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
          <div
            className="flex h-[88px] w-[88px] items-center justify-center rounded-[26px]"
            style={{ background: "var(--blue-gradient)", boxShadow: "0 12px 24px -8px rgba(30,64,175,.5)" }}
          >
            <span style={{ fontFamily: "var(--font-heading)" }} className="text-4xl font-extrabold text-white">W</span>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)" }} className="mb-2 text-[28px] font-bold text-foreground">
              Walk in the Word
            </div>
            <p className="max-w-xs text-[15px] leading-relaxed text-muted-foreground">
              Grow in Scripture together — daily reading, real accountability, a community that walks with you.
            </p>
          </div>
          <button onClick={() => setStep(1)} className="mt-2 w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground">
            Get Started
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-1 flex-col gap-5 pt-2">
          <div>
            <div style={{ fontFamily: "var(--font-heading)" }} className="text-2xl font-bold text-foreground">Choose your language</div>
            <div className="mt-1.5 text-sm text-muted-foreground">Chagua lugha yako</div>
          </div>
          <div className="flex flex-col gap-3">
            {(["en", "sw"] as Lang[]).map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className="flex items-center justify-between rounded-2xl px-[18px] py-[18px] text-left"
                style={{ border: `2px solid ${lang === code ? "hsl(var(--primary))" : "hsl(40 20% 88%)"}`, background: lang === code ? "hsl(222 89% 96%)" : "transparent" }}
              >
                <span className="text-[16px] font-semibold text-foreground">{code === "en" ? "English" : "Kiswahili"}</span>
                {lang === code && <Check className="h-5 w-5" style={{ color: "hsl(var(--primary))" }} strokeWidth={2.5} />}
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} className="mt-auto w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground">
            {t("common.continue")}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-1 flex-col gap-5 pt-2">
          <div>
            <div style={{ fontFamily: "var(--font-heading)" }} className="text-2xl font-bold text-foreground">What brings you here?</div>
            <div className="mt-1.5 text-sm text-muted-foreground">Pick what fits — you can add more later.</div>
          </div>
          <div className="flex flex-col gap-3">
            {GOALS.map((g) => {
              const selected = selectedGoals.has(g.key);
              return (
                <button
                  key={g.key}
                  onClick={() => toggleGoal(g.key)}
                  className="flex items-center justify-between rounded-2xl px-4 py-4 text-left"
                  style={{ border: `2px solid ${selected ? "hsl(var(--primary))" : "hsl(40 20% 88%)"}`, background: selected ? "hsl(222 89% 96%)" : "transparent" }}
                >
                  <span className="text-[15px] font-semibold text-foreground">{g.label}</span>
                  {selected && <Check className="h-[18px] w-[18px]" style={{ color: "hsl(var(--primary))" }} strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
          <button onClick={() => setStep(3)} className="mt-auto w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground">
            {t("common.continue")}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
            <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full" style={{ background: "hsl(38 92% 94%)" }}>
              <Bell className="h-9 w-9" style={{ color: "hsl(38 92% 45%)" }} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-heading)" }} className="mb-2 text-[22px] font-bold text-foreground">Stay on track</div>
              <p className="max-w-[270px] text-sm leading-relaxed text-muted-foreground">
                Get a gentle daily reminder and a heads-up before your streak runs out.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <button onClick={requestNotifications} className="w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground">
              Enable Notifications
            </button>
            <button onClick={() => setStep(4)} className="w-full py-3.5 text-sm font-semibold text-muted-foreground">
              Not now
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-1 flex-col gap-4 pt-2">
          <div>
            <div style={{ fontFamily: "var(--font-heading)" }} className="text-2xl font-bold text-foreground">Pick a reading plan</div>
            <div className="mt-1.5 text-sm text-muted-foreground">You can change this anytime.</div>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto">
            {plans.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No plans available yet — you can pick one later.</p>
            ) : (
              plans.map((p) => {
                const selected = selectedPlanId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlanId(p.id)}
                    className="flex flex-col gap-1 rounded-2xl px-4 py-4 text-left"
                    style={{ border: `2px solid ${selected ? "hsl(var(--primary))" : "hsl(40 20% 88%)"}`, background: selected ? "hsl(222 89% 96%)" : "transparent" }}
                  >
                    <span className="text-[15px] font-bold text-foreground">{p.name}</span>
                    {p.description && <span className="text-[13px] text-muted-foreground">{p.description}</span>}
                  </button>
                );
              })
            )}
          </div>
          <button
            onClick={finishOnboarding}
            disabled={finishing}
            className={cn("mt-auto w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground", finishing && "opacity-60")}
          >
            {finishing ? "…" : "Start My Journey"}
          </button>
        </div>
      )}
    </div>
  );
}
