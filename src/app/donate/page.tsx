"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Heart,
  ArrowLeft,
  Coffee,
  Gift,
  Sparkles,
  Globe,
  Users,
  Server,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

const impactAreas = [
  {
    icon: Server,
    title: "Server & Hosting",
    description: "Keeping the app fast and reliable for readers worldwide.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Making Scripture accessible in more languages and regions.",
  },
  {
    icon: Users,
    title: "Community Features",
    description: "Building tools for accountability and fellowship.",
  },
  {
    icon: Sparkles,
    title: "New Features",
    description: "Developing audio readings, study tools, and more.",
  },
];

const donationTiers = [
  { amount: 5, label: "Supporter", description: "Buy us a coffee", icon: Coffee },
  { amount: 25, label: "Partner", description: "Support for a month", icon: Heart },
  { amount: 100, label: "Champion", description: "Help us grow", icon: Gift },
];

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(25);
  const [customAmount, setCustomAmount] = useState("");

  const handleDonate = () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (!amount || amount < 1) return;
    
    window.parent.postMessage({ 
      type: "OPEN_EXTERNAL_URL", 
      data: { url: `https://paypal.me/walkintheword/${amount}` } 
    }, "*");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                Walk in the Word
              </span>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 mb-6">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Support Our Mission
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Walk in the Word is and will always be <strong>100% free</strong>. Your generous donations help us maintain and improve the app for believers around the world.
          </p>
        </motion.div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800 mb-12">
          <p className="text-center scripture-text italic text-amber-900 dark:text-amber-100">
            &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
          </p>
          <p className="text-center text-sm text-amber-700 dark:text-amber-300 mt-2 font-semibold">
            — 2 Corinthians 9:7
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-xl mb-12">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold mb-6 text-center" style={{ fontFamily: "var(--font-heading)" }}>
                Choose Your Gift
              </h2>

              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {donationTiers.map((tier) => (
                  <button
                    key={tier.amount}
                    onClick={() => {
                      setSelectedAmount(tier.amount);
                      setCustomAmount("");
                    }}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      selectedAmount === tier.amount && !customAmount
                        ? "border-primary bg-primary/5 shadow-lg"
                        : "border-muted hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <tier.icon className={`h-8 w-8 mb-3 ${
                      selectedAmount === tier.amount && !customAmount ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <div className="text-2xl font-bold mb-1">${tier.amount}</div>
                    <div className="font-semibold text-sm">{tier.label}</div>
                    <div className="text-xs text-muted-foreground">{tier.description}</div>
                  </button>
                ))}
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium mb-2 text-center">
                  Or enter a custom amount
                </label>
                <div className="relative max-w-xs mx-auto">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    className="pl-8 text-center text-lg h-12"
                  />
                </div>
              </div>

              <Button
                onClick={handleDonate}
                size="lg"
                className="w-full h-14 text-lg btn-primary rounded-xl"
                disabled={!selectedAmount && !customAmount}
              >
                <Heart className="mr-2 h-5 w-5" />
                Donate ${customAmount || selectedAmount || 0}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                You&apos;ll be redirected to PayPal to complete your donation securely.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold mb-6 text-center" style={{ fontFamily: "var(--font-heading)" }}>
            Where Your Donation Goes
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {impactAreas.map((area, index) => (
              <Card key={area.title} className="border-0 shadow-lg">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <area.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{area.title}</h3>
                    <p className="text-sm text-muted-foreground">{area.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Other Ways to Support
              </h2>
              <div className="space-y-4 text-left max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Share with Friends</p>
                    <p className="text-sm text-muted-foreground">Invite others to join you in daily Bible reading.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Pray for Us</p>
                    <p className="text-sm text-muted-foreground">Pray that God uses this tool to draw people closer to Him.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Send Feedback</p>
                    <p className="text-sm text-muted-foreground">Help us improve by sharing your suggestions and ideas.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Thank you for considering a gift to Walk in the Word.<br />
            May the Lord bless you abundantly.
          </p>
        </div>
      </main>
    </div>
  );
}
