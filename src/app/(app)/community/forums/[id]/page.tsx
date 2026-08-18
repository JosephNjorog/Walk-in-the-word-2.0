"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Send, 
  Pin, 
  Lock, 
  Eye, 
  MessageSquare,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";

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
  userId: string;
  authorName: string;
  authorImage: string;
  authorUsername: string;
  isAuthor: boolean;
  createdAt: string;
  lastActivityAt: string;
}

interface Reply {
  id: string;
  content: string;
  userId: string;
  authorName: string;
  authorImage: string;
  authorUsername: string;
  isAuthor: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;
  
  const [topic, setTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (topicId) {
      fetchTopic();
      fetchReplies();
      // Poll for new replies every 10 seconds
      const interval = setInterval(fetchReplies, 10000);
      return () => clearInterval(interval);
    }
  }, [topicId]);

  const fetchTopic = async () => {
    try {
      const response = await fetch(`/api/forum/topics/${topicId}`);
      if (!response.ok) throw new Error("Failed to fetch topic");
      const data = await response.json();
      setTopic(data.topic);
    } catch (error) {
      toast.error("Failed to load topic");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    try {
      const response = await fetch(`/api/forum/topics/${topicId}/replies`);
      if (!response.ok) return;
      const data = await response.json();
      setReplies(data.replies || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || submitting) return;

    setSubmitting(true);
    const tempReply = replyText;
    setReplyText("");

    try {
      const response = await fetch(`/api/forum/topics/${topicId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: tempReply }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to post reply");
      }
      
      toast.success("Reply posted!");
      fetchReplies();
      fetchTopic(); // Refresh to update reply count
      replyInputRef.current?.focus();
    } catch (error: any) {
      toast.error(error.message || "Failed to post reply");
      setReplyText(tempReply);
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

  if (!topic) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Topic Not Found</h3>
            <p className="text-muted-foreground mb-4">
              This topic doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/community/forums")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forums
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/community/forums")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {topic.isPinned && (
              <Badge variant="default" className="gap-1">
                <Pin className="h-3 w-3" />
                Pinned
              </Badge>
            )}
            {topic.isLocked && (
              <Badge variant="secondary" className="gap-1">
                <Lock className="h-3 w-3" />
                Locked
              </Badge>
            )}
            <Badge variant="outline">{topic.categoryName}</Badge>
          </div>
          <h1 className="text-2xl font-bold">{topic.title}</h1>
        </div>
      </div>

      {/* Stats Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{topic.replyCount} replies</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{topic.viewCount} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Last activity {formatDistanceToNow(new Date(topic.lastActivityAt), { addSuffix: true })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Original Post */}
      <Card className="mb-6">
        <CardHeader className="bg-muted/50">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={topic.authorImage} />
              <AvatarFallback>{topic.authorName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{topic.authorName}</p>
                  <p className="text-xs text-muted-foreground">@{topic.authorUsername}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(topic.createdAt), "MMM d, yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(topic.createdAt), "h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap">{topic.content}</p>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="space-y-4 mb-6">
        <h2 className="text-xl font-semibold">
          {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
        </h2>
        
        {replies.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2" />
              <p>No replies yet. Be the first to respond!</p>
            </div>
          </Card>
        ) : (
          replies.map((reply, index) => (
            <Card key={reply.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={reply.authorImage} />
                    <AvatarFallback>{reply.authorName?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{reply.authorName}</p>
                        <p className="text-xs text-muted-foreground">@{reply.authorUsername}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                        </p>
                        {reply.updatedAt !== reply.createdAt && (
                          <p className="text-xs text-muted-foreground">(edited)</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="prose prose-sm max-w-none dark:prose-invert ml-14">
                  <p className="whitespace-pre-wrap text-sm">{reply.content}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Reply Form */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {topic.isLocked ? "Topic Locked" : "Post a Reply"}
          </h3>
        </CardHeader>
        <CardContent>
          {topic.isLocked ? (
            <div className="text-center py-8 text-muted-foreground">
              <Lock className="h-8 w-8 mx-auto mb-2" />
              <p>This topic has been locked and is no longer accepting replies.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReply} className="space-y-4">
              <Textarea
                ref={replyInputRef}
                placeholder="Share your thoughts..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                disabled={submitting}
                rows={6}
                className="resize-none"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting || !replyText.trim()} className="gap-2">
                  <Send className="h-4 w-4" />
                  {submitting ? "Posting..." : "Post Reply"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
