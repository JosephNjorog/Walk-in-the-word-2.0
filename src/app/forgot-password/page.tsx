"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to send reset email");
        return;
      }

      toast.success("Password reset email sent!");
      setIsSubmitted(true);

    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            {isSubmitted ? (
              <>
                <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl" style={{ fontFamily: "var(--font-heading)" }}>
                  Check Your Email
                </CardTitle>
                <CardDescription>
                  We&apos;ve sent a password reset link to <strong>{email}</strong>
                </CardDescription>
              </>
            ) : (
              <>
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl" style={{ fontFamily: "var(--font-heading)" }}>
                  Forgot Password?
                </CardTitle>
                <CardDescription>
                  No worries! Enter your email and we&apos;ll send you a reset link.
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="space-y-4">
                <p className="text-sm text-center text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or try again.
                </p>
                <Button
                  variant="outline"
                  className="w-full h-12"
                  onClick={() => setIsSubmitted(false)}
                >
                  Try another email
                </Button>
                <Link href="/login">
                  <Button className="w-full h-12 btn-primary">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 btn-primary text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <Link href="/login">
                  <Button variant="ghost" className="w-full h-12">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Sign In
                  </Button>
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
