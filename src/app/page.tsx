"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  TrendingUp,
  Heart,
  Star,
  ChevronRight,
  Menu,
  X,
  Play,
  Sparkles,
  Globe,
  Calendar,
  MessageCircle,
  Award,
  ArrowRight,
  Flame,
} from "lucide-react";

const stats = [
  { label: "Bible Translations", value: "7+", icon: Globe },
  { label: "Active Community", value: "Growing", icon: Users },
  { label: "Self-Hosted", value: "Fast & Private", icon: BookOpen },
  { label: "100% Free", value: "Forever", icon: Heart },
];

const features = [
  {
    icon: BookOpen,
    title: "7+ Bible Translations",
    description: "Access KJV, Spanish Reina-Valera, French Louis Segond, German, Chinese, Greek, and more - all self-hosted for instant access.",
  },
  {
    icon: Users,
    title: "Small Groups & Forums",
    description: "Create private study groups, join discussions, share testimonies, and connect with mentors in a thriving community.",
  },
  {
    icon: Calendar,
    title: "Customizable Reading Plans",
    description: "Follow structured plans or create your own. Track progress across multiple translations and stay consistent.",
  },
  {
    icon: MessageCircle,
    title: "Memory Verse System",
    description: "Master Scripture with spaced repetition. Our proven 6-level system helps you memorize and retain verses long-term.",
  },
  {
    icon: TrendingUp,
    title: "Advanced Progress Tracking",
    description: "Visualize your journey with streaks, milestones, XP levels, and beautiful analytics. Watch your faith grow daily.",
  },
  {
    icon: Sparkles,
    title: "SOAP Journaling",
    description: "Deepen understanding with Scripture, Observation, Application, Prayer. Export your reflections anytime.",
  },
];

const howItWorks = [
  { step: 1, title: "Create Account", description: "Sign up in 30 seconds. No credit card needed.", icon: "01" },
  { step: 2, title: "Start Reading", description: "Begin your journey from Genesis Chapter 1.", icon: "02" },
  { step: 3, title: "Grow Together", description: "Invite partners and share your insights.", icon: "03" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-lg" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                Walk in the Word
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How It Works
              </a>
              <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="btn-primary" size="sm">
                  Start Reading Free
                </Button>
              </Link>
            </div>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden glass border-t"
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-sm font-medium">Features</a>
              <a href="#how-it-works" className="block py-2 text-sm font-medium">How It Works</a>
              <Link href="/pricing" className="block py-2 text-sm font-medium">Pricing</Link>
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full btn-primary">Start Reading Free</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
        <div className="absolute inset-0">
          <div className="absolute top-20 right-[10%] w-[600px] h-[600px] bg-primary/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 left-[10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border shadow-sm text-sm font-medium mb-6"
              >
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-muted-foreground">Enhanced Free Tier • Premium Coming Soon</span>
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Walk with God,{" "}
                <span className="gradient-text">One Chapter</span>{" "}
                at a Time
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Experience Scripture in 7+ languages with our self-hosted Bible platform. Join a vibrant community with groups, forums, memory tools, and advanced study features—all completely free.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
                <Link href="/register">
                  <Button size="lg" className="btn-primary text-base px-8 h-14 w-full sm:w-auto shadow-lg shadow-primary/20 rounded-xl">
                    Begin Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 text-base px-8 rounded-xl border-2 bg-white/50 hover:bg-white">
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center gap-6 justify-center lg:justify-start">
                <div className="text-left">
                  <div className="flex items-center gap-0.5 text-secondary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">Join our growing community of readers</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <Card className="relative overflow-hidden border-0 shadow-2xl rounded-[2rem] bg-white/80 backdrop-blur-xl ring-1 ring-black/5">
                <div className="bg-gradient-to-br from-primary via-primary to-accent p-10 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-sm font-medium tracking-wide uppercase opacity-90">Daily Scripture</span>
                    </div>
                  </div>
                  <h3 className="text-5xl font-bold mb-3 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                    Psalm 23
                  </h3>
                  <p className="text-xl opacity-80 font-medium">The Shepherd Psalm</p>
                </div>
                <CardContent className="p-10">
                  <div className="space-y-6 scripture-text text-xl leading-relaxed text-foreground/90">
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span className="verse-number text-primary/40 font-bold mr-3">1</span>
                      The LORD is my shepherd; I shall not want.
                    </motion.p>
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <span className="verse-number text-primary/40 font-bold mr-3">2</span>
                      He maketh me to lie down in green pastures: he leadeth me beside the still waters.
                    </motion.p>
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <span className="verse-number text-primary/40 font-bold mr-3">3</span>
                      He restoreth my soul: he leadeth me in the paths of righteousness for his name&apos;s sake.
                    </motion.p>
                  </div>
                  <div className="mt-10 pt-8 border-t border-black/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-muted-foreground">Start reading today and grow in faith</span>
                    </div>
                    <Link href="/register">
                      <Button size="lg" className="btn-secondary rounded-xl px-6 font-semibold shadow-lg shadow-secondary/20">
                        Continue
                        <ChevronRight className="ml-1 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <motion.div
                animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/50 z-20"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Flame className="h-7 w-7 text-secondary" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-secondary tracking-tighter">7</div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Day Streak</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card border-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Everything You Need to <span className="gradient-gold">Grow in the Word</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Designed with love to help you build a consistent Bible reading habit.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Start Your Journey in <span className="gradient-gold">3 Simple Steps</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="text-5xl font-bold gradient-text opacity-40 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-primary/90">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Start Free. Upgrade When Ready.
            </h2>
            <p className="text-lg text-white/90 mb-2">Enhanced free tier with 20+ features. Premium plans coming soon.</p>
            <p className="text-white/70 mb-8 max-w-lg mx-auto">
              Walk in the Word is built by believers, for believers. Our mission is to help everyone read God&apos;s Word daily. Premium features help us serve more people.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-base px-8 h-12 rounded-xl">
                  Start Reading Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-base px-8 h-12 rounded-xl">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-card border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  Walk in the Word
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transforming daily Scripture reading into an engaging, accountable experience.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/donate" className="hover:text-primary transition-colors">Donate</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Walk in the Word. Made with love for Jesus.</p>
              <span className="hidden sm:inline">•</span>
              <p>A product of <span className="font-semibold text-primary">SynchStack Solutions Labs</span></p>
            </div>
            <p className="text-xs text-muted-foreground scripture-text italic">
              &ldquo;Let the word of Christ dwell in you richly.&rdquo; - Colossians 3:16
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
