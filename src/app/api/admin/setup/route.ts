import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// This route is for initial setup only - sets super admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, secret } = body;

    // Security: Require a secret key for this operation
    // In production, set this as an environment variable
    const ADMIN_SETUP_SECRET = process.env.ADMIN_SETUP_SECRET || 'change-me-in-production';
    
    if (secret !== ADMIN_SETUP_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update the user role to admin
    const result = await db
      .update(user)
      .set({ 
        role: 'admin',
        isVerified: true,
      })
      .where(eq(user.email, email))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User ${email} has been set as super admin`,
      user: result[0],
    });
  } catch (error) {
    console.error('Error setting admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get admin users
export async function GET() {
  try {
    const admins = await db.query.user.findMany({
      where: eq(user.role, 'admin'),
      columns: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        isVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      admins,
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
