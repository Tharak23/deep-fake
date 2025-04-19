import { NextRequest, NextResponse } from 'next/server';
import ArticleService from '@/lib/services/articleService';

/**
 * GET /api/deepfake-news/tags
 * Retrieves all available tags from DeepFake news articles
 */
export async function GET(request: NextRequest) {
  try {
    // Get all tags from articles
    const tags = await ArticleService.getAllTags();
    
    return NextResponse.json({
      tags,
      count: tags.length
    });
  } catch (error) {
    console.error('Error in GET /api/deepfake-news/tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article tags' },
      { status: 500 }
    );
  }
} 