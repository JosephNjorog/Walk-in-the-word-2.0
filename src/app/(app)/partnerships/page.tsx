"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Flame, Loader2, Mail, MessageCircle, UserPlus, Users, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function PartnershipsPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [encourageDialogOpen, setEncourageDialogOpen] = useState(false);
  const [encourageMessage, setEncourageMessage] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [sendingEncouragement, setSendingEncouragement] = useState(false);
  const [nudgingId, setNudgingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/partnerships");
      if (res.ok) setPartners(await res.json());
    } catch {
      toast.error("Failed to load partners");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setSendingInvite(true);
    try {
      const res = await fetch("/api/partnerships/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      if (res.ok) {
        toast.success("Invitation sent successfully!");
        setInviteEmail("");
        setInviteDialogOpen(false);
        fetchPartners();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to send invitation");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSendingInvite(false);
    }
  };

  const handleRequest = async (partnershipId: string, action: "accept" | "reject") => {
    try {
      const res = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnershipId, action }),
      });
      if (res.ok) {
        toast.success(action === "accept" ? "Partner added!" : "Request declined");
        fetchPartners();
      }
    } catch {
      toast.error("Action failed");
    }
  };

  const handleNudge = async (p: any) => {
    setNudgingId(p.id);
    try {
      const res = await fetch("/api/partnerships/nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnershipId: p.id }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Nudged ${p.partner.name}!`);
    } catch {
      toast.error("Failed to send nudge");
    } finally {
      setNudgingId(null);
    }
  };

  const handleEncourage = async () => {
    if (!encourageMessage.trim() || !selectedPartner) return;
    setSendingEncouragement(true);
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedPartner.partner.email || selectedPartner.partner.id,
          subject: "You've received encouragement from your reading partner!",
          message: encourageMessage,
        }),
      });
      if (res.ok) {
        toast.success("Encouragement sent!");
        setEncourageMessage("");
        setEncourageDialogOpen(false);
        setSelectedPartner(null);
      } else {
        toast.error("Failed to send encouragement");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSendingEncouragement(false);
    }
  };

  const activePartners = partners.filter((p) => p.status === "active");
  const pendingRequests = partners.filter((p) => p.status === "pending");

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 lg:px-10 lg:py-8">
      <div className="mb-4 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <Link href="/streaks" className="p-1 lg:hidden">
            <ArrowLeft className="h-[22px] w-[22px] text-foreground" />
          </Link>
          <h1 style={{ fontFamily: "var(--font-heading)" }} className="text-xl font-bold text-foreground">
            Accountability Partners
          </h1>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a Partner</DialogTitle>
              <DialogDescription>Send an email to invite a friend to read with you.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInvite} className="flex gap-2">
              <Input
                type="email"
                placeholder="friend@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={sendingInvite} className="gap-2">
                {sendingInvite ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Send
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={encourageDialogOpen} onOpenChange={setEncourageDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Encouragement</DialogTitle>
              <DialogDescription>Send a word of encouragement to {selectedPartner?.partner.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Keep up the great work! Your dedication is inspiring..."
                value={encourageMessage}
                onChange={(e) => setEncourageMessage(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEncourageDialogOpen(false);
                    setEncourageMessage("");
                    setSelectedPartner(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleEncourage} disabled={!encourageMessage.trim() || sendingEncouragement} className="btn-primary">
                  {sendingEncouragement ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MessageCircle className="h-4 w-4 mr-2" />}
                  Send
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {pendingRequests.length > 0 && (
        <div className="mb-5 flex flex-col gap-2.5">
          <div className="text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">Requests</div>
          {pendingRequests.map((request) => (
            <div key={request.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: "hsl(258 90% 66%)" }}>
                {request.partner.name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-[14.5px] font-bold text-foreground">{request.partner.name}</div>
                <div className="text-[12.5px] text-muted-foreground">Wants to be your reading partner</div>
              </div>
              <button onClick={() => handleRequest(request.id, "accept")} className="rounded-[10px] bg-primary p-2.5 text-primary-foreground">
                <Check className="h-4 w-4" />
              </button>
              <button onClick={() => handleRequest(request.id, "reject")} className="rounded-[10px] border border-border p-2.5 text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {activePartners.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: "hsl(258 90% 66%)" }}>
                {p.partner.name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-[14.5px] font-bold text-foreground">{p.partner.name}</div>
                <div className="flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: "hsl(38 92% 42%)" }}>
                  {(p.partner.currentStreak || 0) >= 1 && <Flame className="h-3 w-3" />}
                  {p.partner.currentStreak || 0}-day streak
                </div>
              </div>
              <button
                onClick={() => handleNudge(p)}
                disabled={nudgingId === p.id}
                className="flex-shrink-0 rounded-[10px] bg-primary px-3.5 py-2.5 text-[12.5px] font-bold text-primary-foreground disabled:opacity-50"
              >
                {nudgingId === p.id ? "…" : "Nudge"}
              </button>
            </div>
            <button
              onClick={() => {
                setSelectedPartner(p);
                setEncourageDialogOpen(true);
              }}
              className="mt-2.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-primary"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Send an encouragement email
            </button>
          </div>
        ))}
      </div>

      {activePartners.length === 0 && pendingRequests.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-[20px] border border-border bg-card px-6 py-14 text-center">
          <Users className="h-9 w-9 text-muted-foreground opacity-40" />
          <p className="text-[15px] font-bold text-foreground">No partners yet</p>
          <p className="max-w-xs text-[13px] text-muted-foreground">
            Reading the Bible is better together. Invite someone to join your journey.
          </p>
        </div>
      )}

      <button
        onClick={() => setInviteDialogOpen(true)}
        className={cn(
          "mt-4 w-full rounded-2xl border-[1.5px] border-dashed border-primary bg-primary/5 py-3.5 text-sm font-bold text-primary"
        )}
      >
        <UserPlus className="mr-1.5 inline h-4 w-4" />
        Add Partner
      </button>
    </div>
  );
}
