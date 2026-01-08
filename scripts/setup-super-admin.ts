/**
 * Setup Script: Create Super Admin User
 * 
 * This script creates a super admin user with predefined credentials.
 * Run this to create the admin account directly in the database.
 * 
 * Usage:
 * npm run setup:admin
 */

import { db } from '../src/lib/db';
import { user, account } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const SUPER_ADMIN = {
  email: 'mwangijoenjoroge@gmail.com',
  password: 'Sirintai83#',
  name: 'Super Admin',
  username: 'superadmin',
};

async function setupSuperAdmin() {
  try {
    console.log('🔧 Setting up Super Admin...\n');
    
    // Check if user already exists
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, SUPER_ADMIN.email),
    });

    if (existingUser) {
      console.log(`✅ User already exists: ${existingUser.name} (${existingUser.email})`);
      
      // Just update to admin role
      const result = await db
        .update(user)
        .set({ 
          role: 'admin',
          isVerified: true,
        })
        .where(eq(user.email, SUPER_ADMIN.email))
        .returning();

      console.log('\n🎉 User updated to Super Admin!');
      console.log('\n📋 Admin Details:');
      console.log(`   Name: ${result[0].name}`);
      console.log(`   Email: ${result[0].email}`);
      console.log(`   Role: ${result[0].role}`);
      console.log(`   Verified: ${result[0].isVerified}`);
    } else {
      console.log('📝 Creating new super admin user...');
      
      // Generate user ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create user
      const newUser = await db
        .insert(user)
        .values({
          id: userId,
          email: SUPER_ADMIN.email,
          name: SUPER_ADMIN.name,
          username: SUPER_ADMIN.username,
          emailVerified: true,
          isVerified: true,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      // Hash password (using bcrypt)
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(SUPER_ADMIN.password, 10);

      // Create account with password
      await db.insert(account).values({
        id: `account_${Date.now()}`,
        accountId: userId,
        providerId: 'credential',
        userId: userId,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('\n🎉 SUCCESS! Super Admin created!');
      console.log('\n📋 Admin Details:');
      console.log(`   Name: ${newUser[0].name}`);
      console.log(`   Email: ${newUser[0].email}`);
      console.log(`   Username: ${newUser[0].username}`);
      console.log(`   Role: ${newUser[0].role}`);
      console.log(`   Verified: ${newUser[0].isVerified}`);
    }

    console.log('\n🔐 Access the admin dashboard at: http://localhost:3000/admin');
    console.log('\n✨ Login credentials:');
    console.log(`   Email: ${SUPER_ADMIN.email}`);
    console.log(`   Password: ${SUPER_ADMIN.password}`);
    console.log('\n⚠️  Remember to change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up super admin:', error);
    process.exit(1);
  }
}

// Run the setup
setupSuperAdmin();
