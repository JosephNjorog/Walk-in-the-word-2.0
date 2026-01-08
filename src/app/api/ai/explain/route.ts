import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { passage, question, context } = body;

    if (!passage) {
      return NextResponse.json(
        { error: "Passage is required" },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        explanation: "AI integration requires an API key. Please configure ANTHROPIC_API_KEY or OPENAI_API_KEY in your environment variables to enable AI-powered passage explanations, discussion questions, and insights.",
        isPlaceholder: true
      });
    }

    // Anthropic Claude integration
    if (process.env.ANTHROPIC_API_KEY) {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: question 
                ? `Regarding this Bible passage: "${passage}"\n\nQuestion: ${question}\n\nProvide a thoughtful, biblically-sound answer.`
                : `Explain this Bible passage in simple terms, highlighting key themes and practical applications: "${passage}"\n\n${context ? `Context: ${context}` : ""}`
            }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("AI service error");
      }

      const data = await response.json();
      return NextResponse.json({
        explanation: data.content[0].text,
        provider: "claude"
      });
    }

    // OpenAI GPT integration fallback
    if (process.env.OPENAI_API_KEY) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a biblical scholar and theologian. Provide clear, accurate, and spiritually enriching explanations of Bible passages."
            },
            {
              role: "user",
              content: question 
                ? `Regarding this Bible passage: "${passage}"\n\nQuestion: ${question}`
                : `Explain this Bible passage: "${passage}"\n\n${context ? `Context: ${context}` : ""}`
            }
          ],
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error("AI service error");
      }

      const data = await response.json();
      return NextResponse.json({
        explanation: data.choices[0].message.content,
        provider: "openai"
      });
    }

    return NextResponse.json({
      explanation: "AI service not configured",
      isPlaceholder: true
    });

  } catch (error) {
    console.error("AI Explain Error:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
