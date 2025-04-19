'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiBookOpen, 
  FiDatabase, 
  FiMoreVertical, 
  FiExternalLink,
  FiAward,
  FiLoader,
  FiAlertCircle
} from 'react-icons/fi';
import PlaceholderImage from './PlaceholderImage';
import Link from 'next/link';

type ResearcherLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

type Researcher = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
  roadmapProgress: number;
  roadmapLevel: ResearcherLevel;
  blogPosts: number;
  datasets: number;
  createdAt: string;
};

const ResearchersList = () => {
  const [sortBy, setSortBy] = useState<'contributions' | 'progress' | 'recent'>('contributions');
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchResearchers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch from the API
        const response = await fetch('/api/research-platform/researchers');
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        if (data.researchers && Array.isArray(data.researchers)) {
          setResearchers(data.researchers);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (error) {
        console.error('Error fetching researchers:', error);
        setError('Failed to load researchers data');
        // No mock data fallback - we'll show the error state instead
        setResearchers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResearchers();
  }, []);
  
  const sortedResearchers = [...researchers].sort((a, b) => {
    if (sortBy === 'contributions') {
      const aTotal = a.blogPosts + a.datasets;
      const bTotal = b.blogPosts + b.datasets;
      return bTotal - aTotal;
    } else if (sortBy === 'progress') {
      return b.roadmapProgress - a.roadmapProgress;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
  
  const getLevelColor = (level: ResearcherLevel) => {
    switch (level) {
      case 'Beginner':
        return 'bg-blue-900/20 text-blue-400 border-blue-700/50';
      case 'Intermediate':
        return 'bg-green-900/20 text-green-400 border-green-700/50';
      case 'Advanced':
        return 'bg-purple-900/20 text-purple-400 border-purple-700/50';
      case 'Expert':
        return 'bg-amber-900/20 text-amber-400 border-amber-700/50';
      default:
        return 'bg-gray-900/20 text-gray-400 border-gray-700/50';
    }
  };
  
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card overflow-hidden"
    >
      <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-[var(--primary)]/20 flex items-center justify-center mr-3">
            <FiUsers className="text-[var(--primary)]" size={18} />
          </div>
          <h2 className="text-lg font-bold">Verified Researchers</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'contributions' | 'progress' | 'recent')}
            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-md text-sm px-2 py-1 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--secondary)]"
            aria-label="Sort researchers by"
          >
            <option value="contributions">Most Contributions</option>
            <option value="progress">Highest Progress</option>
            <option value="recent">Recently Verified</option>
          </select>
        </div>
      </div>
      
      {loading && (
        <div className="p-12 flex justify-center items-center">
          <FiLoader className="animate-spin text-[var(--primary)] mr-3" size={24} />
          <p className="text-gray-400">Loading researchers...</p>
        </div>
      )}
      
      {error && (
        <div className="p-6 flex items-start bg-red-900/10 border-b border-red-900/30">
          <FiAlertCircle className="text-red-400 mt-1 mr-3 flex-shrink-0" size={20} />
          <p className="text-red-300">{error}</p>
        </div>
      )}
      
      {!loading && !error && researchers.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-400">No verified researchers found.</p>
        </div>
      )}
      
      {!loading && !error && researchers.length > 0 && (
        <div className="p-6">
          <div className="space-y-6">
            {sortedResearchers.map((researcher) => (
              <div key={researcher.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800/50 hover:bg-gray-900/50 transition-colors">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    {researcher.avatar ? (
                      <img 
                        src={researcher.avatar} 
                        alt={researcher.name} 
                        className="w-12 h-12 object-cover"
                      />
                    ) : (
                      <PlaceholderImage
                        text={researcher.name.split(' ')[1]?.[0] + researcher.name.split(' ')[0][0]}
                        width={48}
                        height={48}
                        bgColor="#1e40af"
                        textColor="#ffffff"
                        className="object-cover"
                      />
                    )}
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                      <FiAward size={10} className="text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-white flex items-center">
                      {researcher.name}
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${getLevelColor(researcher.roadmapLevel)}`}>
                        {researcher.roadmapLevel}
                      </span>
                    </h3>
                    <div className="mt-1 flex items-center">
                      <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getProgressColor(researcher.roadmapProgress)}`}
                          style={{ width: `${researcher.roadmapProgress}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-400">{researcher.roadmapProgress}% Complete</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{researcher.blogPosts}</p>
                    <p className="text-gray-400 text-xs flex items-center justify-center">
                      <FiBookOpen className="mr-1" size={12} />
                      Blog Posts
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{researcher.datasets}</p>
                    <p className="text-gray-400 text-xs flex items-center justify-center">
                      <FiDatabase className="mr-1" size={12} />
                      Datasets
                    </p>
                  </div>
                  <Link 
                    href={`/profile/${researcher.id}`}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    aria-label={`View ${researcher.name}'s profile`}
                  >
                    <FiExternalLink size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-4 bg-[var(--card-bg)]/50 border-t border-[var(--border)] text-center">
        <Link href="/researchers" className="text-[var(--secondary)] hover:text-[var(--primary)] text-sm transition-colors duration-200">
          View All Verified Researchers
        </Link>
      </div>
    </motion.div>
  );
};

export default ResearchersList; 