import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import seedUsers from '@/lib/seedUsers';

// Helper function to check if user is admin
async function isAdmin(email: string) {
  const adminEmails = [
    'tharak.nagaveti@gmail.com',
    'adityasaisontena@gmail.com',
    'dhanushyangal@gmail.com',
    'tejeshvarma07@gmail.com'
  ];
  
  return adminEmails.includes(email.toLowerCase());
}

// Seed users API route
export async function POST(req: NextRequest) {
  try {
    // In production, you might want to add authentication
    // but for initial setup, we'll allow this to run without auth
    const session = await getServerSession(authOptions);
    
    // Only check admin if there's a session
    if (session && session.user && session.user.email) {
      const userIsAdmin = await isAdmin(session.user.email);
      
      // If user is logged in but not admin, deny access
      if (!userIsAdmin) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin access required' },
          { status: 403 }
        );
      }
    }
    
    // Run the seeding process
    await seedUsers();
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded with initial users'
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}

// Allow GET for easier access during development
export async function GET(req: NextRequest) {
  return await POST(req);
} 