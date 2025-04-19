'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { FaCalendarAlt, FaTag, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';

// Define article interface
interface Article {
  _id: string;
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
  relevanceScore: number;
  tags: string[];
}

// Define pagination interface
interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasMore: boolean;
}

// Article card component
const ArticleCard = ({ article }: { article: Article }) => {
  // Determine if the article is from NewsAPI or GNews
  const isNewsApi = article.source.name.includes('NewsAPI');
  const isGNews = article.source.name.includes('GNews');
  
  // Format the source name to remove the API prefix
  const sourceName = article.source.name
    .replace('NewsAPI: ', '')
    .replace('GNews: ', '');
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg hover:scale-[1.01] duration-300">
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        {article.urlToImage ? (
          <Image
            src={article.urlToImage}
            alt={article.title}
            fill
            className="object-cover"
            onError={(e) => {
              // Handle image loading errors
              const target = e.target as HTMLImageElement;
              target.src = '/images/default-article.jpg'; // Fallback image
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-300 dark:bg-gray-700">
            <span className="text-gray-500 dark:text-gray-400">No Image</span>
          </div>
        )}
        
        {/* Source badge */}
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            isNewsApi 
              ? 'bg-blue-600 text-white' 
              : isGNews 
                ? 'bg-green-600 text-white'
                : 'bg-gray-600 text-white'
          }`}>
            {isNewsApi ? 'NewsAPI' : isGNews ? 'GNews' : 'Source'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
            {sourceName}
          </span>
          
          <div className="flex items-center ml-2">
            <FaCalendarAlt className="mr-1" />
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {article.description || 'No description available'}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {article.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded"
            >
              <FaTag className="mr-1" />
              {tag}
            </span>
          ))}
          {article.tags.length > 4 && (
            <span className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
              +{article.tags.length - 4} more
            </span>
          )}
        </div>
        
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          Read full article <FaExternalLinkAlt className="ml-1" />
        </a>
      </div>
    </div>
  );
};

// Skeleton loading component
const ArticleSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
    </div>
  );
};

// Tags filter component
const TagsFilter = ({ 
  tags, 
  selectedTags, 
  onTagToggle 
}: { 
  tags: string[]; 
  selectedTags: string[]; 
  onTagToggle: (tag: string) => void;
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
        Filter by Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTags.includes(tag)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => onTagToggle(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

// Main ArticleList component
export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
    hasMore: false
  });
  const [page, setPage] = useState(1);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'newsapi' | 'gnews'>('all');
  
  // IntersectionObserver hook for infinite scrolling
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  const fetchArticles = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/deepfake-news?page=${page}&limit=${pagination.limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      
      const data = await response.json();
      
      if (page === 1) {
        setArticles(data.articles);
      } else {
        setArticles(prev => [...prev, ...data.articles]);
      }
      
      setPagination({
        total: data.total,
        page: data.page,
        limit: data.limit,
        pages: data.pages,
        hasMore: data.hasMore
      });
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to fetch available tags
  const fetchTags = async () => {
    try {
      const response = await fetch('/api/deepfake-news/tags');
      
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }
      
      const data = await response.json();
      setTags(data.tags);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };
  
  // Handle tag toggle
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
    
    // Reset to first page when filters change
    setPage(1);
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchArticles(1);
  };
  
  // Handle source filter change
  const handleSourceFilterChange = (source: 'all' | 'newsapi' | 'gnews') => {
    setSourceFilter(source);
    setPage(1);
    fetchArticles(1);
  };
  
  // Initial fetch on component mount
  useEffect(() => {
    fetchArticles();
  }, []);
  
  // Fetch more articles when user scrolls to the bottom
  useEffect(() => {
    if (inView && pagination.hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchArticles(nextPage);
    }
  }, [inView, pagination.hasMore, loading, page]);
  
  // Fetch articles when filters change
  useEffect(() => {
    if (selectedTags.length > 0 || searchQuery) {
      setPage(1);
      fetchArticles(1);
    }
  }, [selectedTags, searchQuery]);
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FiAlertCircle className="text-4xl text-red-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => fetchArticles()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <FiLoader className="text-4xl text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="flex-grow px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
        
        {/* Source filter */}
        <div className="mb-4">
          <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
            Filter by Source
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                sourceFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => handleSourceFilterChange('all')}
            >
              All Sources
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                sourceFilter === 'newsapi'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => handleSourceFilterChange('newsapi')}
            >
              NewsAPI
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                sourceFilter === 'gnews'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => handleSourceFilterChange('gnews')}
            >
              GNews
            </button>
          </div>
        </div>
        
        {/* Tags filter */}
        {tags.length > 0 && (
          <TagsFilter
            tags={tags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />
        )}
      </div>
      
      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
        
        {/* Loading skeletons */}
        {loading && Array.from({ length: 3 }).map((_, index) => (
          <ArticleSkeleton key={index} />
        ))}
      </div>
      
      {/* No results message */}
      {!loading && articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No articles found. Try adjusting your filters.
          </p>
        </div>
      )}
      
      {/* Load more trigger */}
      {pagination.hasMore && (
        <div className="col-span-full flex justify-center p-4">
          <button
            onClick={() => fetchArticles(pagination.page + 1)}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <FiLoader className="animate-spin" />
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
} 