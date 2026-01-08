"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Plus, Pin, Lock, Eye, Clock, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  topicCount: number;
}

interface Topic {
  id: string;
  title: string;
  content: string;
  categoryId: number;
  categoryName: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  authorName: string;
  authorImage: string;
  authorUsername: string;
  createdAt: string;
  lastActivityAt: string;
}

export default function ForumsPage() {
  const router = useRouter();
  const { premium, lifetime } = useSubscription();
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [weeklyPostCount, setWeeklyPostCount] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchTopics();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/forum/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      toast.error("Failed to load categories");
      console.error(error);
    }
  };

  const fetchTopics = async () => {
    try {
      const url = selectedCategory
        ? `/api/forum/topics?categoryId=${selectedCategory}&limit=50`
        : `/api/forum/topics?limit=50`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch topics");
      const data = await response.json();
      setTopics(data.topics || []);
    } catch (error) {
      toast.error("Failed to load topics");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.categoryId) {
      toast.error("Please fill in all fields");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/forum/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create topic");
      
      const data = await response.json();
      toast.success("Topic created successfully!");
      setCreateDialogOpen(false);
      setFormData({ title: "", content: "", categoryId: "" });
      router.push(`/community/forums/${data.topic.id}`);
    } catch (error) {
      toast.error("Failed to create topic");
      console.error(error);
    } finally {
      setCreating(false);
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Discussion Forums</h1>
            {(premium || lifetime) ? (
              <Badge className="bg-primary">Unlimited Posts</Badge>
            ) : (
              <Badge variant="outline">10 Posts/Week</Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Share insights, ask questions, and discuss Scripture with the community
            {!(premium || lifetime) && " • Free: 10 posts per week"}
          </p>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Topic</DialogTitle>
              <DialogDescription>
                Start a discussion or ask a question
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="What's your topic about?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Share your thoughts, questions, or insights..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTopic} disabled={creating}>
                {creating ? "Creating..." : "Create Topic"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card 
            className={`cursor-pointer transition-colors hover:bg-accent ${!selectedCategory ? 'border-primary' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" />
                All Topics
              </CardTitle>
              <CardDescription>View all discussions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topics.length}</div>
              <div className="text-xs text-muted-foreground">Total Topics</div>
            </CardContent>
          </Card>

          {categories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-colors hover:bg-accent ${selectedCategory === category.id ? 'border-primary' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">{category.icon}</span>
                  {category.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{category.topicCount}</div>
                <div className="text-xs text-muted-foreground">Topics</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Topics List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {selectedCategory
              ? `${categories.find(c => c.id === selectedCategory)?.name} Topics`
              : "Recent Topics"}
          </h2>
          {selectedCategory && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
              Clear Filter
            </Button>
          )}
        </div>

        {topics.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Topics Yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to start a discussion!
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Topic
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="divide-y">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="p-4 hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => router.push(`/community/forums/${topic.id}`)}
                >
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 mt-1">
                      <AvatarImage src={topic.authorImage} />
                      <AvatarFallback>{topic.authorName?.[0] || "U"}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {topic.isPinned && <Pin className="h-4 w-4 text-primary" />}
                          {topic.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                          <h3 className="font-semibold hover:text-primary transition-colors">
                            {topic.title}
                          </h3>
                        </div>
                        <Badge variant="secondary">{topic.categoryName}</Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {topic.content}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{topic.authorName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{topic.replyCount} replies</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{topic.viewCount} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(topic.lastActivityAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
