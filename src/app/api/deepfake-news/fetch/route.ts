import { NextRequest, NextResponse } from 'next/server';
import ArticleService from '@/lib/services/articleService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/deepfake-news/fetch
 * Manually fetches and updates articles from news APIs
 * Requires admin authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated as admin
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    // Fetch and update articles
    const result = await ArticleService.manualFetchAndUpdate();
    
    return NextResponse.json({
      success: true,
      ...result,
      message: `Successfully fetched ${result.total} articles, added ${result.new} new articles, and published ${result.published} articles.`
    });
  } catch (error) {
    console.error('Error in POST /api/deepfake-news/fetch:', error);
    return NextResponse.json(
      { error: 'Failed to fetch and update articles' },
      { status: 500 }
    );
  }
} 