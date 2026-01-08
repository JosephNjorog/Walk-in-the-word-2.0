"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface AIInsightProps {
  passage: string;
  context?: string;
}

export function AIInsight({ passage, context }: AIInsightProps) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [question, setQuestion] = useState("");
  const [showQuestionBox, setShowQuestionBox] = useState(false);

  const getExplanation = async (customQuestion?: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passage,
          context,
          question: customQuestion || undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to get explanation");
      
      const data = await response.json();
      
      if (data.isPlaceholder) {
        toast.info("AI features require API configuration");
      }
      
      setExplanation(data.explanation);
      if (customQuestion) {
        setQuestion("");
        setShowQuestionBox(false);
      }
    } catch (error) {
      toast.error("Failed to get AI explanation");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Insights
        </CardTitle>
        <CardDescription>
          Get AI-powered explanations and ask questions about this passage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!explanation ? (
          <div className="flex gap-2">
            <Button
              onClick={() => getExplanation()}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Explain Passage
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowQuestionBox(!showQuestionBox)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {explanation}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQuestionBox(!showQuestionBox)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExplanation("")}
              >
                Clear
              </Button>
            </div>
          </>
        )}

        {showQuestionBox && (
          <div className="space-y-2 pt-2 border-t">
            <Textarea
              placeholder="Ask a specific question about this passage..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
            />
            <Button
              size="sm"
              onClick={() => getExplanation(question)}
              disabled={!question.trim() || loading}
              className="w-full"
            >
              {loading ? "Asking..." : "Ask AI"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
