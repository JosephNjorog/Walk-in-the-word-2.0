"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Crown, Users, Infinity, Sparkles, Heart, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const freeTierFeatures = [
  { name: "Full Bible Access (7 translations)", included: true, premium: true },
  { name: "Unlimited chapter reading", included: true, premium: true },
  { name: "Basic reading plans (5 plans)", included: true, premium: true },
  { name: "Progress tracking & streaks", included: true, premium: true },
  { name: "Bookmarks (100 verses)", included: true, premium: true },
  { name: "Highlights (3 colors)", included: true, premium: true },
  { name: "Join up to 3 small groups", included: true, premium: true },
  { name: "Create 1 small group (15 members)", included: true, premium: true },
  { name: "Forum access (unlimited viewing)", included: true, premium: true },
  { name: "Post forum topics (10/week)", included: true, premium: true },
  { name: "Memory verses (10 active)", included: true, premium: true },
  { name: "SOAP journaling (unlimited entries)", included: true, premium: true },
  { name: "Share testimonies (2/week)", included: true, premium: true },
  { name: "3 accountability partners", included: true, premium: true },
  { name: "Reading badges & level 1-10", included: true, premium: true },
  { name: "Basic AI insights (3/day)", included: true, premium: true },
  { name: "Mobile responsive design", included: true, premium: true },
  { name: "Dark mode", included: true, premium: true },
  { name: "Daily email reminders", included: true, premium: true },
  { name: "Community prayer wall", included: true, premium: true },
];

const premiumFeatures = [
  { name: "Everything in Free, plus:", included: true },
  { name: "20+ Bible translations", included: false },
  { name: "Parallel reading (4 versions)", included: false },
  { name: "Advanced reading plans (20+ plans)", included: false },
  { name: "Custom plan builder", included: false },
  { name: "Unlimited bookmarks", included: false },
  { name: "Highlights (10 colors + notes)", included: false },
  { name: "Join unlimited small groups", included: false },
  { name: "Create unlimited groups (50 members each)", included: false },
  { name: "Unlimited forum posts", included: false },
  { name: "Memory verses (unlimited)", included: false },
  { name: "Advanced memory stats & review", included: false },
  { name: "Unlimited testimonies", included: false },
  { name: "10 accountability partners", included: false },
  { name: "All achievement levels (1-50+)", included: false },
  { name: "Unlimited AI insights", included: false },
  { name: "Cross-references & commentaries", included: false },
  { name: "Strong's Concordance (Greek/Hebrew)", included: false },
  { name: "Audio Bible (multiple voices)", included: false },
  { name: "Export journal as PDF", included: false },
  { name: "Custom themes & fonts", included: false },
  { name: "Offline reading (download books)", included: false },
  { name: "Priority support", included: false },
  { name: "Ad-free experience", included: false },
  { name: "Premium badge", included: false },
];

