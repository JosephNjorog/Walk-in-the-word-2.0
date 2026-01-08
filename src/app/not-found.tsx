"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Home, RefreshCcw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    toast.error("Page Not Found", {
      description: "The page you're looking for doesn't exist.",
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[#FFFBEB] via-white to-[#EFF6FF]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Walk in the Word
          </span>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            
            <div className="mb-4">
              <div className="text-6xl font-bold text-primary">404</div>
            </div>
            
            <CardTitle className="text-2xl" style={{ fontFamily: "var(--font-heading)" }}>
              Page Not Found
            </CardTitle>
            <CardDescription className="text-base mt-2">
              The page you're looking for seems to have wandered off the path.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
              <p className="text-sm text-muted-foreground italic">
                "I am the way, the truth, and the life..." — John 14:6
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/">
                <Button className="w-full h-12 btn-primary text-base">
                  <Home className="mr-2 h-5 w-5" />
                  Go to Home
                </Button>
              </Link>

              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full h-12"
              >
                <RefreshCcw className="mr-2 h-5 w-5" />
                Go Back
              </Button>

              <Link href="/dashboard">
                <Button variant="ghost" className="w-full h-12">
                  Go to Dashboard
                </Button>
              </Link>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Need help finding something?
              </p>
              <Link 
                href="/support" 
                className="text-sm text-primary hover:underline font-medium"
              >
                Contact Support
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
