"use client";

import { useEffect, useState } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Plus, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";

interface JournalEntry {
  id: string;
  book: string;
  chapter: number;
  verse: number | null;
  scripture: string | null;
  observation: string | null;
  application: string | null;
  prayer: string | null;
  createdAt: string;
}

export default function JournalPage() {
  const { premium, lifetime } = useSubscription();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const [formData, setFormData] = useState({
    book: "",
    chapter: "",
    verse: "",
    scripture: "",
    observation: "",
    application: "",
    prayer: "",
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/journal");
      if (!response.ok) throw new Error("Failed to fetch entries");
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      toast.error("Failed to load journal entries");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.book.trim() || !formData.chapter) {
      toast.error("Book and chapter are required");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          chapter: parseInt(formData.chapter),
          verse: formData.verse ? parseInt(formData.verse) : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create entry");
      
      toast.success("Journal entry saved!");
      setDialogOpen(false);
      setFormData({
        book: "",
        chapter: "",
        verse: "",
        scripture: "",
        observation: "",
        application: "",
        prayer: "",
      });
      fetchEntries();
    } catch (error) {
      toast.error("Failed to save entry");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">SOAP Journal</h1>
            {(premium || lifetime) && (
              <Badge className="bg-primary">Unlimited</Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Scripture • Observation • Application • Prayer
            {!(premium || lifetime) && " • Free tier: Unlimited entries"}
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>New SOAP Journal Entry</DialogTitle>
              <DialogDescription>
                Reflect on Scripture using the SOAP method
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="book">Book *</Label>
                    <Input
                      id="book"
                      placeholder="Genesis"
                      value={formData.book}
                      onChange={(e) => setFormData({ ...formData, book: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chapter">Chapter *</Label>
                    <Input
                      id="chapter"
                      type="number"
                      placeholder="1"
                      value={formData.chapter}
                      onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="verse">Verse</Label>
                    <Input
                      id="verse"
                      type="number"
                      placeholder="1"
                      value={formData.verse}
                      onChange={(e) => setFormData({ ...formData, verse: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scripture">📖 Scripture</Label>
                  <Textarea
                    id="scripture"
                    placeholder="Write or paste the verse(s) you're reflecting on..."
                    value={formData.scripture}
                    onChange={(e) => setFormData({ ...formData, scripture: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observation">👁️ Observation</Label>
                  <Textarea
                    id="observation"
                    placeholder="What do you notice about this passage? What stands out?"
                    value={formData.observation}
                    onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="application">🎯 Application</Label>
                  <Textarea
                    id="application"
                    placeholder="How does this apply to your life? What changes will you make?"
                    value={formData.application}
                    onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prayer">🙏 Prayer</Label>
                  <Textarea
                    id="prayer"
                    placeholder="Turn this passage into a personal prayer..."
                    value={formData.prayer}
                    onChange={(e) => setFormData({ ...formData, prayer: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Saving..." : "Save Entry"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="mb-6 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle className="text-lg">What is SOAP?</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl mb-1">📖</div>
            <h4 className="font-semibold mb-1">Scripture</h4>
            <p className="text-sm text-muted-foreground">Write the verse you're studying</p>
          </div>
          <div>
            <div className="text-2xl mb-1">👁️</div>
            <h4 className="font-semibold mb-1">Observation</h4>
            <p className="text-sm text-muted-foreground">What does it say? What stands out?</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🎯</div>
            <h4 className="font-semibold mb-1">Application</h4>
            <p className="text-sm text-muted-foreground">How does it apply to your life?</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🙏</div>
            <h4 className="font-semibold mb-1">Prayer</h4>
            <p className="text-sm text-muted-foreground">Turn it into a prayer response</p>
          </div>
        </CardContent>
      </Card>

      {/* Entries */}
      {entries.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Journal Entries Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your spiritual journey with SOAP journaling!
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Entry
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card 
              key={entry.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedEntry(entry)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {entry.book} {entry.chapter}{entry.verse ? `:${entry.verse}` : ""}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(entry.createdAt), "MMMM d, yyyy")}
                      <span className="text-xs">
                        ({formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })})
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {entry.scripture && <Badge variant="outline">S</Badge>}
                    {entry.observation && <Badge variant="outline">O</Badge>}
                    {entry.application && <Badge variant="outline">A</Badge>}
                    {entry.prayer && <Badge variant="outline">P</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {entry.scripture && (
                    <div>
                      <p className="font-medium mb-1">📖 Scripture</p>
                      <p className="text-muted-foreground line-clamp-2 italic">"{entry.scripture}"</p>
                    </div>
                  )}
                  {entry.observation && (
                    <div>
                      <p className="font-medium mb-1">👁️ Observation</p>
                      <p className="text-muted-foreground line-clamp-2">{entry.observation}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Entry Detail Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          {selectedEntry && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {selectedEntry.book} {selectedEntry.chapter}
                  {selectedEntry.verse && `:${selectedEntry.verse}`}
                </DialogTitle>
                <DialogDescription>
                  {format(new Date(selectedEntry.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                </DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="max-h-[70vh] pr-4">
                <div className="space-y-4 py-4">
                  {selectedEntry.scripture && (
                    <div>
                      <h4 className="font-semibold mb-2">📖 Scripture</h4>
                      <p className="text-muted-foreground italic whitespace-pre-wrap">
                        "{selectedEntry.scripture}"
                      </p>
                    </div>
                  )}
                  {selectedEntry.observation && (
                    <div>
                      <h4 className="font-semibold mb-2">👁️ Observation</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {selectedEntry.observation}
                      </p>
                    </div>
                  )}
                  {selectedEntry.application && (
                    <div>
                      <h4 className="font-semibold mb-2">🎯 Application</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {selectedEntry.application}
                      </p>
                    </div>
                  )}
                  {selectedEntry.prayer && (
                    <div>
                      <h4 className="font-semibold mb-2">🙏 Prayer</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {selectedEntry.prayer}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
