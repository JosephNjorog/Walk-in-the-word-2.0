"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface GroupData {
  id: string;
  name: string;
  description: string | null;
  memberCount: number;
  maxMembers: number;
  userRole: string | null;
  isMuted: boolean;
}

interface Member {
  id: string;
  userId: string;
  userName: string;
  role: string;
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

export default function GroupInfoPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  const [group, setGroup] = useState<GroupData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteInput, setInviteInput] = useState("");
  const [showInvite, setShowInvite] = useState(false);

  const fetchAll = async () => {
    try {
      const res = await fetch(`/api/groups/${groupId}`);
      if (!res.ok) return;
      const data = await res.json();
      setGroup(data.group);
      setMembers(
        (data.members || []).map((m: any) => ({ id: m.id, userId: m.userId, userName: m.userName, role: m.role }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) fetchAll();
  }, [groupId]);

  const toggleMute = async () => {
    if (!group) return;
    setGroup({ ...group, isMuted: !group.isMuted });
    try {
      const res = await fetch(`/api/groups/${groupId}/mute`, { method: "POST" });
      if (!res.ok) throw new Error();
    } catch {
      toast.error("Failed to update notifications");
      setGroup((g) => (g ? { ...g, isMuted: !g.isMuted } : g));
    }
  };

  const removeMember = async (userId: string) => {
    try {
      const res = await fetch(`/api/groups/members?groupId=${groupId}&userId=${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
      toast.success("Member removed");
    } catch {
      toast.error("Failed to remove member");
    }
  };

  const sendInvite = async () => {
    const value = inviteInput.trim();
    if (!value) return;
    try {
      const res = await fetch("/api/groups/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, userIdOrEmail: value }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      toast.success("Member added");
      setInviteInput("");
      setShowInvite(false);
      fetchAll();
    } catch (err: any) {
      toast.error(err.message || "Failed to add member");
    }
  };

  const handleLeave = async () => {
    try {
      const res = await fetch(`/api/groups?groupId=${groupId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Left group");
      router.push("/community/groups");
    } catch {
      toast.error("Failed to leave group");
    }
  };

  if (loading || !group) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isLeader = group.userRole === "leader";

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 lg:px-10 lg:py-8">
      <div className="mb-2 flex items-center gap-2.5">
        <Link href={`/community/groups/${groupId}`} className="p-1">
          <ArrowLeft className="h-[22px] w-[22px] text-foreground" />
        </Link>
        <h1 style={{ fontFamily: "var(--font-heading)" }} className="text-lg font-bold text-foreground">
          Group Info
        </h1>
      </div>

      <div className="flex flex-col items-center gap-1.5 py-5 text-center">
        <div
          className="mb-1 flex h-[72px] w-[72px] items-center justify-center rounded-2xl text-2xl font-extrabold text-white"
          style={{ background: colorFor(group.id) }}
        >
          {initialsFor(group.name)}
        </div>
        <div style={{ fontFamily: "var(--font-heading)" }} className="text-lg font-bold text-foreground">
          {group.name}
        </div>
        <div className="text-xs text-muted-foreground">{group.memberCount} members</div>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5">
        <span className="text-sm font-semibold text-foreground">Mute notifications</span>
        <button onClick={toggleMute}>
          <span
            className="relative block h-[22px] w-[38px] rounded-full transition-colors"
            style={{ background: group.isMuted ? "hsl(var(--primary))" : "hsl(40 20% 85%)" }}
          >
            <span
              className="absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white transition-all"
              style={{ left: group.isMuted ? "18px" : "2px" }}
            />
          </span>
        </button>
      </div>

      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">Members</span>
        {isLeader && (
          <button onClick={() => setShowInvite((s) => !s)} className="text-[12.5px] font-bold text-primary">
            + Add
          </button>
        )}
      </div>

      {showInvite && (
        <div className="mb-3 flex gap-2">
          <input
            value={inviteInput}
            onChange={(e) => setInviteInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendInvite()}
            placeholder="Email or username"
            className="flex-1 rounded-xl border border-border px-3.5 py-2 text-sm outline-none"
          />
          <button onClick={sendInvite} className="rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">
            Invite
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-2">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3.5 py-2.5">
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: colorFor(m.userId) }}
            >
              {initialsFor(m.userName)}
            </div>
            <span className="flex-1 text-sm font-semibold text-foreground">{m.userName}</span>
            {m.role === "leader" && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10.5px] font-bold text-primary">Admin</span>
            )}
            {isLeader && m.role !== "leader" && (
              <button onClick={() => removeMember(m.userId)} className="text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleLeave}
        className="w-full rounded-2xl border py-3.5 text-sm font-bold"
        style={{ borderColor: "hsl(0 84% 88%)", background: "hsl(0 84% 97%)", color: "hsl(0 84% 55%)" }}
      >
        Leave Group
      </button>
    </div>
  );
}
