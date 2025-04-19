import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import VerificationRequest from '@/models/VerificationRequest';
import mongoose from 'mongoose';

// Helper function to check if user is admin
async function isAdmin(email: string) {
  const adminEmails = [
    'tharak.nagaveti@gmail.com',
    'adityasonetna@gmail.com',
    'dhanushyangal@gmail.com',
    'tejeshvarma07@gmail.com'
  ];
  
  if (adminEmails.includes(email.toLowerCase())) {
    return true;
  }
  
  // Also check database for admin role
  const user = await User.findOne({ email: email });
  return user?.role === 'admin';
}

// Helper function to determine researcher level based on roadmap progress
function getRoadmapLevel(progress: number): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
  if (progress >= 90) return 'Expert';
  if (progress >= 70) return 'Advanced';
  if (progress >= 40) return 'Intermediate';
  return 'Beginner';
}

// Get all verification requests
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(session.user.email);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Parse query parameters
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    // Get total count
    const totalCount = await VerificationRequest.countDocuments(query);

    // Get verification requests
    const requests = await VerificationRequest.find(query)
      .sort({ dateSubmitted: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      requests,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching verification requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verification requests' },
      { status: 500 }
    );
  }
}

// Process a verification request (approve/reject)
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(session.user.email);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Parse request body
    const { requestId, action, notes } = await req.json();

    if (!requestId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    // Find the verification request
    const verificationRequest = await VerificationRequest.findById(requestId);
    if (!verificationRequest) {
      return NextResponse.json(
        { error: 'Verification request not found' },
        { status: 404 }
      );
    }

    // Find the user
    const user = await User.findById(verificationRequest.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get admin user ID for reviewer reference
    const adminUser = await User.findOne({ email: session.user.email });
    const reviewerId = adminUser ? adminUser._id : null;

    // Update verification request
    verificationRequest.status = action === 'approve' ? 'approved' : 'rejected';
    verificationRequest.reviewedBy = reviewerId ? new mongoose.Types.ObjectId(reviewerId) : undefined;
    verificationRequest.reviewDate = new Date();
    verificationRequest.reviewNotes = notes || '';
    await verificationRequest.save();

    // If approved, update user role and permissions
    if (action === 'approve') {
      const verificationDate = new Date();
      
      // Calculate roadmap level based on roadmap progress (if available)
      const roadmapProgress = user.roadmapProgress || 0;
      const roadmapLevel = getRoadmapLevel(roadmapProgress);
      
      // Update user document with verified researcher status and details
      user.role = 'verified_researcher';
      user.isVerified = true;
      user.verificationDate = verificationDate;
      user.roadmapLevel = roadmapLevel;
      user.blogEnabled = true;
      
      // Update user with additional researcher information from verification request
      user.institution = verificationRequest.institution;
      user.position = verificationRequest.position;
      user.field = verificationRequest.researchField;
      
      await user.save();
    }

    return NextResponse.json({
      message: `Verification request ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      requestId: verificationRequest._id,
      status: verificationRequest.status
    });
  } catch (error) {
    console.error('Error processing verification request:', error);
    return NextResponse.json(
      { error: 'Failed to process verification request' },
      { status: 500 }
    );
  }
} 