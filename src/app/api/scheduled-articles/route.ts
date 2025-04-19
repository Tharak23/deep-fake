import { NextRequest, NextResponse } from 'next/server';
import ScheduledArticleService from '@/lib/services/scheduledArticleService';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/scheduled-articles
 * Retrieves all scheduled articles
 * Requires admin authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated as admin
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    // Get scheduled articles
    const result = await ScheduledArticleService.getScheduledArticles();
    
    return NextResponse.json({
      success: true,
      articles: result.articles,
      count: result.articles.length,
    });
  } catch (error) {
    console.error('Error in GET /api/scheduled-articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduled articles' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/scheduled-articles
 * Manually schedules an article for publishing
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
    
    // Parse request body
    const body = await request.json();
    const { articleId, publishTime } = body;
    
    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }
    
    // Convert publishTime to Date if it's a string
    const publishDate = typeof publishTime === 'string' 
      ? new Date(publishTime) 
      : publishTime || new Date();
    
    // Schedule article
    const result = await ScheduledArticleService.manuallyScheduleArticle(
      articleId,
      publishDate
    );
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Article scheduled for publishing at ${publishDate.toLocaleString()}`,
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to schedule article' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/scheduled-articles:', error);
    return NextResponse.json(
      { error: 'Failed to schedule article' },
      { status: 500 }
    );
  }
} 