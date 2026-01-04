"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Users,
  UserPlus,
  Search,
  MessageCircle,
  Copy,
  QrCode,
  Share2,
  Check,
  X,
  Mail,
  MoreHorizontal,
  Flame,
  BookOpen,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PartnershipsPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [encourageDialogOpen, setEncourageDialogOpen] = useState(false);
  const [encourageMessage, setEncourageMessage] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [sendingEncouragement, setSendingEncouragement] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/partnerships");
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
      }
    } catch (error) {
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
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSendingInvite(false);
    }
  };

  const handleRequest = async (partnershipId: string, action: 'accept' | 'reject') => {
    try {
      const res = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnershipId, action }),
      });

      if (res.ok) {
        toast.success(action === 'accept' ? "Partner added!" : "Request declined");
        fetchPartners();
      }
    } catch (error) {
      toast.error("Action failed");
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
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSendingEncouragement(false);
    }
  };

  const activePartners = partners.filter(p => p.status === 'active');
  const pendingRequests = partners.filter(p => p.status === 'pending');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <h1 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Partnerships
            </h1>
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="btn-primary" id="invite-trigger">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Invite
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite a Partner</DialogTitle>
                  <DialogDescription>
                    Send an email to invite a friend to read with you.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInvite} className="space-y-4">
                  <div className="flex gap-2">
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
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={encourageDialogOpen} onOpenChange={setEncourageDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Encouragement</DialogTitle>
                  <DialogDescription>
                    Send a word of encouragement to {selectedPartner?.partner.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Keep up the great work! Your dedication is inspiring..."
                    value={encourageMessage}
                    onChange={(e) => setEncourageMessage(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                  <div className="flex gap-2 justify-end">
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
                    <Button 
                      onClick={handleEncourage}
                      disabled={!encourageMessage.trim() || sendingEncouragement}
                      className="btn-primary"
                    >
                      {sendingEncouragement ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <MessageCircle className="h-4 w-4 mr-2" />
                      )}
                      Send
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <Tabs defaultValue="partners">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="partners">
              My Partners ({activePartners.length})
            </TabsTrigger>
            <TabsTrigger value="requests">
              Requests ({pendingRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="partners" className="space-y-4">
            {activePartners.length > 0 ? activePartners.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-hover border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={p.partner.image} />
                        <AvatarFallback>{p.partner.name?.[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{p.partner.name}</h3>
                          {p.partner.currentStreak >= 7 && (
                            <span className="flex items-center gap-1 text-xs text-secondary">
                              <Flame className="h-3 w-3" />
                              {p.partner.currentStreak}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          @{p.partner.username || 'user'} • Active {p.partner.lastReadAt ? new Date(p.partner.lastReadAt).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="hidden sm:flex"
                          onClick={() => {
                            setSelectedPartner(p);
                            setEncourageDialogOpen(true);
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Encourage
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="sm:hidden"
                              onClick={() => {
                                setSelectedPartner(p);
                                setEncourageDialogOpen(true);
                              }}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Send Encouragement
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/profile/@${p.partner.username || p.partner.id}`}>View Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleRequest(p.id, 'reject')}>
                              Remove Partner
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <h3 className="font-semibold mb-2">No Partners Yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Reading the Bible is better together. Invite someone to join your journey.
                    </p>
                    <Button onClick={() => setInviteDialogOpen(true)} className="btn-primary">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Invite Your First Partner
                    </Button>
                  </CardContent>
                </Card>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-hover border-0 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={request.partner.image} />
                          <AvatarFallback>{request.partner.name?.[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <h3 className="font-semibold">{request.partner.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Wants to be your reading partner
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button size="sm" className="btn-primary" onClick={() => handleRequest(request.id, 'accept')}>
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRequest(request.id, 'reject')}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                  <h3 className="font-semibold mb-2">No Pending Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    When someone sends you a partnership request, it will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
