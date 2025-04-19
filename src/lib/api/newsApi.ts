import axios from 'axios';

// Define the article interface
export interface NewsArticle {
  id?: string;
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  category: string;
  relevanceScore?: number;
  tags: string[];
}

// API configurations
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

// Search parameters for DeepFake content
const DEEPFAKE_KEYWORDS = [
  'deepfake', 
  'synthetic media', 
  'AI-generated content',
  'face swapping technology',
  'digital manipulation',
  'deep learning fake',
  'generative adversarial networks',
  'AI fake',
  'artificial intelligence fake',
  'fake video detection',
  'synthetic content',
  'AI manipulation'
];

// Categories for tagging articles
const ARTICLE_CATEGORIES = {
  TECHNOLOGY: ['technology', 'tech', 'ai', 'artificial intelligence', 'algorithm', 'neural network'],
  ETHICS: ['ethics', 'ethical', 'moral', 'privacy', 'consent', 'regulation', 'law', 'legal'],
  DETECTION: ['detection', 'identify', 'recognize', 'spot', 'authenticate', 'verify', 'validation'],
  RESEARCH: ['research', 'study', 'academic', 'university', 'scientist', 'paper', 'journal'],
  SOCIAL_IMPACT: ['social', 'society', 'impact', 'influence', 'effect', 'consequence', 'implication'],
  SECURITY: ['security', 'threat', 'risk', 'danger', 'protect', 'defense', 'cybersecurity']
};

/**
 * Fetch articles from NewsAPI.org related to DeepFakes
 */
export async function fetchNewsApiArticles(): Promise<NewsArticle[]> {
  try {
    if (!NEWS_API_KEY) {
      throw new Error('NEWS_API_KEY is not defined in environment variables');
    }

    // Create a keyword query string - use more sophisticated query
    const query = `(${DEEPFAKE_KEYWORDS.slice(0, 5).join(' OR ')}) AND (AI OR technology OR detection OR ethics)`;
    
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        apiKey: NEWS_API_KEY,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 30, // Increased from 20 to get more articles
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
      },
    });

    if (response.data.status !== 'ok') {
      throw new Error(`NewsAPI Error: ${response.data.message || 'Unknown error'}`);
    }

    // Process articles and add source identifier
    return response.data.articles.map((article: any) => ({
      ...article,
      category: 'news',
      source: {
        ...article.source,
        name: `NewsAPI: ${article.source.name}`
      },
      tags: generateTags(article)
    }));
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    return [];
  }
}

/**
 * Fetch articles from GNews API related to DeepFakes
 */
export async function fetchGNewsArticles(): Promise<NewsArticle[]> {
  try {
    if (!GNEWS_API_KEY) {
      throw new Error('GNEWS_API_KEY is not defined in environment variables');
    }

    // Create a more targeted query
    const query = `(${DEEPFAKE_KEYWORDS.slice(0, 4).join(' OR ')}) AND (technology OR detection OR ethics)`;
    
    const response = await axios.get('https://gnews.io/api/v4/search', {
      params: {
        q: query,
        token: GNEWS_API_KEY,
        lang: 'en',
        max: 30, // Increased from 20 to get more articles
        sortby: 'publishedAt',
        in: 'title,description', // Search in title and description for more relevant results
      },
    });

    if (!response.data.articles) {
      throw new Error('GNews API returned an unexpected response structure');
    }

    // Process articles and add source identifier
    return response.data.articles.map((article: any) => ({
      source: {
        id: null,
        name: `GNews: ${article.source.name}`
      },
      author: article.source.name,
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.image,
      publishedAt: article.publishedAt,
      content: article.content,
      category: 'news',
      tags: generateTags({
        title: article.title,
        description: article.description,
        content: article.content
      })
    }));
  } catch (error) {
    console.error('Error fetching from GNews:', error);
    return [];
  }
}

/**
 * Generate tags for an article based on its content
 */
function generateTags(article: any): string[] {
  const text = [
    article.title, 
    article.description, 
    article.content
  ].filter(Boolean).join(' ').toLowerCase();
  
  const tags: string[] = [];
  
  // Add category tags based on content
  for (const [category, keywords] of Object.entries(ARTICLE_CATEGORIES)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        tags.push(category.toLowerCase().replace('_', ' '));
        break;
      }
    }
  }
  
  // Add specific deepfake-related tags
  for (const keyword of DEEPFAKE_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      // Convert multi-word keywords to tags
      const tag = keyword.toLowerCase().replace(/\s+/g, '-');
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
      // Only add up to 3 specific deepfake tags
      if (tags.length >= 3 + Object.keys(ARTICLE_CATEGORIES).length) {
        break;
      }
    }
  }
  
  // Ensure we have at least one tag
  if (tags.length === 0) {
    tags.push('ai-news');
  }
  
  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Filter articles based on relevance to DeepFake technology
 */
export function filterRelevantArticles(articles: NewsArticle[]): NewsArticle[] {
  return articles
    .map(article => {
      const text = [
        article.title, 
        article.description, 
        article.content
      ].filter(Boolean).join(' ').toLowerCase();
      
      // Calculate relevance score based on keyword matches and position
      let score = 0;
      
      // Title matches are more important (3x weight)
      const title = article.title.toLowerCase();
      DEEPFAKE_KEYWORDS.forEach(keyword => {
        if (title.includes(keyword.toLowerCase())) {
          score += 3;
        }
      });
      
      // Full text matches
      DEEPFAKE_KEYWORDS.forEach(keyword => {
        const regex = new RegExp(keyword.toLowerCase(), 'g');
        const matches = text.match(regex);
        if (matches) {
          score += matches.length;
        }
      });
      
      // Bonus points for articles with images
      if (article.urlToImage) {
        score += 1;
      }
      
      // Bonus points for recent articles (within last 7 days)
      const publishDate = new Date(article.publishedAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 7) {
        score += 2;
      }
      
      return {
        ...article,
        relevanceScore: score
      };
    })
    .filter(article => article.relevanceScore && article.relevanceScore > 0)
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
}

/**
 * Combine articles from multiple sources and filter for relevance
 */
export async function fetchAllDeepFakeNews(): Promise<NewsArticle[]> {
  try {
    const [newsApiArticles, gNewsArticles] = await Promise.all([
      fetchNewsApiArticles(),
      fetchGNewsArticles()
    ]);
    
    const allArticles = [...newsApiArticles, ...gNewsArticles];
    const relevantArticles = filterRelevantArticles(allArticles);
    
    // Remove duplicates based on title or URL
    const uniqueArticles = removeDuplicateArticles(relevantArticles);
    
    return uniqueArticles;
  } catch (error) {
    console.error('Error fetching all DeepFake news:', error);
    return [];
  }
}

/**
 * Remove duplicate articles based on title or URL
 */
function removeDuplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const uniqueUrls = new Set<string>();
  const uniqueTitles = new Set<string>();
  
  return articles.filter(article => {
    const url = article.url.toLowerCase();
    const title = article.title.toLowerCase();
    
    if (uniqueUrls.has(url) || uniqueTitles.has(title)) {
      return false;
    }
    
    uniqueUrls.add(url);
    uniqueTitles.add(title);
    return true;
  });
} 