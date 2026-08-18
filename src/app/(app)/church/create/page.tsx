"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const DENOMINATIONS = ["Non-denominational", "Baptist", "Catholic", "Anglican", "Pentecostal", "Methodist", "Presbyterian", "Other"];

export default function RegisterChurchPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [denomination, setDenomination] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/churches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), location, denomination, description }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-60px)] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full" style={{ background: "hsl(142 60% 94%)" }}>
          <Check className="h-8 w-8" style={{ color: "hsl(142 60% 38%)" }} />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-heading)" }} className="mb-1.5 text-xl font-bold text-foreground">
            Submitted for Verification
          </div>
          <p className="max-w-xs text-[13.5px] text-muted-foreground">
            We'll review {name} and notify you within 2-3 business days.
          </p>
        </div>
        <button onClick={() => router.push("/church")} className="mt-2 w-full max-w-xs rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground">
          Back to Church Account
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-60px)] max-w-lg flex-col px-4 py-6 lg:px-0 lg:py-8">
      <div className="mb-2 flex items-center gap-2.5">
        <Link href={step === 0 ? "/church" : "#"} onClick={() => step > 0 && setStep(step - 1)} className="p-1">
          <ArrowLeft className="h-[22px] w-[22px] text-foreground" />
        </Link>
        <h1 style={{ fontFamily: "var(--font-heading)" }} className="text-[19px] font-bold text-foreground">
          Register Your Church
        </h1>
      </div>

      <div className="flex gap-1.5 py-4">
        {[0, 1].map((i) => (
          <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= step ? "hsl(var(--primary))" : "hsl(40 20% 88%)" }} />
        ))}
      </div>

      {step === 0 && (
        <div className="flex flex-1 flex-col gap-4">
          <div>
            <div className="mb-1.5 text-xs font-bold text-muted-foreground">CHURCH NAME</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Grace Chapel Nakuru"
              className="w-full rounded-xl border border-border px-3.5 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <div className="mb-1.5 text-xs font-bold text-muted-foreground">LOCATION</div>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Nakuru, Kenya"
              className="w-full rounded-xl border border-border px-3.5 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <div className="mb-2 text-xs font-bold text-muted-foreground">DENOMINATION</div>
            <div className="flex flex-wrap gap-2">
              {DENOMINATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDenomination(d)}
                  className="rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-foreground"
                  style={{
                    border: `2px solid ${denomination === d ? "hsl(var(--primary))" : "hsl(40 20% 88%)"}`,
                    background: denomination === d ? "hsl(222 89% 96%)" : "transparent",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setStep(1)}
            disabled={!name.trim()}
            className={cn("mt-2 w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground", !name.trim() && "opacity-50")}
          >
            Continue
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-1 flex-col gap-4">
          <div>
            <div className="mb-1.5 text-xs font-bold text-muted-foreground">SHORT DESCRIPTION</div>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell members what your church is about"
              className="w-full rounded-xl border border-border px-3.5 py-3 text-sm outline-none"
            />
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-2.5 text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">Review</div>
            <div className="mb-1 text-sm font-bold text-foreground">{name}</div>
            <div className="text-[12.5px] text-muted-foreground">{location || "No location set"}</div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={cn("mt-2 w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground", submitting && "opacity-50")}
          >
            {submitting ? "Submitting…" : "Submit for Verification"}
          </button>
        </div>
      )}
    </div>
  );
}
