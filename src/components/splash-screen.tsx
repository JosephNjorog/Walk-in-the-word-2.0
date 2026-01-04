"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Check if we've already shown splash this session
    const hasShownSplash = sessionStorage.getItem("splashShown");
    
    if (hasShownSplash) {
      setShow(false);
      setChecking(false);
      return;
    }

    // Wait for auth check
    if (!isPending) {
      setChecking(false);
      
      // Mark splash as shown
      sessionStorage.setItem("splashShown", "true");

      // If user is logged in, redirect to dashboard after animation
      if (session?.user) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 2500);
      } else {
        // Show splash for 2.5 seconds then hide
        setTimeout(() => {
          setShow(false);
        }, 2500);
      }
    }
  }, [session, isPending, router]);

  if (!show || !checking && !session) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-accent overflow-hidden"
        >
          {/* Animated background patterns */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
            />
            <motion.div
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 0.8, opacity: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 1 }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
            />
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Animated logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                duration: 1,
              }}
              className="relative"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255,255,255,0.3)",
                    "0 0 60px rgba(255,255,255,0.6)",
                    "0 0 20px rgba(255,255,255,0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 rounded-3xl bg-white flex items-center justify-center"
              >
                <BookOpen className="w-16 h-16 text-primary" />
              </motion.div>
            </motion.div>

            {/* Animated text */}
            <div className="flex flex-col items-center gap-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-4xl md:text-5xl font-bold text-white text-center"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Walk in the Word
              </motion.h1>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 0.8 }}
                className="h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    delay: 1.2,
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="h-full w-1/3 bg-white rounded-full"
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                className="text-white/90 text-sm md:text-base mt-2 text-center italic"
              >
                {session?.user ? "Welcome back!" : "Thy word is a lamp unto my feet"}
              </motion.p>
            </div>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex gap-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 bg-white rounded-full"
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
