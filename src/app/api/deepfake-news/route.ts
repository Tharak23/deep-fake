import { NextRequest, NextResponse } from 'next/server';
import ArticleService from '@/lib/services/articleService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/deepfake-news
 * Retrieves DeepFake news articles with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const published = searchParams.get('published') === 'true';
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const tags = searchParams.get('tags')?.split(',') || [];
    const search = searchParams.get('search') || '';
    
    // Get articles
    const result = await ArticleService.getArticles({
      page,
      limit,
      published,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
      tags,
      search,
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/deepfake-news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch DeepFake news articles' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/deepfake-news
 * Fetches new articles from external APIs and stores them in the database
 */
export async function POST(request: NextRequest) {
  try {
    // Fetch and store articles
    const result = await ArticleService.fetchAndStoreArticles();
    
    return NextResponse.json({
      message: 'Successfully fetched and stored articles',
      ...result
    });
  } catch (error) {
    console.error('Error in POST /api/deepfake-news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch and store articles' },
      { status: 500 }
    );
  }
} 