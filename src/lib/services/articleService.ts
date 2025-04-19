import DeepFakeArticle, { IDeepFakeArticle } from '@/models/DeepFakeArticle';
import { fetchAllDeepFakeNews, NewsArticle } from '@/lib/api/newsApi';
import dbConnect from '@/lib/dbConnect';

/**
 * Service for handling article operations
 */
export default class ArticleService {
  /**
   * Fetch articles from APIs and store in the database
   */
  static async fetchAndStoreArticles(): Promise<{
    total: number;
    new: number;
    duplicates: number;
  }> {
    try {
      await dbConnect();
      
      // Fetch articles from various sources
      const articles = await fetchAllDeepFakeNews();
      
      let newArticlesCount = 0;
      let duplicatesCount = 0;
      
      // Process each article
      const operations = articles.map(async (article) => {
        try {
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
            tags: article.tags || [], // Save tags from the API
          };
          
          // Try to create a new article in the database
          const result = await DeepFakeArticle.findOneAndUpdate(
            { url: article.url },
            articleData,
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
          
          // Check if this was a new document or an update
          if (result.isNew) {
            newArticlesCount++;
          } else {
            duplicatesCount++;
          }
          
          return result;
        } catch (err) {
          console.error(`Error processing article ${article.title}:`, err);
          duplicatesCount++;
          return null;
        }
      });
      
      // Wait for all operations to complete
      await Promise.all(operations);
      
      return {
        total: articles.length,
        new: newArticlesCount,
        duplicates: duplicatesCount,
      };
    } catch (error) {
      console.error('Error in fetchAndStoreArticles:', error);
      throw error;
    }
  }
  
  /**
   * Get articles from the database with pagination
   */
  static async getArticles({
    page = 1,
    limit = 20,
    published = true,
    sortBy = 'publishedAt',
    sortOrder = 'desc',
    tags = [],
    search = '',
  }: {
    page?: number;
    limit?: number;
    published?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    tags?: string[];
    search?: string;
  }) {
    try {
      await dbConnect();
      
      // Build the query
      const query: any = {};
      
      // Filter by publication status
      if (published !== undefined) {
        query.isPublished = published;
      }
      
      // Filter by tags if provided
      if (tags && tags.length > 0) {
        query.tags = { $in: tags };
      }
      
      // Add text search if provided
      if (search && search.trim() !== '') {
        query.$text = { $search: search };
      }
      
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Determine sort options
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
      
      // If using text search, include the text score for sorting
      const projection = search && search.trim() !== '' 
        ? { score: { $meta: 'textScore' } } 
        : {};
      
      // Execute the query
      const articles = await DeepFakeArticle.find(query, projection)
        .sort(search && search.trim() !== '' ? { score: { $meta: 'textScore' }, ...sort } : sort)
        .skip(skip)
        .limit(limit)
        .lean();
      
      // Get total count for pagination
      const total = await DeepFakeArticle.countDocuments(query);
      
      return {
        articles,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
          hasMore: skip + articles.length < total,
        },
      };
    } catch (error) {
      console.error('Error in getArticles:', error);
      throw error;
    }
  }
  
  /**
   * Schedule articles for publication
   */
  static async scheduleArticlesForPublication({
    minRelevanceScore = 5,
    limit = 5,
    publishDelay = 0,
  }: {
    minRelevanceScore?: number;
    limit?: number;
    publishDelay?: number;
  }) {
    try {
      await dbConnect();
      
      // Find unpublished articles with sufficient relevance
      const articles = await DeepFakeArticle.find({
        isPublished: false,
        relevanceScore: { $gte: minRelevanceScore },
      })
        .sort({ relevanceScore: -1, publishedAt: -1 })
        .limit(limit);
      
      if (!articles.length) {
        return { scheduled: 0 };
      }
      
      // Determine publication time
      const now = new Date();
      
      // Schedule each article
      const operations = articles.map(async (article, index) => {
        // Schedule with incremental delay if specified
        const publishDate = new Date(now.getTime() + (publishDelay * index * 60000));
        
        article.isPublished = true;
        article.publishDate = publishDate;
        
        return article.save();
      });
      
      await Promise.all(operations);
      
      return { scheduled: articles.length };
    } catch (error) {
      console.error('Error in scheduleArticlesForPublication:', error);
      throw error;
    }
  }
  
  /**
   * Get article statistics
   */
  static async getArticleStats() {
    try {
      await dbConnect();
      
      const stats = await DeepFakeArticle.aggregate([
        {
          $facet: {
            'totalCount': [{ $count: 'count' }],
            'publishedCount': [
              { $match: { isPublished: true } },
              { $count: 'count' }
            ],
            'unpublishedCount': [
              { $match: { isPublished: false } },
              { $count: 'count' }
            ],
            'byRelevance': [
              {
                $group: {
                  _id: null,
                  avgRelevance: { $avg: '$relevanceScore' },
                  maxRelevance: { $max: '$relevanceScore' },
                  minRelevance: { $min: '$relevanceScore' }
                }
              }
            ],
            'topSources': [
              { $group: { _id: '$source.name', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: 5 }
            ],
            'topTags': [
              { $unwind: '$tags' },
              { $group: { _id: '$tags', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: 10 }
            ]
          }
        }
      ]);
      
      // Process the results
      const result = stats[0];
      
      return {
        total: result.totalCount[0]?.count || 0,
        published: result.publishedCount[0]?.count || 0,
        unpublished: result.unpublishedCount[0]?.count || 0,
        relevance: result.byRelevance[0] || { avgRelevance: 0, maxRelevance: 0, minRelevance: 0 },
        topSources: result.topSources || [],
        topTags: result.topTags || [],
      };
    } catch (error) {
      console.error('Error in getArticleStats:', error);
      throw error;
    }
  }

  /**
   * Get all available tags from articles
   */
  static async getAllTags(): Promise<string[]> {
    try {
      await dbConnect();
      
      // Aggregate all tags from published articles
      const result = await DeepFakeArticle.aggregate([
        { $match: { isPublished: true } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags' } },
        { $sort: { _id: 1 } }
      ]);
      
      return result.map(item => item._id);
    } catch (error) {
      console.error('Error in getAllTags:', error);
      return [];
    }
  }

  /**
   * Manually fetch and update articles (for admin use)
   */
  static async manualFetchAndUpdate(): Promise<{
    total: number;
    new: number;
    published: number;
  }> {
    try {
      await dbConnect();
      
      // Fetch new articles
      const fetchResult = await this.fetchAndStoreArticles();
      
      // Auto-publish articles with high relevance
      const publishResult = await this.scheduleArticlesForPublication({
        minRelevanceScore: 4,
        limit: 10,
        publishDelay: 0
      });
      
      return {
        total: fetchResult.total,
        new: fetchResult.new,
        published: publishResult.scheduled
      };
    } catch (error) {
      console.error('Error in manualFetchAndUpdate:', error);
      throw error;
    }
  }
} 