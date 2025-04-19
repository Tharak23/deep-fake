'use client';

import { useState, useEffect } from 'react';
import { FaSync, FaCalendarCheck, FaChartBar, FaSpinner } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiRefreshCw, FiLoader, FiAlertCircle, FiCheck, FiList, FiTag, FiCalendar, FiClock, FiEdit, FiTrash, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface StatsData {
  total: number;
  published: number;
  unpublished: number;
  relevance: {
    avgRelevance: number;
    maxRelevance: number;
    minRelevance: number;
  };
  topSources: Array<{ _id: string; count: number }>;
  topTags: Array<{ _id: string; count: number }>;
}

interface ActionResult {
  operation?: string;
  total?: number;
  new?: number;
  duplicates?: number;
  scheduled?: number;
  error?: string;
}

// Add this new section for scheduled articles
const ScheduledArticlesSection = () => {
  const [scheduledArticles, setScheduledArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch scheduled articles
  const fetchScheduledArticles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/scheduled-articles');
      
      if (!response.ok) {
        throw new Error('Failed to fetch scheduled articles');
      }
      
      const data = await response.json();
      setScheduledArticles(data.articles || []);
    } catch (error) {
      console.error('Error fetching scheduled articles:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch scheduled articles on component mount
  useEffect(() => {
    fetchScheduledArticles();
  }, []);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
  return (
    <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Scheduled Articles</h2>
        
        <button
          onClick={fetchScheduledArticles}
          disabled={loading}
          className="flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? (
            <FiLoader className="animate-spin mr-1" />
          ) : (
            <FiRefreshCw className="mr-1" />
          )}
          Refresh
        </button>
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-4 flex items-center">
          <FiAlertCircle className="text-red-500 mr-2" size={20} />
          <p className="text-red-200">{error}</p>
        </div>
      )}
      
      {loading && !scheduledArticles.length ? (
        <div className="flex justify-center py-8">
          <FiLoader className="animate-spin text-[var(--primary)]" size={32} />
        </div>
      ) : scheduledArticles.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No scheduled articles found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-800 text-gray-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Scheduled Time</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {scheduledArticles.map((item) => (
                <tr 
                  key={item.article._id} 
                  className="border-b border-gray-700 hover:bg-gray-800"
                >
                  <td className="px-4 py-3">
                    <div className="line-clamp-1">{item.article.title}</div>
                  </td>
                  <td className="px-4 py-3">
                    {item.article.source.name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-[var(--primary)]" />
                      {formatDate(item.scheduledTime)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-900/50 text-yellow-300">
                      Scheduled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Add this new section for scheduling articles
const ScheduleArticleSection = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [scheduledTime, setScheduledTime] = useState(new Date());
  const [scheduling, setScheduling] = useState(false);
  
  // Fetch unpublished articles
  const fetchUnpublishedArticles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/deepfake-news?published=false&sortBy=relevanceScore&sortOrder=desc&limit=20');
      
      if (!response.ok) {
        throw new Error('Failed to fetch unpublished articles');
      }
      
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Error fetching unpublished articles:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch unpublished articles on component mount
  useEffect(() => {
    fetchUnpublishedArticles();
  }, []);
  
  // Handle article selection
  const handleArticleSelect = (article: any) => {
    setSelectedArticle(article);
  };
  
  // Handle scheduling
  const handleScheduleArticle = async () => {
    if (!selectedArticle) {
      toast.error('Please select an article to schedule');
      return;
    }
    
    setScheduling(true);
    
    try {
      const response = await fetch('/api/scheduled-articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId: selectedArticle._id,
          publishTime: scheduledTime,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to schedule article');
      }
      
      const data = await response.json();
      toast.success(data.message || 'Article scheduled successfully');
      
      // Reset form
      setSelectedArticle(null);
      setScheduledTime(new Date());
      
      // Refresh unpublished articles
      fetchUnpublishedArticles();
    } catch (error) {
      console.error('Error scheduling article:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to schedule article');
    } finally {
      setScheduling(false);
    }
  };
  
  return (
    <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Schedule Article</h2>
      
      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-4 flex items-center">
          <FiAlertCircle className="text-red-500 mr-2" size={20} />
          <p className="text-red-200">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Select Article</h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <FiLoader className="animate-spin text-[var(--primary)]" size={32} />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No unpublished articles found.
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto pr-2">
              {articles.map((article) => (
                <div 
                  key={article._id}
                  onClick={() => handleArticleSelect(article)}
                  className={`p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                    selectedArticle?._id === article._id
                      ? 'bg-blue-900/30 border border-blue-700'
                      : 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <h4 className="font-medium text-white line-clamp-2">{article.title}</h4>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <span className="mr-2">{article.source.name}</span>
                    <span>Score: {article.relevanceScore}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Schedule Time</h3>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Selected Article
              </label>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 min-h-[60px]">
                {selectedArticle ? (
                  <div>
                    <h4 className="font-medium text-white">{selectedArticle.title}</h4>
                    <div className="text-xs text-gray-400 mt-1">
                      {selectedArticle.source.name}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">No article selected</div>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Publish Date & Time
              </label>
              <DatePicker
                selected={scheduledTime}
                onChange={(date) => setScheduledTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
              />
            </div>
            
            <button
              onClick={handleScheduleArticle}
              disabled={!selectedArticle || scheduling}
              className="w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
            >
              {scheduling ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Scheduling...
                </>
              ) : (
                <>
                  <FiClock className="mr-2" />
                  Schedule Article
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this new section for fetching and scheduling articles
const FetchAndScheduleSection = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const handleFetchAndSchedule = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/cron/deepfake-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch and schedule articles');
      }
      
      const data = await response.json();
      setResult(data);
      toast.success(data.message || 'Successfully fetched and scheduled articles');
    } catch (error) {
      console.error('Error fetching and scheduling articles:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast.error('Failed to fetch and schedule articles');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Fetch & Schedule Articles</h2>
      
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <button
            onClick={handleFetchAndSchedule}
            disabled={loading}
            className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Fetching & Scheduling...
              </>
            ) : (
              <>
                <FiRefreshCw className="mr-2" />
                Fetch & Schedule Articles
              </>
            )}
          </button>
          
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            This will fetch new articles from News API and GNews API, and schedule them for publishing.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" size={20} />
            <p className="text-red-200">{error}</p>
          </div>
        )}
        
        {result && (
          <div className="bg-green-900/30 border border-green-800 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <FiCheck className="text-green-500 mr-2" size={20} />
              <p className="text-green-200 font-medium">{result.message}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-4">
                <div className="flex items-center text-[var(--primary)] mb-2">
                  <FiList className="mr-2" />
                  <span className="font-medium">Total Articles</span>
                </div>
                <p className="text-2xl font-bold text-white">{result.total}</p>
              </div>
              
              <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-4">
                <div className="flex items-center text-[var(--primary)] mb-2">
                  <FiCalendar className="mr-2" />
                  <span className="font-medium">Scheduled</span>
                </div>
                <p className="text-2xl font-bold text-white">{result.scheduled}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { user, status } = useAuth();
  const router = useRouter();
  
  // Check if user is admin
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <FiLoader className="animate-spin text-[var(--primary)]" size={48} />
      </div>
    );
  }
  
  if (!user || user.role !== 'admin') {
    // Redirect to home if not admin
    router.push('/');
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">
          DeepFake News Admin
        </h1>
      </div>
      
      <FetchAndScheduleSection />
      <ScheduledArticlesSection />
      <ScheduleArticleSection />
      
      {/* Existing sections */}
      {/* ... */}
    </div>
  );
} 