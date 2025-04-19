'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiRefreshCw, FiLoader, FiAlertCircle, FiCheck, FiList, FiTag, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminNewsPage() {
  const { user, status } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user is admin
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] flex items-center justify-center">
        <FiLoader className="animate-spin text-[var(--primary)]" size={48} />
      </div>
    );
  }
  
  if (!user || user.role !== 'admin') {
    // Redirect to home if not admin
    router.push('/');
    return null;
  }
  
  const handleFetchArticles = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/deepfake-news/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      
      const data = await response.json();
      setResult(data);
      toast.success(data.message || 'Successfully fetched and updated articles');
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast.error('Failed to fetch articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">
              News Admin
            </h1>
          </div>
          
          <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Manage News Articles</h2>
            
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <button
                  onClick={handleFetchArticles}
                  disabled={loading}
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Fetching Articles...
                    </>
                  ) : (
                    <>
                      <FiRefreshCw className="mr-2" />
                      Fetch & Update Articles
                    </>
                  )}
                </button>
                
                <p className="text-gray-400 text-sm mt-2 md:mt-0">
                  This will fetch new articles from News API and GNews API, and publish relevant ones.
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-4">
                      <div className="flex items-center text-[var(--primary)] mb-2">
                        <FiList className="mr-2" />
                        <span className="font-medium">Total Articles</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{result.total}</p>
                    </div>
                    
                    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-4">
                      <div className="flex items-center text-[var(--primary)] mb-2">
                        <FiTag className="mr-2" />
                        <span className="font-medium">New Articles</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{result.new}</p>
                    </div>
                    
                    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-4">
                      <div className="flex items-center text-[var(--primary)] mb-2">
                        <FiCalendar className="mr-2" />
                        <span className="font-medium">Published</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{result.published}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 