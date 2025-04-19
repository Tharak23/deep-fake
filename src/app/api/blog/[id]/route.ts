import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import BlogPost from '@/models/BlogPost';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Find blog post by ID
    const post = await BlogPost.findById(id).lean();
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Format post for response
    const formattedPost = {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt?.toISOString() || post.createdAt.toISOString(),
      tags: post.tags,
      likes: post.likes,
      comments: post.comments,
      image: post.image
    };
    
    return NextResponse.json({ post: formattedPost });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
} 