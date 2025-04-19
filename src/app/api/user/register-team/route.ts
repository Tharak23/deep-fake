import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Find user by email
    const user = await db.collection('users').findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if user is already registered for a team
    if (user.teamRegistered) {
      return NextResponse.json(
        { message: 'User is already registered for a team' }
      );
    }
    
    // Register user for a team
    const result = await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          teamRegistered: true,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }
    
    // Get the updated user
    const updatedUser = await db.collection('users').findOne({ _id: user._id });
    
    // Return updated user profile
    return NextResponse.json({
      message: 'Team registration successful',
      user: {
        _id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        teamRegistered: updatedUser.teamRegistered
      }
    });
  } catch (error) {
    console.error('Error registering for team:', error);
    return NextResponse.json(
      { error: 'Failed to register for team' },
      { status: 500 }
    );
  }
} 