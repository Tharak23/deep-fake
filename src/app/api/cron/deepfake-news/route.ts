import { NextRequest, NextResponse } from 'next/server';
import ScheduledArticleService from '@/lib/services/scheduledArticleService';

/**
 * POST /api/cron/deepfake-news
 * Fetches and schedules new articles for publishing
 * Can be called by a cron job
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron job API key if provided
    const apiKey = request.headers.get('x-api-key');
    const cronApiKey = process.env.CRON_API_KEY;
    
    if (cronApiKey && apiKey !== cronApiKey) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key' },
        { status: 401 }
      );
    }
    
    // Fetch and schedule articles
    const result = await ScheduledArticleService.fetchAndScheduleArticles();
    
    return NextResponse.json({
      success: true,
      ...result,
      message: `Successfully fetched ${result.total} articles and scheduled ${result.scheduled} new articles for publishing.`,
    });
  } catch (error) {
    console.error('Error in POST /api/cron/deepfake-news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch and schedule articles' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cron/deepfake-news
 * Publishes articles that are due to be published
 * Can be called by a cron job
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron job API key if provided
    const apiKey = request.headers.get('x-api-key');
    const cronApiKey = process.env.CRON_API_KEY;
    
    if (cronApiKey && apiKey !== cronApiKey) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key' },
        { status: 401 }
      );
    }
    
    // Check if this is a publish action
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'publish') {
      // Publish due articles
      const result = await ScheduledArticleService.publishDueArticles();
      
      return NextResponse.json({
        success: true,
        ...result,
        message: `Successfully published ${result.published} articles.`,
      });
    } else {
      // Fetch and schedule articles (default action)
      const result = await ScheduledArticleService.fetchAndScheduleArticles();
      
      return NextResponse.json({
        success: true,
        ...result,
        message: `Successfully fetched ${result.total} articles and scheduled ${result.scheduled} new articles for publishing.`,
      });
    }
  } catch (error) {
    console.error('Error in GET /api/cron/deepfake-news:', error);
    return NextResponse.json(
      { error: 'Failed to process cron job' },
      { status: 500 }
    );
  }
} 