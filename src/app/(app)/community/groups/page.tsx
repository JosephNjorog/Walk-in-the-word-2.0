"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";

interface GroupSummary {
  id: string;
  name: string;
  memberCount: number;
  lastMessage: string | null;
  lastMessageAt: string | null;
}

const AVATAR_COLORS = ["hsl(222 89% 40%)", "hsl(258 90% 66%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)", "hsl(142 60% 42%)"];

function colorFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/groups")
      .then((res) => res.json())
      .then((data) => setGroups(data.groups || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-10 lg:py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 style={{ fontFamily: "var(--font-heading)" }} className="text-[22px] font-bold text-foreground">
          Groups
        </h1>
        <Link
          href="/community/groups/discover"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-primary text-primary-foreground"
          aria-label="Discover groups"
        >
          <Plus className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[20px] border border-border bg-card px-6 py-14 text-center">
          <p className="text-[15px] font-bold text-foreground">No groups yet</p>
          <p className="max-w-xs text-[13px] text-muted-foreground">Join a cell group or fellowship to start chatting.</p>
          <Link
            href="/community/groups/discover"
            className="mt-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Find a Group
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {groups.map((g) => (
            <Link
              key={g.id}
              href={`/community/groups/${g.id}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3.5 py-3"
            >
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white"
                style={{ background: colorFor(g.id) }}
              >
                {initialsFor(g.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[14.5px] font-bold text-foreground">{g.name}</span>
                  {g.lastMessageAt && (
                    <span className="flex-shrink-0 text-[11px] text-muted-foreground">
                      {formatDistanceToNowStrict(new Date(g.lastMessageAt))}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 truncate text-[13px] text-muted-foreground">
                  {g.lastMessage || `${g.memberCount} member${g.memberCount !== 1 ? "s" : ""}`}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
