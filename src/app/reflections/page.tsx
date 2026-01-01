"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  ArrowLeft,
  Search,
  Filter,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Plus,
  Calendar,
  Lock,
  Globe,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function ReflectionsPage() {
  const [reflections, setReflections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [refRes, userRes] = await Promise.all([
        fetch("/api/reflections"),
        fetch("/api/profile")
      ]);
      
      if (refRes.ok) {
        const data = await refRes.json();
        setReflections(data);
      }
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      }
    } catch (error) {
      toast.error("Failed to load reflections");
    } finally {
      setLoading(false);
    }
  };

  const filteredReflections = reflections.filter((r) => {
    const matchesSearch = r.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         `${r.book} ${r.chapter}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === "public") return r.isPublic;
    if (activeTab === "private") return !r.isPublic;
    return true;
  });

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
              My Reflections
            </h1>
            <Link href="/read">
              <Button size="sm" className="btn-primary">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reflections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({reflections.length})</TabsTrigger>
              <TabsTrigger value="public">
                Public ({reflections.filter((r) => r.isPublic).length})
              </TabsTrigger>
              <TabsTrigger value="private">
                Private ({reflections.filter((r) => !r.isPublic).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6 space-y-4">
              {filteredReflections.length > 0 ? filteredReflections.map((reflection, index) => (
                <motion.div
                  key={reflection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-hover border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.image} />
                            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <Link
                              href={`/read/${reflection.book}/${reflection.chapter}`}
                              className="font-semibold text-primary hover:underline"
                            >
                              {reflection.book} {reflection.chapter}
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(reflection.createdAt).toLocaleDateString()}
                              {reflection.isPublic ? (
                                <Globe className="h-3 w-3 ml-2 text-green-500" />
                              ) : (
                                <Lock className="h-3 w-3 ml-2 text-amber-500" />
                              )}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>
                              {reflection.isPublic ? "Make Private" : "Make Public"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="scripture-text text-base leading-relaxed mb-4">
                        {reflection.content}
                      </p>

                      <div className="flex items-center gap-4 pt-4 border-t">
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors">
                          <Heart className="h-4 w-4" />
                          0
                        </button>
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          0
                        </button>
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No reflections found. Start reading to share your insights!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
