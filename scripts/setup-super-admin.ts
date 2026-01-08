/**
 * Setup Script: Promote User to Super Admin
 * 
 * This script promotes an existing user to super admin role.
 * The user must already exist in the database (registered via web).
 * 
 * Usage:
 * npm run setup:admin
 */

import 'dotenv/config';
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
      console.log('\n📝 Please register first:');
      console.log('   1. Go to http://localhost:3000/register');
      console.log('   2. Register with email or use "Continue with Google"');
      console.log(`   3. Use email: ${SUPER_ADMIN_EMAIL}`);
      console.log('   4. Run this script again: npm run setup:admin');
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

    console.log('\n🎉 SUCCESS! User promoted to Super Admin!');
    console.log('\n📋 Admin Details:');
    console.log(`   Name: ${result[0].name}`);
    console.log(`   Email: ${result[0].email}`);
    console.log(`   Role: ${result[0].role}`);
    console.log(`   Verified: ${result[0].isVerified}`);
    console.log('\n🔐 Access the admin dashboard:');
    console.log('   1. Go to http://localhost:3000/login');
    console.log('   2. Login with your existing credentials');
    console.log('   3. Visit http://localhost:3000/admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up super admin:', error);
    process.exit(1);
  }
}

// Run the setup
setupSuperAdmin();
