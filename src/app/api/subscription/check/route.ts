import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ premium: false, message: 'Not authenticated' }, { status: 401 });
    }

    // Check if subscription is active and not expired
    const isPremium = 
      session.user.subscriptionTier === 'premium' && 
      session.user.subscriptionStatus === 'active' &&
      (!session.user.subscriptionExpiresAt || new Date(session.user.subscriptionExpiresAt) > new Date());

    return NextResponse.json({
      premium: isPremium,
      tier: session.user.subscriptionTier,
      status: session.user.subscriptionStatus,
      expiresAt: session.user.subscriptionExpiresAt,
    });
  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json({ premium: false, error: 'Internal server error' }, { status: 500 });
  }
}
