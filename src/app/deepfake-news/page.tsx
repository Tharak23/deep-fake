'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ArticleList from '@/components/DeepFakeNews/ArticleList';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiEdit3, FiClock, FiUser, FiTag, FiMessageCircle, FiThumbsUp, FiShare2, FiPlus, FiLoader, FiAlertCircle, FiRss, FiRefreshCw, FiCalendar } from 'react-icons/fi';
import { RiAiGenerate } from 'react-icons/ri';
import Link from 'next/link';
import toast from 'react-hot-toast';

type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
  tags: string[];
  likes: number;
  comments: number;
  image?: string;
};

export default function DeepFakeNewsPage() {
  const { user, status } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'news' | 'blog' | 'scheduled'>('news');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canCreatePost, setCanCreatePost] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshingNews, setRefreshingNews] = useState(false);
  const [scheduledArticles, setScheduledArticles] = useState([]);
  const [loadingScheduled, setLoadingScheduled] = useState(false);

  useEffect(() => {
    // Check URL parameters for tab and action
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    const actionParam = searchParams.get('action');
    
    // If tab parameter exists, set the active tab
    if (tabParam === 'blog') {
      setActiveTab('blog');
      
      // If action is 'create', trigger the create post function
      if (actionParam === 'create' && user?.blogEnabled) {
        router.push('/blog/create');
      }
    } else if (tabParam === 'scheduled') {
      setActiveTab('scheduled');
    }
    
    if (activeTab === 'blog') {
      const fetchBlogPosts = async () => {
        setLoading(true);
        try {
          // Fetch blog posts from API
          const response = await fetch('/api/blog');
          
          if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
          }
          
          const data = await response.json();
          setBlogPosts(data.posts);
        } catch (error) {
          console.error('Error fetching blog posts:', error);
          setError('Failed to load blog posts. Please try again later.');
          
          // Use placeholder data if there's an error
          setBlogPosts([
            {
              id: 'placeholder-1',
              title: 'Advancements in Deepfake Detection Algorithms',
              content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              excerpt: 'Recent advancements in deepfake detection algorithms have shown promising results in identifying manipulated media with high accuracy.',
              author: {
                id: 'author-1',
                name: 'Dr. Sarah Chen',
                image: '/placeholders/team-member-1.jpg'
              },
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              tags: ['AI', 'Deepfake', 'Computer Vision'],
              likes: 42,
              comments: 8,
              image: '/placeholders/blog-1.jpg'
            },
            {
              id: 'placeholder-2',
              title: 'Ethical Implications of Synthetic Media Generation',
              content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              excerpt: 'As synthetic media becomes more prevalent, researchers are exploring the ethical implications and potential societal impacts.',
              author: {
                id: 'author-2',
                name: 'Prof. Michael Rodriguez',
                image: '/placeholders/team-member-2.jpg'
              },
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              tags: ['Ethics', 'AI', 'Society'],
              likes: 37,
              comments: 12,
              image: '/placeholders/blog-2.jpg'
            }
          ]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchBlogPosts();
    } else if (activeTab === 'scheduled') {
      fetchScheduledArticles();
    }
    
    // Check if user can create posts
    if (user && user.blogEnabled) {
      setCanCreatePost(true);
    } else {
      setCanCreatePost(false);
    }

    // Check if user is admin
    if (user && user.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user, activeTab, router]);
  
  const handleCreatePost = () => {
    if (!user) {
      router.push('/auth/signin?callbackUrl=/deepfake-news?tab=blog&action=create');
      return;
    }
    
    if (!user.blogEnabled) {
      router.push('/profile');
      return;
    }
    
    router.push('/blog/create');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRefreshNews = async () => {
    if (!isAdmin) return;
    
    setRefreshingNews(true);
    try {
      const response = await fetch('/api/deepfake-news/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh news');
      }
      
      const data = await response.json();
      toast.success(data.message || 'Successfully refreshed news articles');
      
      // Reload the page to show new articles
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing news:', error);
      toast.error('Failed to refresh news articles. Please try again later.');
    } finally {
      setRefreshingNews(false);
    }
  };

  const fetchScheduledArticles = async () => {
    if (!isAdmin) return;
    
    setLoadingScheduled(true);
    try {
      const response = await fetch('/api/scheduled-articles');
      
      if (!response.ok) {
        throw new Error('Failed to fetch scheduled articles');
      }
      
      const data = await response.json();
      setScheduledArticles(data.articles || []);
    } catch (error) {
      console.error('Error fetching scheduled articles:', error);
      toast.error('Failed to fetch scheduled articles');
    } finally {
      setLoadingScheduled(false);
    }
  };

  const renderBlogPosts = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="animate-spin text-[var(--primary)]" size={32} />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Link 
            href={`/blog/${post.id}`} 
            key={post.id}
            className="bg-[var(--card-bg)] rounded-lg overflow-hidden border border-[var(--border)] hover:border-[var(--primary)]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/10 flex flex-col h-full"
          >
            <div className="h-48 overflow-hidden relative">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ 
                  backgroundImage: post.image 
                    ? `url(${post.image})` 
                    : 'linear-gradient(to right, var(--primary), var(--accent))'
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center text-xs text-gray-300">
                  <FiClock className="mr-1" size={12} />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="p-5 flex-grow">
              <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">{post.title}</h2>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="border-t border-[var(--border)] p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--muted)] mr-2">
                  {post.author.image ? (
                    <img 
                      src={post.author.image} 
                      alt={post.author.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white text-xs">
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-300">{post.author.name}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-400">
                <div className="flex items-center">
                  <FiThumbsUp size={14} className="mr-1" />
                  <span className="text-xs">{post.likes}</span>
                </div>
                <div className="flex items-center">
                  <FiMessageCircle size={14} className="mr-1" />
                  <span className="text-xs">{post.comments}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  const renderScheduledArticles = () => {
    if (loadingScheduled) {
      return (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="animate-spin text-[var(--primary)]" size={32} />
        </div>
      );
    }

    if (!isAdmin) {
      return (
        <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-6 mb-6 flex flex-col items-center">
          <FiAlertCircle className="text-blue-500 mb-2" size={32} />
          <p className="text-blue-200 text-center">Admin access required to view scheduled articles.</p>
        </div>
      );
    }

    if (scheduledArticles.length === 0) {
      return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6 flex flex-col items-center">
          <FiCalendar className="text-gray-400 mb-2" size={32} />
          <p className="text-gray-300 text-center">No scheduled articles found.</p>
          <Link 
            href="/admin/news" 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
          >
            Go to Admin Dashboard
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Upcoming Articles</h2>
          <button
            onClick={fetchScheduledArticles}
            disabled={loadingScheduled}
            className="flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
          >
            {loadingScheduled ? (
              <FiLoader className="animate-spin mr-1" />
            ) : (
              <FiRefreshCw className="mr-1" />
            )}
            Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scheduledArticles.map((item) => (
            <div 
              key={item.article._id}
              className="bg-[var(--card-bg)] rounded-lg overflow-hidden border border-[var(--border)] hover:border-[var(--primary)]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/10 flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden relative">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ 
                    backgroundImage: item.article.urlToImage 
                      ? `url(${item.article.urlToImage})` 
                      : 'linear-gradient(to right, var(--primary), var(--accent))'
                  }}
                />
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-900/50 text-yellow-300">
                    Scheduled
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center text-xs text-gray-300">
                    <FiClock className="mr-1" size={12} />
                    <span>{new Date(item.scheduledTime).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-5 flex-grow">
                <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">{item.article.title}</h2>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{item.article.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.article.tags && item.article.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-[var(--border)] p-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-300">{item.article.source.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">
              DeepFake News & Info
            </h1>
            
            <div className="flex space-x-3">
              {isAdmin && activeTab === 'news' && (
                <button
                  onClick={handleRefreshNews}
                  disabled={refreshingNews}
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
                >
                  {refreshingNews ? (
                    <FiLoader className="animate-spin mr-2" />
                  ) : (
                    <FiRefreshCw className="mr-2" />
                  )}
                  Refresh News
                </button>
              )}
              
              {activeTab === 'blog' && (
                <button
                  onClick={handleCreatePost}
                  disabled={!canCreatePost}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    canCreatePost
                      ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white hover:opacity-90 shadow-lg hover:shadow-[var(--primary)]/20'
                      : 'bg-gray-700 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <FiEdit3 className="mr-2" />
                  {canCreatePost ? 'Create Post' : 'Login to Post'}
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] mb-8">
            <div className="flex border-b border-[var(--border)]">
              <button
                onClick={() => setActiveTab('news')}
                className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-all duration-300 ${
                  activeTab === 'news'
                    ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <FiRss className="inline-block mr-2" />
                Latest News
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-all duration-300 ${
                  activeTab === 'blog'
                    ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <FiEdit3 className="inline-block mr-2" />
                Blog Posts
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('scheduled')}
                  className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-all duration-300 ${
                    activeTab === 'scheduled'
                      ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <FiCalendar className="inline-block mr-2" />
                  Scheduled
                </button>
              )}
            </div>
          </div>
          
          {activeTab === 'news' ? (
            <ArticleList />
          ) : activeTab === 'blog' ? (
            <div className="space-y-8">
              {error && (
                <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6 flex items-center">
                  <FiAlertCircle className="text-red-500 mr-2" size={20} />
                  <p className="text-red-200">{error}</p>
                </div>
              )}
              
              {renderBlogPosts()}
            </div>
          ) : (
            renderScheduledArticles()
          )}
        </div>
      </div>
      <Footer />
    </>
  );
} 