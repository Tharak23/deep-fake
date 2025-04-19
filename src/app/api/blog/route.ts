import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import BlogPost from '@/models/BlogPost';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const tag = url.searchParams.get('tag');
    
    // Build query
    const query: any = {};
    if (tag) {
      query.tags = tag;
    }
    
    // Get total count for pagination
    const total = await BlogPost.countDocuments(query);
    
    // Get blog posts with pagination
    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    // Format posts for response
    const formattedPosts = posts.map(post => ({
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
    }));
    
    // If we don't have enough posts, add placeholder posts
    if (formattedPosts.length < 3) {
      const placeholderPosts = [
        {
          id: 'placeholder-1',
          title: 'Advancements in Deepfake Detection Algorithms',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
          excerpt: 'Recent advancements in deepfake detection algorithms have shown promising results in identifying manipulated media with high accuracy.',
          author: {
            id: 'author-1',
            name: 'Dr. Sarah Chen',
            image: '/placeholders/team-member-1.jpg'
          },
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          tags: ['AI', 'Deepfake', 'Computer Vision'],
          likes: 42,
          comments: 8,
          image: '/placeholders/blog-1.jpg'
        },
        {
          id: 'placeholder-2',
          title: 'Ethical Implications of Synthetic Media Generation',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
          excerpt: 'As synthetic media becomes more prevalent, researchers are exploring the ethical implications and potential societal impacts.',
          author: {
            id: 'author-2',
            name: 'Prof. Michael Rodriguez',
            image: '/placeholders/team-member-2.jpg'
          },
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          tags: ['Ethics', 'AI', 'Society'],
          likes: 37,
          comments: 12,
          image: '/placeholders/blog-2.jpg'
        },
        {
          id: 'placeholder-3',
          title: 'The Role of GANs in Creating Realistic Synthetic Media',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
          excerpt: 'Generative Adversarial Networks (GANs) have revolutionized the creation of synthetic media, enabling unprecedented levels of realism.',
          author: {
            id: 'author-3',
            name: 'Dr. Aisha Patel',
            image: '/placeholders/team-member-3.jpg'
          },
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          tags: ['GAN', 'Deep Learning', 'Neural Networks'],
          likes: 29,
          comments: 5,
          image: '/placeholders/blog-3.jpg'
        }
      ];
      
      // Add placeholder posts to fill up to 5
      const existingIds = new Set(formattedPosts.map(post => post.id));
      const filteredPlaceholders = placeholderPosts.filter(post => !existingIds.has(post.id));
      
      for (let i = 0; i < Math.min(5 - formattedPosts.length, filteredPlaceholders.length); i++) {
        formattedPosts.push(filteredPlaceholders[i]);
      }
    }
    
    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await import('next-auth/next').then(mod => mod.getServerSession());
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if user can create blog posts
    await dbConnect();
    const user = await User.findById(session.user.id);
    
    if (!user || !user.blogEnabled) {
      return NextResponse.json(
        { error: 'You must enable blog posting in your profile before creating posts' },
        { status: 403 }
      );
    }
    
    // Get request body
    const body = await request.json();
    const { title, content, excerpt, tags, image } = body;
    
    // Validate required fields
    if (!title || !content || !excerpt) {
      return NextResponse.json(
        { error: 'Title, content, and excerpt are required' },
        { status: 400 }
      );
    }
    
    // Create blog post
    const blogPost = await BlogPost.create({
      title,
      content,
      excerpt,
      tags: tags || [],
      author: {
        id: user._id,
        name: user.name,
        image: user.image
      },
      likes: 0,
      comments: 0,
      image,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({
      success: true,
      post: {
        id: blogPost._id.toString(),
        title: blogPost.title,
        excerpt: blogPost.excerpt,
        createdAt: blogPost.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
} 