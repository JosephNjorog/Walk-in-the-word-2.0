"use client";

import { useEffect, useState } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  Plus, 
  Calendar, 
  Trophy, 
  TrendingUp,
  Check,
  X,
  Eye,
  EyeOff,
  BookOpen,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";

interface MemoryVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  masteryLevel: number;
  reviewCount: number;
  correctCount: number;
  lastReviewedAt: string | null;
  nextReviewAt: string;
  createdAt: string;
}

export default function MemoryVersesPage() {
  const { premium, lifetime } = useSubscription();
  const [verses, setVerses] = useState<MemoryVerse[]>([]);
  const [dueVerses, setDueVerses] = useState<MemoryVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [practicing, setPracticing] = useState(false);
  const [currentVerse, setCurrentVerse] = useState<MemoryVerse | null>(null);
  const [userInput, setUserInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    dueToday: 0,
    masteryRate: 0,
    streak: 0,
  });

  const [formData, setFormData] = useState({
    book: "",
    chapter: "",
    verse: "",
    verseText: "",
  });

  useEffect(() => {
    fetchVerses();
    fetchDueVerses();
  }, []);

  const fetchVerses = async () => {
    try {
      const response = await fetch("/api/memory-verses");
      if (!response.ok) throw new Error("Failed to fetch verses");
      const data = await response.json();
      const allVerses = data.verses || [];
      setVerses(allVerses);
      
      // Calculate stats
      const total = allVerses.length;
      const dueCount = allVerses.filter((v: MemoryVerse) => 
        new Date(v.nextReviewAt) <= new Date()
      ).length;
      const masteryRate = total > 0 
        ? Math.round((allVerses.reduce((sum: number, v: MemoryVerse) => sum + v.masteryLevel, 0) / total / 5) * 100)
        : 0;

      setStats({
        total,
        dueToday: dueCount,
        masteryRate,
        streak: 0, // TODO: Calculate streak
      });
    } catch (error) {
      toast.error("Failed to load verses");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDueVerses = async () => {
    try {
      const response = await fetch("/api/memory-verses?dueOnly=true");
      if (!response.ok) throw new Error("Failed to fetch due verses");
      const data = await response.json();
      setDueVerses(data.verses || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddVerse = async () => {
    if (!formData.book || !formData.chapter || !formData.verse || !formData.verseText) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/memory-verses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          chapter: parseInt(formData.chapter),
          verse: parseInt(formData.verse),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      
      toast.success("Verse added to memory system!");
      setAddDialogOpen(false);
      setFormData({ book: "", chapter: "", verse: "", verseText: "" });
      fetchVerses();
      fetchDueVerses();
    } catch (error: any) {
      toast.error(error.message || "Failed to add verse");
      console.error(error);
    }
  };

  const startPractice = () => {
    if (dueVerses.length === 0) {
      toast.info("No verses due for review!");
      return;
    }
    setCurrentVerse(dueVerses[0]);
    setPracticing(true);
    setUserInput("");
    setShowAnswer(false);
  };

  const submitAttempt = async (isCorrect: boolean) => {
    if (!currentVerse) return;

    try {
      const response = await fetch("/api/memory-verses/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verseId: currentVerse.id,
          wasCorrect: isCorrect,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      toast.success(isCorrect ? "Great job! 🎉" : "Keep practicing! 💪");
      
      // Move to next verse or end session
      const nextVerseIndex = dueVerses.findIndex(v => v.id === currentVerse.id) + 1;
      if (nextVerseIndex < dueVerses.length) {
        setCurrentVerse(dueVerses[nextVerseIndex]);
        setUserInput("");
        setShowAnswer(false);
      } else {
        toast.success("Practice session complete! 🎊");
        setPracticing(false);
        setCurrentVerse(null);
        fetchVerses();
        fetchDueVerses();
      }
    } catch (error) {
      toast.error("Failed to submit review");
      console.error(error);
    }
  };

  const getMasteryBadge = (level: number) => {
    if (level === 0) return <Badge variant="secondary">New</Badge>;
    if (level >= 5) return <Badge className="bg-yellow-500">Mastered</Badge>;
    if (level >= 3) return <Badge className="bg-blue-500">Learning</Badge>;
    return <Badge variant="outline">Practicing</Badge>;
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

  if (practicing && currentVerse) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline">
                {dueVerses.findIndex(v => v.id === currentVerse.id) + 1} / {dueVerses.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPracticing(false);
                  setCurrentVerse(null);
                }}
              >
                End Session
              </Button>
            </div>
            <CardTitle className="text-2xl">
              {currentVerse.book} {currentVerse.chapter}:{currentVerse.verse}
            </CardTitle>
            <CardDescription>
              Recite the verse from memory
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-6 rounded-lg">
              {showAnswer ? (
                <p className="text-lg leading-relaxed">{currentVerse.verseText}</p>
              ) : (
                <p className="text-lg text-muted-foreground italic">
                  The verse is hidden. Try to recall it!
                </p>
              )}
            </div>

            {!showAnswer ? (
              <div className="space-y-2">
                <Label>Your Answer</Label>
                <Textarea
                  placeholder="Type the verse as you remember it..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </div>
            ) : (
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  Review count: {currentVerse.reviewCount} | 
                  Mastery level: {currentVerse.masteryLevel}/5 | 
                  Accuracy: {currentVerse.reviewCount > 0 
                    ? Math.round((currentVerse.correctCount / currentVerse.reviewCount) * 100) 
                    : 0}%
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            {!showAnswer ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowAnswer(true)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Show Answer
                </Button>
                <Button
                  onClick={() => {
                    setShowAnswer(true);
                  }}
                  className="flex-1"
                  variant="secondary"
                >
                  Check Answer
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="destructive"
                  onClick={() => submitAttempt(false)}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Incorrect
                </Button>
                <Button
                  onClick={() => submitAttempt(true)}
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Correct
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Memory Verses</h1>
          <p className="text-muted-foreground">
            Master Scripture through spaced repetition
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={startPractice}
            disabled={dueVerses.length === 0}
            className="gap-2"
          >
            <Brain className="h-4 w-4" />
            Practice Now {dueVerses.length > 0 && `(${dueVerses.length})`}
          </Button>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Verse
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Memory Verse</DialogTitle>
                <DialogDescription>
                  Add a new verse to your memory practice
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="book">Book *</Label>
                  <Input
                    id="book"
                    placeholder="e.g., John"
                    value={formData.book}
                    onChange={(e) => setFormData({ ...formData, book: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chapter">Chapter *</Label>
                    <Input
                      id="chapter"
                      type="number"
                      placeholder="3"
                      value={formData.chapter}
                      onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="verse">Verse *</Label>
                    <Input
                      id="verse"
                      type="number"
                      placeholder="16"
                      value={formData.verse}
                      onChange={(e) => setFormData({ ...formData, verse: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verseText">Verse Text *</Label>
                  <Textarea
                    id="verseText"
                    placeholder="Enter the verse text..."
                    value={formData.verseText}
                    onChange={(e) => setFormData({ ...formData, verseText: e.target.value })}
                    rows={5}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddVerse}>
                  Add Verse
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Verses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dueToday}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mastery Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.masteryRate}%</div>
            <Progress value={stats.masteryRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streak} days</div>
          </CardContent>
        </Card>
      </div>

      {/* Verses Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="all">All Verses ({verses.length})</TabsTrigger>
          <TabsTrigger value="due">Due Today ({dueVerses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {verses.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Verses Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start memorizing Scripture with our spaced repetition system!
                </p>
                <Button onClick={() => setAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Verse
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {verses.map((verse) => (
                <Card key={verse.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">
                        {verse.book} {verse.chapter}:{verse.verse}
                      </CardTitle>
                      {getMasteryBadge(verse.masteryLevel)}
                    </div>
                    <CardDescription className="line-clamp-3">
                      {verse.verseText}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Reviews:</span>
                        <span className="font-medium">{verse.reviewCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accuracy:</span>
                        <span className="font-medium">
                          {verse.reviewCount > 0 
                            ? Math.round((verse.correctCount / verse.reviewCount) * 100) 
                            : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mastery:</span>
                        <span className="font-medium">{verse.masteryLevel}/5</span>
                      </div>
                      <Progress value={(verse.masteryLevel / 5) * 100} className="mt-2" />
                      <div className="text-xs mt-2">
                        Next review:{" "}
                        {new Date(verse.nextReviewAt) <= new Date()
                          ? "Now"
                          : formatDistanceToNow(new Date(verse.nextReviewAt), { addSuffix: true })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="due" className="mt-6">
          {dueVerses.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Check className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">
                  You don't have any verses due for review right now. Check back later!
                </p>
              </div>
            </Card>
          ) : (
            <>
              <Alert className="mb-4">
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  You have {dueVerses.length} verse{dueVerses.length !== 1 ? "s" : ""} ready for review. 
                  Consistent practice leads to long-term retention!
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dueVerses.map((verse) => (
                  <Card key={verse.id} className="border-primary">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {verse.book} {verse.chapter}:{verse.verse}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {verse.verseText}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => {
                          setCurrentVerse(verse);
                          setPracticing(true);
                        }}
                      >
                        Review Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
