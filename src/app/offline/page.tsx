import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, WifiOff, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Offline | Walk in the Word",
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
          <WifiOff className="h-10 w-10 text-muted-foreground" />
        </div>
        
        <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          You&apos;re Offline
        </h1>
        
        <p className="text-muted-foreground mb-6">
          It looks like you&apos;ve lost your internet connection. Don&apos;t worry — your reading progress is saved and will sync when you&apos;re back online.
        </p>

        <div className="p-4 rounded-xl bg-muted/50 border mb-6">
          <p className="scripture-text italic text-sm">
            &ldquo;The grass withereth, the flower fadeth: but the word of our God shall stand for ever.&rdquo;
          </p>
          <p className="text-xs text-muted-foreground mt-2">— Isaiah 40:8</p>
        </div>

        <Button 
          onClick={() => window.location.reload()} 
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>

        <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium">Walk in the Word</span>
        </div>
      </div>
    </div>
  );
}
