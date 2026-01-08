"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Home, RefreshCcw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console
    console.error("Global error:", error);
    
    // Show toast notification
    toast.error("Application Error", {
      description: "Something went wrong. Please try refreshing the page.",
      duration: 5000,
    });
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[#FFFBEB] via-white to-[#EFF6FF]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          </div>

          <div className="w-full max-w-md relative z-10">
            <div className="flex items-center gap-2 mb-8 justify-center">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#6366f1] flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Walk in the Word</span>
            </div>

            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                
                <CardTitle className="text-2xl">Something Went Wrong</CardTitle>
                <CardDescription className="text-base mt-2">
                  We encountered an unexpected error. Please try again.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {error.digest && (
                  <div className="bg-muted/50 rounded-lg p-4 text-sm">
                    <p className="text-muted-foreground">
                      <strong>Error ID:</strong>{" "}
                      <code className="bg-muted px-2 py-1 rounded text-xs">{error.digest}</code>
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={reset}
                    className="w-full h-12 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a87] hover:from-[#2d5a87] hover:to-[#1e3a5f] text-white text-base"
                  >
                    <RefreshCcw className="mr-2 h-5 w-5" />
                    Try Again
                  </Button>

                  <a href="/">
                    <Button variant="outline" className="w-full h-12">
                      <Home className="mr-2 h-5 w-5" />
                      Go to Home
                    </Button>
                  </a>
                </div>

                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    Error persists?
                  </p>
                  <a 
                    href="/support" 
                    className="text-sm text-[#1e3a5f] hover:underline font-medium"
                  >
                    Contact Support
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </body>
    </html>
  );
}
