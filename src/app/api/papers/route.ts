import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Paper from '@/models/Paper';

// GET /api/papers - Get all papers with pagination and filtering
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'You must be signed in to view papers' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const tags = searchParams.get('tags')?.split(',') || [];
    const sort = searchParams.get('sort') || 'newest';
    
    const skip = (page - 1) * limit;
    
    // Build query
    let query: any = {};
    
    // Add search if provided
    if (search) {
      query.$text = { $search: search };
    }
    
    // Add tags if provided
    if (tags.length > 0) {
      query.tags = { $in: tags };
    }
    
    // Determine sort order
    let sortOptions: any = {};
    switch (sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'most-cited':
        sortOptions = { citations: -1 };
        break;
      case 'most-downloaded':
        sortOptions = { downloads: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }
    
    // Execute query with pagination
    const papers = await Paper.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('authors', 'name image')
      .lean();
    
    // Get total count for pagination
    const total = await Paper.countDocuments(query);
    
    return NextResponse.json({
      papers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch papers' },
      { status: 500 }
    );
  }
}

// POST /api/papers - Create a new paper
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'You must be signed in to create a paper' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const body = await req.json();
    
    // Validate required fields
    if (!body.title || !body.abstract || !body.fileUrl) {
      return NextResponse.json(
        { error: 'Title, abstract, and file URL are required' },
        { status: 400 }
      );
    }
    
    // Create new paper
    const paper = await Paper.create({
      ...body,
      authors: [session.user.id, ...(body.authors || [])],
    });
    
    return NextResponse.json(paper, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create paper' },
      { status: 500 }
    );
  }
} 