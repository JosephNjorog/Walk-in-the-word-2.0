"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SWATCHES = ["hsl(222 89% 40%)", "hsl(258 90% 66%)", "hsl(38 92% 50%)", "hsl(142 60% 42%)"];
const TYPES = [
  { value: "small_group", label: "Small Group" },
  { value: "bible_study", label: "Bible Study" },
  { value: "prayer_group", label: "Prayer Group" },
  { value: "accountability", label: "Accountability" },
];

export default function CreateGroupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [creating, setCreating] = useState(false);

  const [color, setColor] = useState(SWATCHES[0]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(TYPES[0].value);
  const [privacy, setPrivacy] = useState<"public" | "private">("private");
  const [inviteDraft, setInviteDraft] = useState("");
  const [invites, setInvites] = useState<string[]>([]);

  const initials = name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  const addInvite = () => {
    const email = inviteDraft.trim();
    if (email && !invites.includes(email)) {
      setInvites((prev) => [...prev, email]);
      setInviteDraft("");
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim(), type, privacy, maxMembers: 12 }),
      });
      if (!res.ok) throw new Error("Failed to create group");
      const data = await res.json();
      const groupId = data.group.id;

      for (const email of invites) {
        try {
          await fetch("/api/groups/members", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ groupId, userIdOrEmail: email }),
          });
        } catch {
          // best-effort; surfaced collectively isn't critical for group creation to succeed
        }
      }

      toast.success("Group created!");
      router.push(`/community/groups/${groupId}`);
    } catch (err) {
      toast.error("Failed to create group");
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-60px)] max-w-lg flex-col px-4 py-6 lg:px-0 lg:py-8">
      <div className="mb-2 flex items-center gap-2.5">
        <Link href={step === 0 ? "/community/groups/discover" : "#"} onClick={() => step > 0 && setStep(step - 1)} className="p-1">
          <ArrowLeft className="h-[22px] w-[22px] text-foreground" />
        </Link>
        <h1 style={{ fontFamily: "var(--font-heading)" }} className="text-xl font-bold text-foreground">
          Create Group
        </h1>
      </div>

      <div className="flex gap-1.5 py-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= step ? "hsl(var(--primary))" : "hsl(40 20% 88%)" }} />
        ))}
      </div>

      {step === 0 && (
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex justify-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-extrabold text-white"
              style={{ background: color }}
            >
              {initials}
            </div>
          </div>
          <div className="flex justify-center gap-2.5">
            {SWATCHES.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="h-7 w-7 rounded-full"
                style={{ background: c, border: `2.5px solid ${color === c ? "hsl(var(--foreground))" : "transparent"}` }}
              />
            ))}
          </div>
          <div>
            <div className="mb-1.5 text-xs font-bold text-muted-foreground">GROUP NAME</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Karen Cell Group"
              className="w-full rounded-xl border border-border px-3.5 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <div className="mb-1.5 text-xs font-bold text-muted-foreground">DESCRIPTION</div>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this group about?"
              className="w-full rounded-xl border border-border px-3.5 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <div className="mb-1.5 text-xs font-bold text-muted-foreground">TYPE</div>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className="rounded-full px-3 py-1.5 text-[12.5px] font-semibold"
                  style={{
                    border: `2px solid ${type === t.value ? "hsl(var(--primary))" : "hsl(40 20% 88%)"}`,
                    background: type === t.value ? "hsl(222 89% 96%)" : "transparent",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {t.label}
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
        <div className="flex flex-1 flex-col gap-3">
          <div className="mb-0.5 text-[15px] font-bold text-foreground">Who can join?</div>
          <button
            onClick={() => setPrivacy("public")}
            className="flex flex-col gap-1 rounded-2xl px-4 py-4 text-left"
            style={{ border: `2px solid ${privacy === "public" ? "hsl(var(--primary))" : "hsl(40 20% 88%)"}`, background: privacy === "public" ? "hsl(222 89% 96%)" : "transparent" }}
          >
            <span className="text-[14.5px] font-bold text-foreground">Public</span>
            <span className="text-[12.5px] text-muted-foreground">Anyone can find and join this group</span>
          </button>
          <button
            onClick={() => setPrivacy("private")}
            className="flex flex-col gap-1 rounded-2xl px-4 py-4 text-left"
            style={{ border: `2px solid ${privacy === "private" ? "hsl(var(--primary))" : "hsl(40 20% 88%)"}`, background: privacy === "private" ? "hsl(222 89% 96%)" : "transparent" }}
          >
            <span className="text-[14.5px] font-bold text-foreground">Private</span>
            <span className="text-[12.5px] text-muted-foreground">Only people you invite can join</span>
          </button>
          <button onClick={() => setStep(2)} className="mt-2 w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground">
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-1 flex-col gap-3">
          <div className="mb-0.5 text-[15px] font-bold text-foreground">Invite members</div>
          <div className="flex gap-2">
            <input
              value={inviteDraft}
              onChange={(e) => setInviteDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInvite())}
              placeholder="Email or username"
              className="flex-1 rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none"
            />
            <button onClick={addInvite} className="rounded-xl border border-border px-4 text-sm font-bold text-foreground">
              Add
            </button>
          </div>
          {invites.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {invites.map((email) => (
                <span key={email} className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground">
                  {email}
                  <button onClick={() => setInvites((prev) => prev.filter((e) => e !== email))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">Optional — you can invite people from the group later too.</p>
          <button
            onClick={handleCreate}
            disabled={creating}
            className={cn("mt-2 w-full rounded-2xl bg-primary py-4 text-[16px] font-bold text-primary-foreground", creating && "opacity-50")}
          >
            {creating ? "Creating…" : "Create Group"}
          </button>
        </div>
      )}
    </div>
  );
}
