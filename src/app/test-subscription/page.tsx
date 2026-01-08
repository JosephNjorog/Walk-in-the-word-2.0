"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function SubscriptionTestPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const { premium, lifetime, tier, status, expiresAt, loading: subLoading } = useSubscription();

  if (sessionLoading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Subscription Test Page</h1>

      <div className="space-y-6">
        {/* Session Info */}
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            {session ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Logged in:</span>
                  <Badge variant="outline" className="bg-green-50">YES</Badge>
                </div>
                <div><span className="font-semibold">Email:</span> {session.user.email}</div>
                <div><span className="font-semibold">Name:</span> {session.user.name}</div>
              </div>
            ) : (
              <div className="text-red-500">Not logged in</div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card className={lifetime ? "border-yellow-500 border-2" : premium ? "border-primary border-2" : ""}>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Premium:</span>
                <Badge variant={premium ? "default" : "secondary"}>
                  {premium ? "✅ YES" : "❌ NO"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-semibold">Lifetime:</span>
                <Badge variant={lifetime ? "default" : "secondary"} className={lifetime ? "bg-yellow-500" : ""}>
                  {lifetime ? "⭐ YES" : "❌ NO"}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold">Tier:</span>
                <Badge variant="outline">{tier || "N/A"}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold">Status:</span>
                <Badge variant="outline">{status || "N/A"}</Badge>
              </div>

              <div>
                <span className="font-semibold">Expires At:</span>{" "}
                {expiresAt ? new Date(expiresAt).toLocaleString() : "N/A"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visual Indicator */}
        <Card className={lifetime ? "bg-gradient-to-br from-yellow-50 to-orange-50" : premium ? "bg-gradient-to-br from-primary/5 to-accent/5" : "bg-gray-50"}>
          <CardHeader>
            <CardTitle>Visual Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              {lifetime ? (
                <>
                  <div className="text-6xl mb-4">⭐</div>
                  <div className="text-2xl font-bold text-yellow-700">LIFETIME ACCESS</div>
                  <div className="text-sm text-muted-foreground mt-2">All features unlocked forever</div>
                </>
              ) : premium ? (
                <>
                  <div className="text-6xl mb-4">👑</div>
                  <div className="text-2xl font-bold text-primary">PREMIUM MEMBER</div>
                  <div className="text-sm text-muted-foreground mt-2">All premium features active</div>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">📘</div>
                  <div className="text-2xl font-bold">FREE TIER</div>
                  <div className="text-sm text-muted-foreground mt-2">Upgrade for more features</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Browser Console Instructions */}
        <Card className="bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle>🔍 Debug Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">1. Open browser DevTools (F12)</p>
            <p className="text-sm">2. Go to Console tab</p>
            <p className="text-sm">3. Look for lines starting with:</p>
            <ul className="list-disc list-inside text-sm ml-4 space-y-1">
              <li><code>[Subscription Hook]</code> - Client-side logs</li>
              <li><code>[Subscription API]</code> - Server-side logs (check terminal)</li>
            </ul>
            <p className="text-sm mt-4">4. Go to Network tab and filter for "subscription"</p>
            <p className="text-sm">5. Click on the request to see the API response</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
