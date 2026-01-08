"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, Lock, Globe, Calendar, Search, Filter } from "lucide-react";
import { toast } from "sonner";

interface Group {
  id: string;
  name: string;
  description: string;
  type: string;
  privacy: string;
  maxMembers: number;
  memberCount: number;
  leaderName: string;
  leaderImage: string;
  imageUrl?: string;
  meetingSchedule?: string;
  createdAt: string;
}

export default function GroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "small_group",
    privacy: "private",
    maxMembers: 12,
    meetingSchedule: "",
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch("/api/groups");
      if (!response.ok) throw new Error("Failed to fetch groups");
      const data = await response.json();
      setGroups(data.groups || []);
    } catch (error) {
      toast.error("Failed to load groups");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create group");
      
      const data = await response.json();
      toast.success("Group created successfully!");
      setCreateDialogOpen(false);
      setFormData({
        name: "",
        description: "",
        type: "small_group",
        privacy: "private",
        maxMembers: 12,
        meetingSchedule: "",
      });
      fetchGroups();
    } catch (error) {
      toast.error("Failed to create group");
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || group.type === filterType;
    return matchesSearch && matchesFilter;
  });

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
          <h1 className="text-3xl font-bold mb-2">Small Groups</h1>
          <p className="text-muted-foreground">
            Join a community of believers for Bible study, fellowship, and spiritual growth
          </p>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create a New Group</DialogTitle>
              <DialogDescription>
                Start a small group for Bible study, prayer, or fellowship
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Wednesday Bible Study"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What's your group about?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Group Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small_group">Small Group</SelectItem>
                      <SelectItem value="bible_study">Bible Study</SelectItem>
                      <SelectItem value="prayer_group">Prayer Group</SelectItem>
                      <SelectItem value="accountability">Accountability</SelectItem>
                      <SelectItem value="youth">Youth Group</SelectItem>
                      <SelectItem value="mens">Men's Group</SelectItem>
                      <SelectItem value="womens">Women's Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privacy">Privacy</Label>
                  <Select
                    value={formData.privacy}
                    onValueChange={(value) => setFormData({ ...formData, privacy: value })}
                  >
                    <SelectTrigger id="privacy">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxMembers">Max Members</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  min="2"
                  max="100"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Meeting Schedule (Optional)</Label>
                <Input
                  id="schedule"
                  placeholder="e.g., Wednesdays 7 PM EST"
                  value={formData.meetingSchedule}
                  onChange={(e) => setFormData({ ...formData, meetingSchedule: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGroup} disabled={creating}>
                {creating ? "Creating..." : "Create Group"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="small_group">Small Group</SelectItem>
            <SelectItem value="bible_study">Bible Study</SelectItem>
            <SelectItem value="prayer_group">Prayer Group</SelectItem>
            <SelectItem value="accountability">Accountability</SelectItem>
            <SelectItem value="youth">Youth Group</SelectItem>
            <SelectItem value="mens">Men's Group</SelectItem>
            <SelectItem value="womens">Women's Group</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Groups Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterType !== "all" 
                ? "Try adjusting your search or filters" 
                : "You haven't joined any groups yet. Create one to get started!"}
            </p>
            {!searchQuery && filterType === "all" && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Group
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card 
              key={group.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/community/groups/${group.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant={group.type === "small_group" ? "default" : "secondary"}>
                    {group.type.replace("_", " ")}
                  </Badge>
                  {group.privacy === "private" ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <CardTitle className="line-clamp-1">{group.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {group.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={group.leaderImage} />
                      <AvatarFallback>{group.leaderName?.[0] || "L"}</AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground">
                      Led by {group.leaderName || "Unknown"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{group.memberCount} / {group.maxMembers} members</span>
                  </div>

                  {group.meetingSchedule && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="line-clamp-1">{group.meetingSchedule}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/community/groups/${group.id}`);
                  }}
                >
                  View Group
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
