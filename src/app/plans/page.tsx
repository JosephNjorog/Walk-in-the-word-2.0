"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, Clock, CheckCircle, Play, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
}

export default function ReadingPlansPage() {
  const router = useRouter();
  const { premium, lifetime } = useSubscription();
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/reading-plans");
      if (!response.ok) throw new Error("Failed to fetch plans");
      const data = await response.json();
      
      // Mock plans if none exist
      const mockPlans = [
        {
          id: "1",
          name: "Bible in One Year",
          description: "Read through the entire Bible in 365 days with a balanced mix of Old and New Testament",
          duration: 365,
          category: "Complete Bible",
        },
        {
          id: "2",
          name: "New Testament in 90 Days",
          description: "An intensive journey through the New Testament in three months",
          duration: 90,
          category: "New Testament",
        },
        {
          id: "3",
          name: "Gospels Deep Dive",
          description: "Explore the life of Jesus through all four Gospels in 30 days",
          duration: 30,
          category: "Gospels",
        },
        {
          id: "4",
          name: "Psalms & Proverbs",
          description: "Wisdom and worship - read Psalms and Proverbs in 60 days",
          duration: 60,
          category: "Wisdom",
        },
        {
          id: "5",
          name: "Paul's Letters",
          description: "Study all of Paul's epistles in chronological order over 45 days",
          duration: 45,
          category: "Epistles",
        },
        {
          id: "6",
          name: "Prophets Journey",
          description: "Read the major and minor prophets in 90 days",
          duration: 90,
          category: "Prophets",
        },
      ];
      
      setPlans(data.plans?.length > 0 ? data.plans : mockPlans);
    } catch (error) {
      toast.error("Failed to load reading plans");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (planId: string) => {
    setEnrolling(planId);
    try {
      const response = await fetch("/api/reading-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) throw new Error("Failed to enroll");
      
      toast.success("Enrolled in reading plan!");
      // Navigate to plan progress page (to be created)
      // router.push(`/plans/${planId}`);
    } catch (error) {
      toast.error("Failed to enroll in plan");
      console.error(error);
    } finally {
      setEnrolling(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Complete Bible": return "📚";
      case "New Testament": return "✝️";
      case "Gospels": return "📖";
      case "Wisdom": return "💡";
      case "Epistles": return "✉️";
      case "Prophets": return "🔮";
      default: return "📕";
    }
  };

  const categories = Array.from(new Set(plans.map(p => p.category)));

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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Reading Plans
          </h1>
          {(premium || lifetime) ? (
            <Badge className="bg-primary">20+ Plans</Badge>
          ) : (
            <Badge variant="outline">5 Basic Plans</Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Structured plans to guide your Bible reading journey
          {!(premium || lifetime) && " • Free: 5 basic plans • Premium: 20+ advanced plans"}
        </p>
      </div>

      {/* Featured Plans */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Popular Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.slice(0, 2).map((plan) => (
            <Card key={plan.id} className="border-primary">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="text-3xl">{getCategoryIcon(plan.category)}</div>
                  <Badge variant="default">Popular</Badge>
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{plan.duration} days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>~15 min/day</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleEnroll(plan.id)}
                  disabled={enrolling === plan.id}
                >
                  {enrolling === plan.id ? (
                    "Enrolling..."
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Plan
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* All Plans by Category */}
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans
                .filter(p => p.category === category)
                .map((plan) => (
                  <Card key={plan.id}>
                    <CardHeader>
                      <div className="text-2xl mb-2">{getCategoryIcon(plan.category)}</div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">{plan.duration} days</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Daily reading:</span>
                          <span className="font-medium">~15 minutes</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleEnroll(plan.id)}
                        disabled={enrolling === plan.id}
                      >
                        {enrolling === plan.id ? "Enrolling..." : "Enroll"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Benefits Section */}
      <Card className="mt-12 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle>Why Use Reading Plans?</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-semibold mb-1">Consistent Progress</h4>
            <p className="text-sm text-muted-foreground">
              Build a daily habit with structured, achievable goals
            </p>
          </div>
          <div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-semibold mb-1">Complete Context</h4>
            <p className="text-sm text-muted-foreground">
              Understand Scripture in its full context and flow
            </p>
          </div>
          <div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-semibold mb-1">Guided Journey</h4>
            <p className="text-sm text-muted-foreground">
              Follow a proven path through Scripture
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
