import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import VerificationRequest from '@/models/VerificationRequest';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to request verification' },
        { status: 401 }
      );
    }

    // Get user email from session
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found in session' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user already has a pending or approved verification request
    const existingRequest = await VerificationRequest.findOne({
      userEmail: userEmail,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingRequest) {
      return NextResponse.json(
        { 
          error: 'You already have a verification request',
          status: existingRequest.status
        },
        { status: 400 }
      );
    }

    // Parse request body
    const requestData = await req.json();
    const {
      researchField,
      institution,
      position,
      publicationsCount,
      motivation,
      publicationLinks,
      roadmapCompleted
    } = requestData;

    // Validate required fields
    if (!researchField || !institution || !position || !motivation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create verification request
    const verificationRequest = new VerificationRequest({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      dateSubmitted: new Date(),
      researchField,
      institution,
      position,
      publicationsCount: publicationsCount || 0,
      motivation,
      publicationLinks: publicationLinks || [],
      status: 'pending',
      roadmapCompleted: roadmapCompleted || false
    });

    // Save verification request
    await verificationRequest.save();

    return NextResponse.json(
      { 
        message: 'Verification request submitted successfully',
        requestId: verificationRequest._id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting verification request:', error);
    return NextResponse.json(
      { error: 'Failed to submit verification request' },
      { status: 500 }
    );
  }
}

// Get verification request status for the current user
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to check verification status' },
        { status: 401 }
      );
    }

    // Get user email from session
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found in session' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user's verification request
    const verificationRequest = await VerificationRequest.findOne({
      userEmail: userEmail
    }).sort({ createdAt: -1 });

    if (!verificationRequest) {
      return NextResponse.json(
        { status: 'none', message: 'No verification request found' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        status: verificationRequest.status,
        requestId: verificationRequest._id,
        dateSubmitted: verificationRequest.dateSubmitted,
        reviewDate: verificationRequest.reviewDate
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking verification status:', error);
    return NextResponse.json(
      { error: 'Failed to check verification status' },
      { status: 500 }
    );
  }
} 