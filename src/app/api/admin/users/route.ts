import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user } from '@/lib/schema';
import { eq, or, like, sql, desc, asc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// Get users with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const level = searchParams.get('level');
    const sortBy = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 50;
    const offset = (page - 1) * pageSize;

    // Build query
    let query = db.select().from(user);

    // Apply filters
    const conditions = [];
    if (search) {
      conditions.push(
        or(
          like(user.name, `%${search}%`),
          like(user.email, `%${search}%`),
          like(user.username, `%${search}%`)
        )
      );
    }
    if (role) {
      conditions.push(eq(user.role, role));
    }
    if (level) {
      conditions.push(eq(user.level, level));
    }

    if (conditions.length > 0) {
      query = query.where(sql`${conditions.join(' AND ')}`) as any;
    }

    // Apply sorting
    if (sortBy === 'newest') {
      query = query.orderBy(desc(user.createdAt)) as any;
    } else if (sortBy === 'oldest') {
      query = query.orderBy(asc(user.createdAt)) as any;
    } else if (sortBy === 'active') {
      query = query.orderBy(desc(user.lastReadAt)) as any;
    }

    const users = await query.limit(pageSize).offset(offset);

    // Get total count
    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(user);
    const total = totalResult[0]?.count || 0;

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update user (admin actions)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const adminUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, action, ...updates } = body;

    // Handle different admin actions
    if (action === 'verify') {
      await db.update(user).set({ isVerified: true }).where(eq(user.id, userId));
    } else if (action === 'unverify') {
      await db.update(user).set({ isVerified: false }).where(eq(user.id, userId));
    } else if (action === 'promote_admin') {
      await db.update(user).set({ role: 'admin' }).where(eq(user.id, userId));
    } else if (action === 'promote_pastor') {
      await db.update(user).set({ role: 'pastor' }).where(eq(user.id, userId));
    } else if (action === 'demote') {
      await db.update(user).set({ role: 'member' }).where(eq(user.id, userId));
    } else {
      // General update
      await db.update(user).set(updates).where(eq(user.id, userId));
    }

    const updatedUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete user (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const adminUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Prevent deleting yourself
    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    await db.delete(user).where(eq(user.id, userId));

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
