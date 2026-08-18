"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ChurchDetail {
  church: { id: string; name: string; memberCount: number };
  isAdmin: boolean;
  announcements: any[];
  sermons: any[];
  members: { id: string; userId: string; name: string; role: string }[];
}

export default function ChurchAdminPage() {
  const [loading, setLoading] = useState(true);
  const [churchId, setChurchId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ChurchDetail | null>(null);

  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementBody, setAnnouncementBody] = useState("");
  const [announcementOpen, setAnnouncementOpen] = useState(false);

  const [sermonTitle, setSermonTitle] = useState("");
  const [sermonOpen, setSermonOpen] = useState(false);

  const [inviteValue, setInviteValue] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);

  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkSent, setBulkSent] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [posting, setPosting] = useState(false);

  const load = async () => {
    const mine = await fetch("/api/churches").then((r) => r.json());
    if (!mine.church) {
      setLoading(false);
      return;
    }
    setChurchId(mine.church.id);
    const full = await fetch(`/api/churches/${mine.church.id}`).then((r) => r.json());
    setDetail(full);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const postAnnouncement = async () => {
    if (!churchId || !announcementTitle.trim() || !announcementBody.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/churches/${churchId}/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: announcementTitle, body: announcementBody }),
      });
      if (!res.ok) throw new Error();
      toast.success("Announcement posted");
      setAnnouncementTitle("");
      setAnnouncementBody("");
      setAnnouncementOpen(false);
      load();
    } catch {
      toast.error("Failed to post announcement");
    } finally {
      setPosting(false);
    }
  };

  const postSermon = async () => {
    if (!churchId || !sermonTitle.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/churches/${churchId}/sermons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: sermonTitle }),
      });
      if (!res.ok) throw new Error();
      toast.success("Sermon added");
      setSermonTitle("");
      setSermonOpen(false);
      load();
    } catch {
      toast.error("Failed to add sermon");
    } finally {
      setPosting(false);
    }
  };

  const sendInvite = async () => {
    if (!churchId || !inviteValue.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/churches/${churchId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIdOrEmail: inviteValue.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      toast.success("Member added");
      setInviteValue("");
      setInviteOpen(false);
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to add member");
    } finally {
      setPosting(false);
    }
  };

  const sendBulkMessage = async () => {
    if (!detail || !bulkMessage.trim()) return;
    setPosting(true);
    try {
      await Promise.all(
        detail.members.map((m) =>
          fetch("/api/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: m.userId, subject: `Message from ${detail.church.name}`, message: bulkMessage }),
          }).catch(() => null)
        )
      );
      setBulkSent(true);
    } catch {
      toast.error("Failed to send bulk message");
    } finally {
      setPosting(false);
    }
  };

  const cycleRole = async (memberId: string) => {
    if (!churchId) return;
    try {
      const res = await fetch(`/api/churches/${churchId}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId }),
      });
      if (!res.ok) throw new Error();
      load();
    } catch {
      toast.error("Failed to update role");
    }
  };

  const removeMember = async (memberId: string) => {
    if (!churchId) return;
    try {
      const res = await fetch(`/api/churches/${churchId}/members?memberId=${memberId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      load();
    } catch {
      toast.error("Failed to remove member");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!churchId || !detail?.isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-sm text-muted-foreground">You don't manage a church.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-10 lg:py-8">
      <div className="mb-4 flex items-center gap-2.5 lg:hidden">
        <Link href="/church" className="p-1">
          <ArrowLeft className="h-[22px] w-[22px] text-foreground" />
        </Link>
        <h1 style={{ fontFamily: "var(--font-heading)" }} className="text-xl font-bold text-foreground">
          Manage Church
        </h1>
      </div>

      <div className="mb-5 flex gap-2.5">
        <div className="flex-1 rounded-2xl border border-border bg-card p-3.5 text-center">
          <div className="text-lg font-extrabold text-foreground">{detail.members.length}</div>
          <div className="text-[10.5px] text-muted-foreground">Congregants</div>
        </div>
        <div className="flex-1 rounded-2xl border border-border bg-card p-3.5 text-center">
          <div className="text-lg font-extrabold text-foreground">{detail.sermons.length}</div>
          <div className="text-[10.5px] text-muted-foreground">Sermons</div>
        </div>
        <div className="flex-1 rounded-2xl border border-border bg-card p-3.5 text-center">
          <div className="text-lg font-extrabold text-foreground">{detail.announcements.length}</div>
          <div className="text-[10.5px] text-muted-foreground">Announcements</div>
        </div>
      </div>

      <div className="mb-2.5 text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">Quick Actions</div>
      <div className="mb-6 grid grid-cols-2 gap-2.5">
        <Sheet open={announcementOpen} onOpenChange={setAnnouncementOpen}>
          <SheetTrigger asChild>
            <button className="rounded-2xl border border-border bg-card p-3.5 text-left text-[13px] font-bold text-foreground">New Announcement</button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader><SheetTitle>New Announcement</SheetTitle></SheetHeader>
            <div className="mt-4 space-y-3">
              <Input placeholder="Title" value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} />
              <Textarea placeholder="Announcement details" value={announcementBody} onChange={(e) => setAnnouncementBody(e.target.value)} rows={4} />
              <Button className="w-full" onClick={postAnnouncement} disabled={posting || !announcementTitle.trim() || !announcementBody.trim()}>
                Post Announcement
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet open={sermonOpen} onOpenChange={setSermonOpen}>
          <SheetTrigger asChild>
            <button className="rounded-2xl border border-border bg-card p-3.5 text-left text-[13px] font-bold text-foreground">Upload Sermon</button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader><SheetTitle>Upload Sermon</SheetTitle></SheetHeader>
            <div className="mt-4 space-y-3">
              <Input placeholder="Sermon title" value={sermonTitle} onChange={(e) => setSermonTitle(e.target.value)} />
              <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                Attach audio/video file
              </div>
              <Button className="w-full" onClick={postSermon} disabled={posting || !sermonTitle.trim()}>
                Add Sermon
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet open={inviteOpen} onOpenChange={setInviteOpen}>
          <SheetTrigger asChild>
            <button className="rounded-2xl border border-border bg-card p-3.5 text-left text-[13px] font-bold text-foreground">Invite Members</button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader><SheetTitle>Invite to Church</SheetTitle></SheetHeader>
            <div className="mt-4 flex gap-2">
              <Input placeholder="Email or username" value={inviteValue} onChange={(e) => setInviteValue(e.target.value)} />
              <Button onClick={sendInvite} disabled={posting || !inviteValue.trim()}>Invite</Button>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet open={bulkOpen} onOpenChange={(o) => { setBulkOpen(o); if (!o) setBulkSent(false); }}>
          <SheetTrigger asChild>
            <button className="rounded-2xl border border-border bg-card p-3.5 text-left text-[13px] font-bold text-foreground">Bulk Message</button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader><SheetTitle>Bulk Message</SheetTitle></SheetHeader>
            <div className="mt-4">
              {bulkSent ? (
                <p className="py-4 text-center text-sm font-bold" style={{ color: "hsl(142 60% 38%)" }}>
                  Sent to {detail.members.length} congregants
                </p>
              ) : (
                <div className="space-y-3">
                  <Textarea placeholder="Message to the whole congregation…" value={bulkMessage} onChange={(e) => setBulkMessage(e.target.value)} rows={4} />
                  <Button className="w-full" onClick={sendBulkMessage} disabled={posting || !bulkMessage.trim()}>
                    Send to Congregation
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">Ministry Roles</span>
      </div>
      <div className="flex flex-col gap-2">
        {detail.members.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-xl border border-border bg-card px-3.5 py-2.5">
            <span className="text-[13.5px] font-semibold text-foreground">{m.name}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => cycleRole(m.id)} className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold capitalize text-primary">
                {m.role}
              </button>
              <button onClick={() => removeMember(m.id)} className="text-muted-foreground">
                <X className="h-[15px] w-[15px]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
