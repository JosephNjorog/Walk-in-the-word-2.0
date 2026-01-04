import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

function generateUsername(name: string): string {
  // Remove special characters and spaces, convert to lowercase
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 15);
  
  // Add random numbers for uniqueness
  const random = Math.floor(Math.random() * 9999);
  return `${base}${random}`;
}

export async function POST(request: Request) {
  try {
    const { username, name } = await request.json();

    let usernameToCheck = username;
    
    // If no username provided, generate one from name
    if (!usernameToCheck && name) {
      usernameToCheck = generateUsername(name);
    }

    if (!usernameToCheck) {
      return NextResponse.json({ error: "Username or name is required" }, { status: 400 });
    }

    // Validate username format
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(usernameToCheck)) {
      return NextResponse.json({ 
        available: false, 
        error: "Username must be 3-20 characters, lowercase letters, numbers, and underscores only" 
      }, { status: 400 });
    }

    // Check if username exists
    const existing = await db.query.user.findFirst({
      where: eq(user.username, usernameToCheck),
    });

    if (existing) {
      // If auto-generated, try another
      if (!username && name) {
        const suggested = generateUsername(name);
        return NextResponse.json({ 
          available: false, 
          suggested 
        });
      }
      return NextResponse.json({ available: false });
    }

    return NextResponse.json({ available: true, username: usernameToCheck });
  } catch (error) {
    console.error("Username check error:", error);
    return NextResponse.json({ error: "Failed to check username" }, { status: 500 });
  }
}
