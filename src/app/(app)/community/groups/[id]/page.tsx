"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Users, 
  Calendar, 
  Lock, 
  Globe, 
  Send, 
  ArrowLeft, 
  Settings,
  UserPlus,
  LogOut,
  Shield,
  Crown
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface GroupData {
  id: string;
  name: string;
  description: string;
  type: string;
  privacy: string;
  maxMembers: number;
  memberCount: number;
  imageUrl?: string;
  meetingSchedule?: string;
  leaderId: string;
  leaderName: string;
  leaderEmail: string;
  leaderImage: string;
  isMember: boolean;
  userRole: string | null;
  createdAt: string;
}

interface Member {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string;
  role: string;
  joinedAt: string;
}

interface Message {
  id: string;
  content: string;
  type: string;
  createdAt: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string;
}

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  
  const [group, setGroup] = useState<GroupData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (groupId) {
      fetchGroupData();
      fetchMessages();
      // Poll for new messages every 5 seconds
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchGroupData = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`);
      if (!response.ok) throw new Error("Failed to fetch group");
      const data = await response.json();
      setGroup(data.group);
      setMembers(data.members);
    } catch (error) {
      toast.error("Failed to load group");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/messages?limit=100`);
      if (!response.ok) return; // Silently fail if not a member
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      // Silently handle errors for polling
      console.error(error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || sending) return;

    setSending(true);
    const tempMessage = messageText;
    setMessageText("");

    try {
      const response = await fetch(`/api/groups/${groupId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: tempMessage }),
      });

      if (!response.ok) throw new Error("Failed to send message");
      
      // Fetch messages immediately after sending
      fetchMessages();
      messageInputRef.current?.focus();
    } catch (error) {
      toast.error("Failed to send message");
      setMessageText(tempMessage); // Restore message on error
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const response = await fetch(`/api/groups?groupId=${groupId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to leave group");
      
      toast.success("Left group successfully");
      router.push("/community/groups");
    } catch (error) {
      toast.error("Failed to leave group");
      console.error(error);
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

  if (!group) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Group Not Found</h3>
            <p className="text-muted-foreground mb-4">
              This group doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => router.push("/community/groups")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Groups
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/community/groups")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{group.name}</h1>
            {group.privacy === "private" ? (
              <Lock className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Globe className="h-5 w-5 text-muted-foreground" />
            )}
            <Badge>{group.type.replace("_", " ")}</Badge>
          </div>
          <p className="text-muted-foreground">{group.description}</p>
        </div>
        
        {group.isMember && (
          <Button variant="outline" size="icon" onClick={() => setLeaveDialogOpen(true)}>
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-4">
              {!group.isMember ? (
                <Card className="p-12">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Join to Participate</h3>
                    <p className="text-muted-foreground mb-4">
                      You need to be a member of this group to view and send messages.
                    </p>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Request to Join
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="flex flex-col h-[600px]">
                  {/* Messages Area */}
                  <ScrollArea className="flex-1 p-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                          <p>No messages yet.</p>
                          <p className="text-sm">Be the first to say something!</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div key={message.id} className="flex gap-3">
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarImage src={message.userImage} />
                              <AvatarFallback>{message.userName?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-semibold text-sm">{message.userName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-sm wrap-break-word">{message.content}</p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        ref={messageInputRef}
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        disabled={sending}
                        className="flex-1"
                      />
                      <Button type="submit" size="icon" disabled={sending || !messageText.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="about" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Group Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {group.description || "No description provided"}
                    </p>
                  </div>

                  {group.meetingSchedule && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Meeting Schedule</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{group.meetingSchedule}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium mb-1">Group Leader</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={group.leaderImage} />
                        <AvatarFallback>{group.leaderName?.[0] || "L"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{group.leaderName}</p>
                        <p className="text-xs text-muted-foreground">{group.leaderEmail}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Privacy:</span>
                      <p className="font-medium capitalize">{group.privacy}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-medium capitalize">{group.type.replace("_", " ")}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Members:</span>
                      <p className="font-medium">{group.memberCount} / {group.maxMembers}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <p className="font-medium">
                        {formatDistanceToNow(new Date(group.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Members */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Members ({members.length})
              </CardTitle>
              <CardDescription>
                {group.maxMembers - group.memberCount} spots remaining
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.userImage} />
                        <AvatarFallback>{member.userName?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{member.userName}</p>
                          {member.role === "leader" && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                          {member.role === "moderator" && (
                            <Shield className="h-3 w-3 text-blue-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Joined {formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Leave Group Dialog */}
      <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave "{group.name}"? You'll need to request to rejoin.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLeaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLeaveGroup}>
              Leave Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
