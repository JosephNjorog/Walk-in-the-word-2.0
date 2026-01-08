/**
 * Grant Premium Access Script
 * Gives a user lifetime premium access
 */

import 'dotenv/config';
import { db } from '../src/lib/db';
import { user } from '../src/lib/schema';
import { eq } from 'drizzle-orm';

const PREMIUM_EMAIL = 'njorojoe11173@gmail.com';

async function grantPremiumAccess() {
  try {
    console.log('🎁 Granting Premium Access...\n');
    
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, PREMIUM_EMAIL),
    });

    if (!existingUser) {
      console.error(`❌ User with email ${PREMIUM_EMAIL} not found.`);
      console.log('\n📝 User must register first.');
      process.exit(1);
    }

    console.log(`✅ Found user: ${existingUser.name} (${existingUser.email})`);
    
    // Update user subscription fields
    const result = await db
      .update(user)
      .set({ 
        subscriptionTier: 'premium',
        subscriptionStatus: 'active',
        // Set expiry to 100 years from now (lifetime)
        subscriptionExpiresAt: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000),
      })
      .where(eq(user.email, PREMIUM_EMAIL))
      .returning();

    console.log('\n🎉 SUCCESS! Premium access granted!');
    console.log('\n📋 User Details:');
    console.log(`   Name: ${result[0].name}`);
    console.log(`   Email: ${result[0].email}`);
    console.log(`   Subscription: ${result[0].subscriptionTier}`);
    console.log(`   Status: ${result[0].subscriptionStatus}`);
    console.log(`   Expires: Lifetime (${result[0].subscriptionExpiresAt})`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error granting premium access:', error);
    process.exit(1);
  }
}

grantPremiumAccess();
