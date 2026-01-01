"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Bookmark,
  Loader2,
  ArrowLeft,
  Trash2,
  Search,
  StickyNote,
  Sparkles,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface BookmarkItem {
  id: string;
  book: string;
  chapter: number;
  verse: number | null;
  verseText: string | null;
  note: string | null;
  color: string;
  createdAt: string;
}

const colorOptions = [
  { value: "all", label: "All Colors" },
  { value: "yellow", label: "Yellow", class: "bg-yellow-200" },
  { value: "green", label: "Green", class: "bg-green-200" },
  { value: "blue", label: "Blue", class: "bg-blue-200" },
  { value: "pink", label: "Pink", class: "bg-pink-200" },
  { value: "purple", label: "Purple", class: "bg-purple-200" },
];

const getColorClass = (color: string) => {
  const found = colorOptions.find(c => c.value === color);
  return found?.class || "bg-yellow-200";
};

export default function BookmarksPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState("all");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    fetchBookmarks();
  }, [session]);

  const fetchBookmarks = async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/bookmarks");
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/bookmarks?id=${id}`, { method: "DELETE" });
      setBookmarks(bookmarks.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookmarks = bookmarks.filter(b => {
    const matchesSearch = searchQuery === "" || 
      b.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.verseText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.note?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesColor = selectedColor === "all" || b.color === selectedColor;
    return matchesSearch && matchesColor;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/50 via-background to-background">
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
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <Bookmark className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  My Vault
                </span>
              </div>
            </div>
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
            Your Scripture Vault
          </h1>
          <p className="text-muted-foreground">
            All your saved verses, highlights, and notes in one place
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedColor} onValueChange={setSelectedColor}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map(color => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    {color.class && (
                      <div className={`h-3 w-3 rounded-full ${color.class}`} />
                    )}
                    {color.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredBookmarks.length} saved {filteredBookmarks.length === 1 ? "verse" : "verses"}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Sparkles className="h-16 w-16 mx-auto text-violet-500/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {bookmarks.length === 0 ? "Start Your Collection" : "No matching bookmarks"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {bookmarks.length === 0 
                  ? "Save verses while reading to build your personal Scripture vault"
                  : "Try adjusting your search or filter"}
              </p>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start Reading
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {filteredBookmarks.map((bookmark, index) => (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-lg overflow-hidden group">
                    <div className={`h-1.5 ${getColorClass(bookmark.color)}`} />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Link 
                            href={`/read/${encodeURIComponent(bookmark.book.toLowerCase())}/${bookmark.chapter}`}
                            className="inline-flex items-center gap-2 text-lg font-semibold text-violet-600 hover:text-violet-700 transition-colors mb-2"
                          >
                            <BookOpen className="h-4 w-4" />
                            {bookmark.book} {bookmark.chapter}
                            {bookmark.verse && `:${bookmark.verse}`}
                          </Link>
                          
                          {bookmark.verseText && (
                            <p className="scripture-text text-foreground/90 mb-3 italic">
                              &ldquo;{bookmark.verseText}&rdquo;
                            </p>
                          )}
                          
                          {bookmark.note && (
                            <div className="flex items-start gap-2 bg-muted/50 p-3 rounded-lg">
                              <StickyNote className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground">{bookmark.note}</p>
                            </div>
                          )}
                          
                          <p className="text-xs text-muted-foreground mt-3">
                            Saved on {formatDate(bookmark.createdAt)}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(bookmark.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
