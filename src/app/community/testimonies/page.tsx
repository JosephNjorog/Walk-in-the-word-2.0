"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Plus, Sparkles, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Testimony {
  id: string;
  title: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  userId: string;
  userName: string;
  userImage: string;
}

export default function TestimoniesPage() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isAnonymous: false,
  });

  useEffect(() => {
    fetchTestimonies();
  }, []);

  const fetchTestimonies = async () => {
    try {
      const response = await fetch("/api/testimonies?limit=100");
      if (!response.ok) throw new Error("Failed to fetch testimonies");
      const data = await response.json();
      setTestimonies(data.testimonies || []);
    } catch (error) {
      toast.error("Failed to load testimonies");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/testimonies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit testimony");
      
      setSubmitted(true);
      setTimeout(() => {
        setDialogOpen(false);
        setSubmitted(false);
        setFormData({ title: "", content: "", isAnonymous: false });
      }, 2000);
    } catch (error) {
      toast.error("Failed to submit testimony");
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
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-yellow-500" />
            Testimonies
          </h1>
          <p className="text-muted-foreground">
            Share how God has worked in your life and encourage others
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Share Your Story
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <DialogTitle className="text-2xl mb-2">Thank You!</DialogTitle>
                <DialogDescription className="text-base">
                  Your testimony has been submitted for review. It will be published once approved.
                </DialogDescription>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Share Your Testimony</DialogTitle>
                  <DialogDescription>
                    Tell us how God has impacted your life through His Word
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., How Scripture Changed My Life"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Your Story *</Label>
                    <Textarea
                      id="content"
                      placeholder="Share your testimony..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={10}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anonymous"
                      checked={formData.isAnonymous}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, isAnonymous: checked as boolean })
                      }
                    />
                    <Label htmlFor="anonymous" className="cursor-pointer">
                      Post anonymously
                    </Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Testimony"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {testimonies.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Testimonies Yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share how God has worked in your life!
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Share Your Story
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonies.map((testimony) => (
            <Card key={testimony.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3 mb-3">
                  {testimony.isAnonymous ? (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-lg">🙏</span>
                    </div>
                  ) : (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={testimony.userImage} />
                      <AvatarFallback>{testimony.userName?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">
                      {testimony.isAnonymous ? "Anonymous" : testimony.userName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(testimony.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <CardTitle className="text-xl">{testimony.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-6">
                  {testimony.content}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Encourage
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
