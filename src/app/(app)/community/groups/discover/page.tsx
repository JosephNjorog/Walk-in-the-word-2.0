"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, Search } from "lucide-react";
import { toast } from "sonner";

interface DiscoverGroup {
  id: string;
  name: string;
  description: string | null;
  memberCount: number;
  leaderName: string | null;
}

const AVATAR_COLORS = ["hsl(222 89% 40%)", "hsl(258 90% 66%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)", "hsl(142 60% 42%)"];

function colorFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initialsFor(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function DiscoverGroupsPage() {
  const [groups, setGroups] = useState<DiscoverGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [joining, setJoining] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/groups/discover")
      .then((res) => res.json())
      .then((data) => setGroups(data.groups || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = async (id: string) => {
    setJoining(id);
    try {
      const res = await fetch(`/api/groups/${id}/join`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setJoined((prev) => new Set(prev).add(id));
      toast.success("Joined group!");
    } catch (err: any) {
      toast.error(err.message || "Failed to join group");
    } finally {
      setJoining(null);
    }
  };

  const filtered = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(query.toLowerCase()) ||
      g.description?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-10 lg:py-8">
      <div className="mb-4 flex items-center gap-2.5">
        <Link href="/community/groups" className="p-1">
          <ArrowLeft className="h-[22px] w-[22px] text-foreground" />
        </Link>
        <h1 style={{ fontFamily: "var(--font-heading)" }} className="text-xl font-bold text-foreground">
          Discover Groups
        </h1>
      </div>

      <div className="relative mb-3.5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search groups by name or church…"
          className="w-full rounded-[14px] border border-border bg-card py-2.5 pl-11 pr-4 text-sm outline-none"
        />
      </div>

      <Link
        href="/community/groups/create"
        className="mb-4 flex items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-primary bg-primary/5 py-3.5 text-sm font-bold text-primary"
      >
        <Plus className="h-4 w-4" />
        Create a Group
      </Link>

      <div className="mb-2.5 text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">
        Suggested for you
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No public groups to discover right now.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((g) => {
            const isJoined = joined.has(g.id);
            return (
              <div key={g.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3.5">
                <div
                  className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white"
                  style={{ background: colorFor(g.id) }}
                >
                  {initialsFor(g.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14.5px] font-bold text-foreground">{g.name}</div>
                  <div className="mt-0.5 mb-1.5 text-xs text-muted-foreground">
                    {g.memberCount} members{g.description ? ` · ${g.description}` : ""}
                  </div>
                </div>
                <button
                  onClick={() => !isJoined && handleJoin(g.id)}
                  disabled={joining === g.id}
                  className="flex-shrink-0 rounded-[10px] px-3.5 py-2 text-[12.5px] font-bold"
                  style={{
                    background: isJoined ? "hsl(40 33% 94%)" : "hsl(var(--primary))",
                    color: isJoined ? "hsl(var(--muted-foreground))" : "#fff",
                  }}
                >
                  {isJoined ? "Joined" : joining === g.id ? "…" : "Join"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
