import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.log("[Subscription API] No session found");
      return NextResponse.json({ premium: false, message: 'Not authenticated' }, { status: 401 });
    }

    console.log("[Subscription API] User:", session.user.email);
    console.log("[Subscription API] Tier:", session.user.subscriptionTier);
    console.log("[Subscription API] Status:", session.user.subscriptionStatus);
    console.log("[Subscription API] Expires:", session.user.subscriptionExpiresAt);

    // Check if subscription is active and not expired (including lifetime access)
    const isPremium = 
      session.user.subscriptionTier === 'premium' && 
      session.user.subscriptionStatus === 'active' &&
      (!session.user.subscriptionExpiresAt || new Date(session.user.subscriptionExpiresAt) > new Date());
    
    // Check if user has lifetime access (expiry date far in the future, e.g., 50+ years)
    const hasLifetimeAccess = session.user.subscriptionExpiresAt && 
      new Date(session.user.subscriptionExpiresAt).getFullYear() > new Date().getFullYear() + 50;

    const response = {
      premium: isPremium,
      lifetime: hasLifetimeAccess,
      tier: session.user.subscriptionTier,
      status: session.user.subscriptionStatus,
      expiresAt: session.user.subscriptionExpiresAt,
    };

    console.log("[Subscription API] Returning:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Subscription API] Error checking subscription:', error);
    return NextResponse.json({ premium: false, error: 'Internal server error' }, { status: 500 });
  }
}
