"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HandHeart,
  Plus,
  Loader2,
  ArrowLeft,
  Sparkles,
  Heart,
  CheckCircle2,
  Filter,
  Users,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface Prayer {
  id: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  isAnswered: boolean;
  prayerCount: number;
  createdAt: string;
  userName: string;
  userImage: string | null;
  hasPrayed: boolean;
  isOwner: boolean;
}

const categories = [
  { value: "all", label: "All Prayers" },
  { value: "general", label: "General" },
  { value: "health", label: "Health & Healing" },
  { value: "family", label: "Family" },
  { value: "guidance", label: "Guidance" },
  { value: "gratitude", label: "Gratitude" },
  { value: "provision", label: "Provision" },
  { value: "relationships", label: "Relationships" },
];

export default function PrayerWallPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newPrayer, setNewPrayer] = useState({
    content: "",
    category: "general",
    isAnonymous: false,
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    fetchPrayers();
  }, [session]);

  const fetchPrayers = async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/prayers");
      if (res.ok) {
        const data = await res.json();
        setPrayers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newPrayer.content.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/prayers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrayer),
      });
      if (res.ok) {
        setNewPrayer({ content: "", category: "general", isAnonymous: false });
        setDialogOpen(false);
        fetchPrayers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePray = async (prayerId: string) => {
    try {
      await fetch(`/api/prayers/${prayerId}/pray`, { method: "POST" });
      setPrayers(prayers.map(p => 
        p.id === prayerId 
          ? { ...p, hasPrayed: true, prayerCount: p.prayerCount + 1 }
          : p
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAnswered = async (prayerId: string) => {
    try {
      await fetch(`/api/prayers/${prayerId}/answer`, { method: "POST" });
      setPrayers(prayers.map(p => 
        p.id === prayerId ? { ...p, isAnswered: true } : p
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPrayers = selectedCategory === "all" 
    ? prayers 
    : prayers.filter(p => p.category === selectedCategory);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-background to-background">
      <header className="sticky top-0 z-50 glass border-b">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <HandHeart className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  Prayer Wall
                </span>
              </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Share Prayer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    Share Your Prayer Request
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Textarea
                    placeholder="Share what's on your heart..."
                    value={newPrayer.content}
                    onChange={(e) => setNewPrayer({ ...newPrayer, content: e.target.value })}
                    className="min-h-[120px] resize-none"
                  />
                  <Select
                    value={newPrayer.category}
                    onValueChange={(value) => setNewPrayer({ ...newPrayer, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anonymous"
                      checked={newPrayer.isAnonymous}
                      onCheckedChange={(checked) => 
                        setNewPrayer({ ...newPrayer, isAnonymous: checked as boolean })
                      }
                    />
                    <label htmlFor="anonymous" className="text-sm text-muted-foreground cursor-pointer">
                      Post anonymously
                    </label>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={!newPrayer.content.trim() || isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <HandHeart className="h-4 w-4 mr-2" />
                    )}
                    Submit Prayer Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Lift Each Other Up in Prayer
          </h1>
          <p className="text-muted-foreground">
            Share your prayer requests and pray for others in our community
          </p>
        </motion.div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {prayers.length} prayer requests
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : filteredPrayers.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <HandHeart className="h-16 w-16 mx-auto text-amber-500/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No prayers yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to share a prayer request with the community
              </p>
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Share Prayer Request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredPrayers.map((prayer, index) => (
                <motion.div
                  key={prayer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`border-0 shadow-lg overflow-hidden ${prayer.isAnswered ? 'bg-green-50/50 ring-2 ring-green-200' : ''}`}>
                    {prayer.isAnswered && (
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Prayer Answered! Praise God!
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-amber-100">
                          <AvatarImage src={prayer.userImage || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                            {prayer.userName?.[0] || "A"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{prayer.userName}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{formatDate(prayer.createdAt)}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 capitalize">
                              {prayer.category}
                            </span>
                          </div>
                          <p className="text-foreground/90 mb-4 whitespace-pre-wrap">
                            {prayer.content}
                          </p>
                          <div className="flex items-center gap-4">
                            <Button
                              variant={prayer.hasPrayed ? "secondary" : "outline"}
                              size="sm"
                              onClick={() => !prayer.hasPrayed && handlePray(prayer.id)}
                              disabled={prayer.hasPrayed}
                              className={prayer.hasPrayed ? "bg-amber-100 text-amber-700 hover:bg-amber-100" : ""}
                            >
                              <Heart className={`h-4 w-4 mr-2 ${prayer.hasPrayed ? 'fill-amber-500 text-amber-500' : ''}`} />
                              {prayer.hasPrayed ? "Prayed" : "Pray"}
                              <span className="ml-1 text-xs">({prayer.prayerCount})</span>
                            </Button>
                            {prayer.isOwner && !prayer.isAnswered && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkAnswered(prayer.id)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark Answered
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