const churchFeatures = [
  { name: "Everything in Premium, plus:" },
  { name: "Branded church profile page" },
  { name: "Custom reading plans for congregation" },
  { name: "Sermon integration & notes" },
  { name: "Group admin dashboard" },
  { name: "Up to 200 members per group" },
  { name: "Unlimited group video calls" },
  { name: "Bulk member invites" },
  { name: "Church announcements board" },
  { name: "Ministry resource library" },
  { name: "Advanced analytics & reports" },
  { name: "White-label options" },
  { name: "Dedicated account manager" },
  { name: "Custom integrations" },
];

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const [currency, setCurrency] = useState<"usd" | "ksh">("usd");

  const pricing = {
    premium: {
      monthly: { usd: 4.99, ksh: 650 },
      yearly: { usd: 49, ksh: 6400, save: 10 }
    },
    church: {
      monthly: { usd: 19.99, ksh: 2600 },
      yearly: { usd: 199, ksh: 26000, save: 40 }
    },
    lifetime: { usd: 199, ksh: 26000 }
  };

  const currencySymbol = currency === "usd" ? "$" : "KSh";
  const currencyLabel = currency === "usd" ? "USD" : "KSH (Kenya)";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <Link href="/register">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4">Simple, Transparent Pricing</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Choose Your <span className="gradient-text">Spiritual Growth</span> Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Start free with everything you need. Upgrade anytime for advanced features and unlimited access.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="flex items-center justify-center gap-3">
                <span className={billingInterval === "monthly" ? "font-semibold" : "text-muted-foreground"}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingInterval(billingInterval === "monthly" ? "yearly" : "monthly")}
                  className="relative w-14 h-7 rounded-full bg-primary transition-colors"
                >
                  <span
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                      billingInterval === "yearly" ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className={billingInterval === "yearly" ? "font-semibold" : "text-muted-foreground"}>
                  Yearly
                  {billingInterval === "yearly" && (
                    <Badge variant="secondary" className="ml-2">Save 17%</Badge>
                  )}
                </span>
              </div>
              
              {/* Currency Toggle */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-card">
                <span className="text-sm text-muted-foreground">Currency:</span>
                <button
                  onClick={() => setCurrency(currency === "usd" ? "ksh" : "usd")}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    currency === "usd" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrency(currency === "usd" ? "ksh" : "usd")}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    currency === "ksh" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  KSH (KSh)
                </button>
              </div>
            </div>

            {/* Payment Notice */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950 text-sm text-blue-700 dark:text-blue-300 mb-12">
              <Heart className="h-4 w-4" />
              <span>Payments powered by Paystack (coming soon) • 100% secure</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Free Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full flex flex-col border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="h-6 w-6 text-green-500" />
                    Free Forever
                  </CardTitle>
                  <CardDescription>
                    Everything essential for spiritual growth
                  </CardDescription>
                  <div className="pt-4">
                    <div className="text-4xl font-bold">$0</div>
                    <div className="text-sm text-muted-foreground">Forever. No credit card.</div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm">
                    {freeTierFeatures.map((feature) => (
                      <li key={feature.name} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/register" className="w-full">
                    <Button className="w-full" size="lg">
                      Start Reading Free
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Premium Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full flex flex-col border-2 border-primary relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white px-4 py-1">Most Popular</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Crown className="h-6 w-6 text-yellow-500" />
                    Premium
                  </CardTitle>
                  <CardDescription>
                    For serious Bible students
                  </CardDescription>
                  <div className="pt-4">
                    <div className="text-4xl font-bold">
                      {currencySymbol}{billingInterval === "monthly" 
                        ? (currency === "usd" ? pricing.premium.monthly.usd : pricing.premium.monthly.ksh)
                        : (currency === "usd" ? (pricing.premium.yearly.usd / 12).toFixed(2) : Math.round(pricing.premium.yearly.ksh / 12))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per month • {currencyLabel}
                    </div>
                    {billingInterval === "yearly" && (
                      <div className="text-xs text-green-600 font-medium mt-1">
                        Save {currencySymbol}{currency === "usd" ? pricing.premium.yearly.save : Math.round(pricing.premium.yearly.save * 130)}/year
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm">
                    {premiumFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className={feature.included ? "font-semibold" : ""}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button className="w-full" size="lg" disabled>
                    Coming Soon (Paystack)
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Billed {billingInterval === "yearly" ? "annually" : "monthly"} • Cancel anytime
                  </p>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Church Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full flex flex-col border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Users className="h-6 w-6 text-purple-500" />
                    Church/Ministry
                  </CardTitle>
                  <CardDescription>
                    For organizations & large groups
                  </CardDescription>
                  <div className="pt-4">
                    <div className="text-4xl font-bold">
                      {currencySymbol}{billingInterval === "monthly" 
                        ? (currency === "usd" ? pricing.church.monthly.usd : pricing.church.monthly.ksh)
                        : (currency === "usd" ? (pricing.church.yearly.usd / 12).toFixed(2) : Math.round(pricing.church.yearly.ksh / 12))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per month • {currencyLabel}
                    </div>
                    {billingInterval === "yearly" && (
                      <div className="text-xs text-green-600 font-medium mt-1">
                        Save {currencySymbol}{currency === "usd" ? pricing.church.yearly.save : Math.round(pricing.church.yearly.save * 130)}/year
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm">
                    {churchFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                        <span className={i === 0 ? "font-semibold" : ""}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button className="w-full" size="lg" variant="outline" disabled>
                    Contact Sales (Soon)
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Custom pricing available for 200+ members
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          </div>

          {/* Lifetime Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 max-w-4xl mx-auto"
          >
            <Card className="border-2 border-yellow-500/50 bg-linear-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center shrink-0">
                      <Infinity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Lifetime Access</h3>
                      <p className="text-muted-foreground mb-2">
                        Pay once, use forever. All Premium features + future updates included.
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{currencySymbol}{currency === "usd" ? pricing.lifetime.usd : pricing.lifetime.ksh.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">
                          one-time • {currencyLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 min-w-[200px]" disabled>
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Will the free tier always be free?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! We're committed to keeping the Bible and essential reading features completely free forever. 
                  Our mission is to make Scripture accessible to everyone.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">When will payments be available?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We're integrating Paystack for secure payments. Premium features will be available soon. 
                  Sign up for free now and you'll be notified when Premium launches!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I switch plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely! You can upgrade, downgrade, or cancel your subscription at any time. 
                  If you cancel, you'll keep Premium access until the end of your billing period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer discounts for students or missionaries?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! We offer 50% discounts for students and free Premium access for full-time missionaries. 
                  Contact us with verification and we'll set you up.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is Paystack secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Paystack is PCI-DSS compliant and handles millions of transactions securely. 
                  We never store your payment information on our servers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Bible Reading?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of believers growing in their faith daily. Start free, upgrade when ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="min-w-[200px]">
                Get Started Free
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="min-w-[200px]">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
