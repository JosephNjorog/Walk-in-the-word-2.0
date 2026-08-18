"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Info, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface GroupData {
  id: string;
  name: string;
  privacy: string;
  memberCount: number;
  isMember: boolean;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  userName: string;
  userImage: string | null;
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

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const { data: session } = authClient.useSession();

  const [group, setGroup] = useState<GroupData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [joining, setJoining] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!groupId) return;
    fetchGroup();
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [groupId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchGroup = async () => {
    try {
      const res = await fetch(`/api/groups/${groupId}`);
      if (!res.ok) return;
      const data = await res.json();
      setGroup(data.group);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/groups/${groupId}/messages?limit=100`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    const content = draft;
    setDraft("");
    setSending(true);
    try {
      const res = await fetch(`/api/groups/${groupId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error();
      fetchMessages();
    } catch (err) {
      toast.error("Failed to send message");
      setDraft(content);
    } finally {
      setSending(false);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      const res = await fetch(`/api/groups/${groupId}/join`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      toast.success("Joined group!");
      fetchGroup();
      fetchMessages();
    } catch (err: any) {
      toast.error(err.message || "Failed to join group");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="mb-4 text-sm text-muted-foreground">This group doesn't exist or you don't have access to it.</p>
        <button onClick={() => router.push("/community/groups")} className="text-sm font-bold text-primary">
          Back to Groups
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-60px)] max-w-3xl flex-col lg:h-[calc(100vh-60px)]">
      <div className="flex flex-shrink-0 items-center gap-2.5 border-b border-border px-4 py-3">
        <Link href="/community/groups" className="p-1">
          <ArrowLeft className="h-[22px] w-[22px] text-foreground" />
        </Link>
        <Link href={`/community/groups/${groupId}/info`} className="flex flex-1 items-center gap-2.5 overflow-hidden">
          <div
            className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-xl text-[13px] font-bold text-white"
            style={{ background: colorFor(group.id) }}
          >
            {initialsFor(group.name)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[14.5px] font-bold text-foreground">{group.name}</div>
            <div className="text-[11.5px] text-muted-foreground">{group.memberCount} members</div>
          </div>
        </Link>
        <Link href={`/community/groups/${groupId}/info`} className="flex-shrink-0 p-1 text-muted-foreground">
          <Info className="h-5 w-5" />
        </Link>
      </div>

      {!group.isMember ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-[15px] font-bold text-foreground">Join to participate</p>
          <p className="max-w-xs text-[13px] text-muted-foreground">
            {group.privacy === "public"
              ? "You need to be a member of this group to view and send messages."
              : "This is a private group — ask the leader to invite you."}
          </p>
          {group.privacy === "public" && (
            <button
              onClick={handleJoin}
              disabled={joining}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
            >
              {joining ? "Joining…" : "Join Group"}
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="flex-1 space-y-1 overflow-y-auto bg-[hsl(45,60%,98%)] px-4 py-3.5">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                No messages yet. Be the first to say something!
              </div>
            ) : (
              messages.map((m, i) => {
                const isMine = m.userId === session?.user?.id;
                const showAuthor = !isMine && (i === 0 || messages[i - 1].userId !== m.userId);
                return (
                  <div key={m.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[82%] ${isMine ? "ml-auto" : ""} mb-1.5`}>
                    {showAuthor && <span className="mb-0.5 ml-1 text-[11.5px] font-bold text-primary">{m.userName}</span>}
                    <div
                      className="rounded-2xl px-3.5 py-2.5 text-[14.5px] leading-snug"
                      style={{
                        background: isMine ? "hsl(var(--primary))" : "#fff",
                        color: isMine ? "#fff" : "hsl(var(--foreground))",
                        boxShadow: isMine ? undefined : "0 1px 2px rgba(0,0,0,.05)",
                      }}
                    >
                      {m.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="flex flex-shrink-0 items-center gap-2 border-t border-border bg-card px-3.5 py-2.5">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message"
              disabled={sending}
              className="flex-1 rounded-full bg-muted px-4 py-2.5 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={sending || !draft.trim()}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
