import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized: Please sign in to update your profile' },
        { status: 401 }
      );
    }

    // Get user email from the session
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { message: 'User email not found in session' },
        { status: 400 }
      );
    }

    // Parse the request body
    const updatedProfile = await req.json();
    
    // Validate the data (basic validation)
    if (typeof updatedProfile !== 'object' || updatedProfile === null) {
      return NextResponse.json(
        { message: 'Invalid profile data' },
        { status: 400 }
      );
    }

    // Ensure we're not allowing certain fields to be updated directly
    // Users shouldn't be able to change their role, email, etc.
    const sanitizedProfile = sanitizeProfileData(updatedProfile);

    // Connect to database
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Find the user by email
    const existingUser = await usersCollection.findOne({ email: userEmail });
    if (!existingUser) {
      // If user doesn't exist in the database yet, create a new document
      const newUser = {
        name: session.user.name || 'User',
        email: userEmail,
        image: session.user.image || '',
        role: 'user', // Default role for new users
        isVerified: false,
        roadmapProgress: 0,
        roadmapLevel: 'Beginner',
        blogEnabled: false,
        blogPosts: [],
        datasets: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...sanitizedProfile
      };

      const result = await usersCollection.insertOne(newUser);
      if (!result.acknowledged) {
        throw new Error('Failed to create user profile');
      }

      return NextResponse.json({
        message: 'Profile created successfully',
        user: newUser
      });
    }

    // Update the existing user
    const result = await usersCollection.updateOne(
      { email: userEmail },
      { 
        $set: {
          ...sanitizedProfile,
          updatedAt: new Date().toISOString()
        } 
      }
    );

    if (!result.acknowledged) {
      throw new Error('Failed to update profile');
    }

    // Return the updated user
    const updatedUser = await usersCollection.findOne({ email: userEmail });
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: `Failed to update profile: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

// Helper function to sanitize profile data
function sanitizeProfileData(data: Record<string, any>) {
  // Create a new object with only allowed fields
  const allowedFields = [
    'name',
    'bio',
    'specialization',
    'interests',
    'image',
    'roadmapProgress', // Allow updating roadmap progress
    'datasets'         // Allow updating datasets
  ];

  const sanitized: Record<string, any> = {};
  
  for (const field of allowedFields) {
    if (field in data) {
      sanitized[field] = data[field];
    }
  }

  // If roadmapProgress is updated, also update roadmapLevel
  if ('roadmapProgress' in sanitized) {
    // Ensure it's a number between 0 and 100
    sanitized.roadmapProgress = Math.max(0, Math.min(100, Number(sanitized.roadmapProgress)));
    
    // Update the roadmap level based on progress
    if (sanitized.roadmapProgress >= 90) {
      sanitized.roadmapLevel = 'Expert';
    } else if (sanitized.roadmapProgress >= 70) {
      sanitized.roadmapLevel = 'Advanced';
    } else if (sanitized.roadmapProgress >= 40) {
      sanitized.roadmapLevel = 'Intermediate';
    } else {
      sanitized.roadmapLevel = 'Beginner';
    }
  }

  return sanitized;
} 