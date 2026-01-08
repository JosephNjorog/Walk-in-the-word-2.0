/**
 * Setup Script: Set Super Admin Role
 * 
 * This script sets a user as super admin by their email address.
 * Run this once after the user registers to grant admin access.
 * 
 * Usage:
 * 1. Make sure the user has registered with email: mwangijoenjoroge@gmail.com
 * 2. Run: npm run setup:admin
 * 
 * Or manually via API:
 * POST /api/admin/setup
 * {
 *   "email": "mwangijoenjoroge@gmail.com",
 *   "secret": "your-secret-key"
 * }
 */

import { db } from '../src/lib/db';
import { user } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const SUPER_ADMIN_EMAIL = 'mwangijoenjoroge@gmail.com';

async function setupSuperAdmin() {
  try {
    console.log('🔧 Setting up Super Admin...\n');
    
    // Find user by email
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, SUPER_ADMIN_EMAIL),
    });

    if (!existingUser) {
      console.error(`❌ Error: User with email ${SUPER_ADMIN_EMAIL} not found.`);
      console.log('\n📝 Please register this user first, then run this script again.');
      process.exit(1);
    }

    console.log(`✅ Found user: ${existingUser.name} (${existingUser.email})`);
    
    // Update user to admin role
    const result = await db
      .update(user)
      .set({ 
        role: 'admin',
        isVerified: true,
      })
      .where(eq(user.email, SUPER_ADMIN_EMAIL))
      .returning();

    if (result.length > 0) {
      console.log('\n🎉 SUCCESS! Super Admin has been set up.');
      console.log('\n📋 Admin Details:');
      console.log(`   Name: ${result[0].name}`);
      console.log(`   Email: ${result[0].email}`);
      console.log(`   Role: ${result[0].role}`);
      console.log(`   Verified: ${result[0].isVerified}`);
      console.log('\n🔐 You can now access the admin dashboard at: /admin');
      console.log('\n✨ Login with:');
      console.log(`   Email: ${SUPER_ADMIN_EMAIL}`);
      console.log(`   Password: Sirintai83#`);
    } else {
      console.error('❌ Failed to update user role.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up super admin:', error);
    process.exit(1);
  }
}

// Run the setup
setupSuperAdmin();
