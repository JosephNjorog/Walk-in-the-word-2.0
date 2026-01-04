"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, ArrowRight, ArrowLeft, Eye, EyeOff, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    username: "",
    readingPace: "1",
    inviteCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const res = await fetch("/api/username/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error("Username check error:", error);
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Validate username is available
    if (usernameAvailable === false) {
      toast.error("Please choose an available username");
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate username if not provided
      let finalUsername = formData.username;
      if (!finalUsername) {
        const nameRes = await fetch("/api/username/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: `${formData.firstName} ${formData.lastName}`.trim() }),
        });
        const nameData = await nameRes.json();
        finalUsername = nameData.username;
      }

      const { error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        username: finalUsername,
        //@ts-ignore - custom fields
        readingPace: parseInt(formData.readingPace),
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message || "Failed to create account");
      } else {
        toast.success("Account created successfully!");
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to sign up with Google");
      setIsGoogleLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                Walk in the Word
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Begin Your Journey
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of believers reading through the Bible together. It only takes 30 seconds.
            </p>
            <div className="space-y-4">
              {[
                "Read through the entire Bible",
                "Track your progress & streaks",
                "Connect with accountability partners",
                "Share reflections & insights",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Walk in the Word
            </span>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl" style={{ fontFamily: "var(--font-heading)" }}>
                Create Account
              </CardTitle>
              <CardDescription>
                {step === 1 ? "Get started with your account" : `Step ${step} of 3`}
              </CardDescription>
              {step > 1 && (
                <div className="flex gap-2 justify-center mt-4">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={cn(
                        "h-2 w-16 rounded-full transition-colors",
                        s <= step ? "bg-primary" : "bg-muted"
                      )}
                    />
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {step === 1 && (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <Button 
                        variant="outline" 
                        className="h-12 font-medium" 
                        onClick={handleGoogleSignUp}
                        disabled={isGoogleLoading}
                      >
                        {isGoogleLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                        )}
                        Google
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-12 font-medium" 
                        onClick={() => authClient.signIn.social({ provider: "github", callbackURL: "/dashboard" })}
                      >
                        <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                        GitHub
                      </Button>
                    </div>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                  </div>
                </>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          className="h-12 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {formData.password && (
                        <div className="space-y-1">
                          <div className="flex gap-1">
                            {[0, 1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className={cn(
                                  "h-1 flex-1 rounded-full transition-colors",
                                  i < passwordStrength()
                                    ? strengthColors[passwordStrength() - 1]
                                    : "bg-muted"
                                )}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Password strength: {passwordStrength() > 0 ? strengthLabels[passwordStrength() - 1] : ""}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        className="h-12"
                      />
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-xs text-destructive">Passwords do not match</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <Input
                          id="username"
                          placeholder="Choose a unique username"
                          value={formData.username}
                          onChange={(e) => {
                            const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                            setFormData({ ...formData, username: value });
                            if (value.length >= 3) {
                              checkUsernameAvailability(value);
                            } else {
                              setUsernameAvailable(null);
                            }
                          }}
                          required
                          className="h-12 pr-10"
                        />
                        {checkingUsername && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
                        )}
                        {!checkingUsername && usernameAvailable === true && (
                          <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        3-20 characters, lowercase letters, numbers, and underscores only
                      </p>
                      {usernameAvailable === false && (
                        <p className="text-xs text-destructive">Username is already taken</p>
                      )}
                      {usernameAvailable === true && (
                        <p className="text-xs text-green-600">Username is available!</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="readingPace">Daily Reading Goal</Label>
                      <Select
                        value={formData.readingPace}
                        onValueChange={(value) => setFormData({ ...formData, readingPace: value })}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select chapters per day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 chapter per day (3.3 years)</SelectItem>
                          <SelectItem value="2">2 chapters per day (1.6 years)</SelectItem>
                          <SelectItem value="3">3 chapters per day (1.1 years)</SelectItem>
                          <SelectItem value="4">4 chapters per day (10 months)</SelectItem>
                          <SelectItem value="5">5 chapters per day (8 months)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        You can always change this later in settings
                      </p>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl bg-muted/50 text-center">
                      <p className="text-lg font-medium mb-1">Almost there, {formData.firstName}!</p>
                      <p className="text-sm text-muted-foreground">
                        Were you invited by a friend?
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="inviteCode">Invite Code (Optional)</Label>
                      <Input
                        id="inviteCode"
                        placeholder="Enter invite code"
                        value={formData.inviteCode}
                        onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                        className="h-12"
                      />
                      <p className="text-xs text-muted-foreground">
                        If you have an invite code, enter it to connect with your friend
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="h-4 w-4 rounded border-input mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 h-12"
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className={cn("h-12 btn-primary text-base", step === 1 ? "w-full" : "flex-1")}
                    disabled={isLoading || (step === 1 && formData.password !== formData.confirmPassword)}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating account...
                      </>
                    ) : step < 3 ? (
                      <>
                        Continue
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    ) : (
                      <>
                        Start Reading
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
