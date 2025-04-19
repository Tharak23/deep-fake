import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    // Find user by email
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if user already has blog posting enabled
    if (user.blogEnabled) {
      return NextResponse.json(
        { message: 'Blog posting is already enabled for this user' }
      );
    }
    
    // Enable blog posting for user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          blogEnabled: true,
          updatedAt: new Date()
        }
      },
      { new: true }
    );
    
    // Return updated user profile
    return NextResponse.json({
      message: 'Blog posting enabled successfully',
      user: {
        _id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        blogEnabled: updatedUser.blogEnabled
      }
    });
  } catch (error) {
    console.error('Error enabling blog posting:', error);
    return NextResponse.json(
      { error: 'Failed to enable blog posting' },
      { status: 500 }
    );
  }
} 