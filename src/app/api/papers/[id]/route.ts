import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Paper from '@/models/Paper';
import User from '@/models/User';
import mongoose from 'mongoose';

// GET /api/papers/[id] - Get a single paper by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'You must be signed in to view this paper' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const { id } = params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid paper ID format' },
        { status: 400 }
      );
    }
    
    // Find paper and increment views
    const paper = await Paper.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('authors', 'name image title')
      .populate('bookmarkedBy', 'name image')
      .lean();
    
    if (!paper) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(paper);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch paper' },
      { status: 500 }
    );
  }
}

// PUT /api/papers/[id] - Update a paper
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'You must be signed in to update a paper' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const { id } = params;
    const body = await req.json();
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid paper ID format' },
        { status: 400 }
      );
    }
    
    // Find paper
    const paper = await Paper.findById(id);
    
    if (!paper) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }
    
    // Check if user is an author or admin
    const isAuthor = paper.authors.some(
      (author: any) => author.toString() === session.user.id
    );
    const isAdmin = session.user.role === 'admin';
    
    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'You are not authorized to update this paper' },
        { status: 403 }
      );
    }
    
    // Update paper
    const updatedPaper = await Paper.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )
      .populate('authors', 'name image title')
      .lean();
    
    return NextResponse.json(updatedPaper);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update paper' },
      { status: 500 }
    );
  }
}

// DELETE /api/papers/[id] - Delete a paper
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'You must be signed in to delete a paper' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const { id } = params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid paper ID format' },
        { status: 400 }
      );
    }
    
    // Find paper
    const paper = await Paper.findById(id);
    
    if (!paper) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }
    
    // Check if user is an author or admin
    const isAuthor = paper.authors.some(
      (author: any) => author.toString() === session.user.id
    );
    const isAdmin = session.user.role === 'admin';
    
    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'You are not authorized to delete this paper' },
        { status: 403 }
      );
    }
    
    // Delete paper
    await Paper.findByIdAndDelete(id);
    
    // TODO: Also delete the file from storage
    
    return NextResponse.json(
      { message: 'Paper deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete paper' },
      { status: 500 }
    );
  }
}

// PATCH /api/papers/[id]/bookmark - Bookmark or unbookmark a paper
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'You must be signed in to bookmark a paper' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const { id } = params;
    const { action } = await req.json();
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid paper ID format' },
        { status: 400 }
      );
    }
    
    // Validate action
    if (action !== 'bookmark' && action !== 'unbookmark') {
      return NextResponse.json(
        { error: 'Invalid action. Must be "bookmark" or "unbookmark"' },
        { status: 400 }
      );
    }
    
    // Find paper
    const paper = await Paper.findById(id);
    
    if (!paper) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }
    
    // Update paper bookmarks
    let updatedPaper;
    if (action === 'bookmark') {
      updatedPaper = await Paper.findByIdAndUpdate(
        id,
        { $addToSet: { bookmarkedBy: session.user.id } },
        { new: true }
      );
    } else {
      updatedPaper = await Paper.findByIdAndUpdate(
        id,
        { $pull: { bookmarkedBy: session.user.id } },
        { new: true }
      );
    }
    
    return NextResponse.json({
      message: action === 'bookmark' ? 'Paper bookmarked' : 'Paper unbookmarked',
      bookmarked: action === 'bookmark',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update bookmark' },
      { status: 500 }
    );
  }
} 