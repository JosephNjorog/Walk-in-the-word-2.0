"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  ArrowLeft, 
  AlertTriangle, 
  XCircle, 
  Info,
  RefreshCcw,
  Home
} from "lucide-react";
import { toast } from "sonner";

// Error messages mapping
const errorMessages: Record<string, { title: string; description: string; icon: any; color: string }> = {
  "please_restart_the_process": {
    title: "Session Expired",
    description: "Your authentication session has expired. Please try signing in again.",
    icon: RefreshCcw,
    color: "text-orange-500"
  },
  "invalid_credentials": {
    title: "Invalid Credentials",
    description: "The email or password you entered is incorrect. Please try again.",
    icon: XCircle,
    color: "text-red-500"
  },
  "oauth_account_not_linked": {
    title: "Account Not Linked",
    description: "This OAuth account is not linked to an existing user. Please sign up first.",
    icon: AlertTriangle,
    color: "text-yellow-500"
  },
  "email_already_in_use": {
    title: "Email Already in Use",
    description: "An account with this email already exists. Try signing in instead.",
    icon: AlertTriangle,
    color: "text-yellow-500"
  },
  "user_not_found": {
    title: "User Not Found",
    description: "No account found with these credentials. Please check your information or sign up.",
    icon: XCircle,
    color: "text-red-500"
  },
  "email_not_verified": {
    title: "Email Not Verified",
    description: "Please verify your email address before signing in.",
    icon: Info,
    color: "text-blue-500"
  },
  "too_many_requests": {
    title: "Too Many Attempts",
    description: "Too many login attempts. Please try again later.",
    icon: AlertTriangle,
    color: "text-red-500"
  },
  "account_locked": {
    title: "Account Locked",
    description: "Your account has been locked for security reasons. Please contact support.",
    icon: XCircle,
    color: "text-red-500"
  },
  "oauth_error": {
    title: "OAuth Error",
    description: "There was an error connecting with the OAuth provider. Please try again.",
    icon: XCircle,
    color: "text-red-500"
  },
  "callback_error": {
    title: "Callback Error",
    description: "There was an error processing the authentication callback.",
    icon: XCircle,
    color: "text-red-500"
  },
  "unknown_error": {
    title: "Something Went Wrong",
    description: "An unexpected error occurred. Please try again.",
    icon: AlertTriangle,
    color: "text-orange-500"
  }
};

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AuthErrorPageInner />
    </Suspense>
  );
}

function AuthErrorPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [errorType, setErrorType] = useState<string>("unknown_error");
  const [errorInfo, setErrorInfo] = useState(errorMessages["unknown_error"]);

  useEffect(() => {
    const error = searchParams.get("error") || "unknown_error";
    setErrorType(error);
    
    // Get error info or use default
    const info = errorMessages[error] || errorMessages["unknown_error"];
    setErrorInfo(info);

    // Show toast notification
    toast.error(info.title, {
      description: info.description,
      duration: 5000,
    });
  }, [searchParams]);

  const handleRetry = () => {
    // Determine where to redirect based on error type
    if (errorType.includes("oauth") || errorType === "please_restart_the_process") {
      router.push("/login");
    } else if (errorType === "email_already_in_use") {
      router.push("/login");
    } else if (errorType === "user_not_found") {
      router.push("/register");
    } else {
      router.push("/login");
    }
  };

  const ErrorIcon = errorInfo.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[#FFFBEB] via-white to-[#EFF6FF]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
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
            <div className={`mx-auto h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4`}>
              <ErrorIcon className={`h-8 w-8 ${errorInfo.color}`} />
            </div>
            <CardTitle className="text-2xl" style={{ fontFamily: "var(--font-heading)" }}>
              {errorInfo.title}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {errorInfo.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Error Details */}
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <p className="text-muted-foreground">
                <strong>Error Code:</strong> <code className="bg-muted px-2 py-1 rounded">{errorType}</code>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                className="w-full h-12 btn-primary text-base"
              >
                <RefreshCcw className="mr-2 h-5 w-5" />
                Try Again
              </Button>

              <Link href="/login">
                <Button variant="outline" className="w-full h-12">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Sign In
                </Button>
              </Link>

              <Link href="/">
                <Button variant="ghost" className="w-full h-12">
                  <Home className="mr-2 h-5 w-5" />
                  Go to Home
                </Button>
              </Link>
            </div>

            {/* Additional Help */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Still having trouble?
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

        {/* Additional Error Messages */}
        {errorType === "too_many_requests" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
          >
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              For security reasons, we limit login attempts. Please wait a few minutes before trying again.
            </p>
          </motion.div>
        )}

        {errorType === "email_not_verified" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Check your inbox for a verification email. Don't forget to check your spam folder!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
