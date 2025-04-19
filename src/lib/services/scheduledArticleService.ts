import redis from '@/lib/redis';
import DeepFakeArticle, { IDeepFakeArticle } from '@/models/DeepFakeArticle';
import dbConnect from '@/lib/dbConnect';
import { fetchAllDeepFakeNews } from '@/lib/api/newsApi';

const SCHEDULED_ARTICLES_KEY = 'scheduled_articles';
const PUBLISHED_ARTICLES_KEY = 'published_articles';

/**
 * Service for handling scheduled article operations with Upstash Redis
 */
export default class ScheduledArticleService {
  /**
   * Fetch articles from APIs and schedule them for publishing
   */
  static async fetchAndScheduleArticles(): Promise<{
    total: number;
    scheduled: number;
    error?: string;
  }> {
    try {
      await dbConnect();
      
      // Fetch articles from various sources
      const articles = await fetchAllDeepFakeNews();
      
      // Sort by relevance score
      const sortedArticles = articles.sort((a, b) => 
        (b.relevanceScore || 0) - (a.relevanceScore || 0)
      );
      
      // Take top articles (adjust number as needed)
      const topArticles = sortedArticles.slice(0, 20);
      
      let scheduledCount = 0;
      
      // Schedule articles for publishing at different times
      for (let i = 0; i < topArticles.length; i++) {
        const article = topArticles[i];
        
        // Check if article already exists in MongoDB
        const existingArticle = await DeepFakeArticle.findOne({ url: article.url });
        
        if (!existingArticle) {
          // Convert to the database model format
          const articleData = {
            source: article.source,
            author: article.author,
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: new Date(article.publishedAt),
            content: article.content,
            category: article.category,
            relevanceScore: article.relevanceScore || 0,
            isPublished: false,
            publishDate: null,
            tags: article.tags || [],
          };
          
          // Save to MongoDB
          const newArticle = await DeepFakeArticle.create(articleData);
          
          // Calculate publish time (staggered throughout the day)
          // Each article will be published with a delay from the previous one
          const publishDelay = i * 30; // 30 minutes between articles
          const publishTime = new Date();
          publishTime.setMinutes(publishTime.getMinutes() + publishDelay);
          
          // Schedule article for publishing
          await this.scheduleArticle(newArticle._id.toString(), publishTime);
          
          scheduledCount++;
        }
      }
      
      return {
        total: topArticles.length,
        scheduled: scheduledCount,
      };
    } catch (error) {
      console.error('Error in fetchAndScheduleArticles:', error);
      return {
        total: 0,
        scheduled: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * Schedule an article for publishing at a specific time
   */
  static async scheduleArticle(articleId: string, publishTime: Date): Promise<boolean> {
    try {
      // Store in Redis with publish time as score
      await redis.zadd(SCHEDULED_ARTICLES_KEY, {
        score: publishTime.getTime(),
        member: articleId,
      });
      
      return true;
    } catch (error) {
      console.error('Error scheduling article:', error);
      return false;
    }
  }
  
  /**
   * Publish articles that are due to be published
   */
  static async publishDueArticles(): Promise<{
    published: number;
    error?: string;
  }> {
    try {
      await dbConnect();
      
      const now = Date.now();
      
      // Get articles that are due to be published
      const dueArticles = await redis.zrangebyscore(
        SCHEDULED_ARTICLES_KEY,
        0,
        now
      );
      
      if (!dueArticles.length) {
        return { published: 0 };
      }
      
      let publishedCount = 0;
      
      // Process each due article
      for (const articleId of dueArticles) {
        // Update article in MongoDB
        const article = await DeepFakeArticle.findByIdAndUpdate(
          articleId,
          {
            isPublished: true,
            publishDate: new Date(),
          },
          { new: true }
        );
        
        if (article) {
          // Remove from scheduled list
          await redis.zrem(SCHEDULED_ARTICLES_KEY, articleId);
          
          // Add to published list
          await redis.zadd(PUBLISHED_ARTICLES_KEY, {
            score: now,
            member: articleId,
          });
          
          publishedCount++;
        }
      }
      
      return { published: publishedCount };
    } catch (error) {
      console.error('Error publishing due articles:', error);
      return {
        published: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * Get all scheduled articles
   */
  static async getScheduledArticles(): Promise<{
    articles: Array<{
      article: IDeepFakeArticle;
      scheduledTime: Date;
    }>;
    error?: string;
  }> {
    try {
      await dbConnect();
      
      // Get all scheduled article IDs with their scheduled times
      const scheduledArticlesWithScores = await redis.zrange(
        SCHEDULED_ARTICLES_KEY,
        0,
        -1,
        { withScores: true }
      );
      
      if (!scheduledArticlesWithScores.length) {
        return { articles: [] };
      }
      
      // Convert to array of { articleId, scheduledTime }
      const scheduledArticles = [];
      for (let i = 0; i < scheduledArticlesWithScores.length; i += 2) {
        scheduledArticles.push({
          articleId: scheduledArticlesWithScores[i],
          scheduledTime: new Date(Number(scheduledArticlesWithScores[i + 1])),
        });
      }
      
      // Fetch article details from MongoDB
      const articles = await Promise.all(
        scheduledArticles.map(async ({ articleId, scheduledTime }) => {
          const article = await DeepFakeArticle.findById(articleId);
          return {
            article: article?.toObject(),
            scheduledTime,
          };
        })
      );
      
      // Filter out any null articles
      return {
        articles: articles.filter(item => item.article) as Array<{
          article: IDeepFakeArticle;
          scheduledTime: Date;
        }>,
      };
    } catch (error) {
      console.error('Error getting scheduled articles:', error);
      return {
        articles: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * Manually schedule an article for publishing
   */
  static async manuallyScheduleArticle(articleId: string, publishTime: Date): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await dbConnect();
      
      // Check if article exists
      const article = await DeepFakeArticle.findById(articleId);
      
      if (!article) {
        return {
          success: false,
          error: 'Article not found',
        };
      }
      
      // Schedule article
      const scheduled = await this.scheduleArticle(articleId, publishTime);
      
      if (scheduled) {
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Failed to schedule article',
        };
      }
    } catch (error) {
      console.error('Error manually scheduling article:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
} 