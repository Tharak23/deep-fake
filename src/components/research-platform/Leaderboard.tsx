'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiMoreVertical, FiTrendingUp, FiStar, FiLoader } from 'react-icons/fi';
import PlaceholderImage from './PlaceholderImage';

type LeaderboardCategory = 'overall' | 'papers' | 'datasets' | 'experiments';

type LeaderboardUser = {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  change: 'up' | 'down' | 'none';
  badge: 'gold' | 'silver' | 'bronze' | null;
};

const Leaderboard = () => {
  const [category, setCategory] = useState<LeaderboardCategory>('overall');
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<Record<LeaderboardCategory, LeaderboardUser[]>>({
    overall: [],
    papers: [],
    datasets: [],
    experiments: []
  });
  
  // Fetch leaderboard data from API
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        // Fetch from API
        const response = await fetch('/api/leaderboard');
        
        if (response.ok) {
          const data = await response.json();
          setLeaderboardData(data);
        } else {
          throw new Error('Failed to fetch leaderboard data');
        }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        // Use placeholder data if there's an error
        setLeaderboardData({
          overall: [
            { id: '1', name: 'Dr. Sarah Chen', avatar: '/placeholders/team-member-1.jpg', score: 1250, change: 'up', badge: 'gold' },
            { id: '3', name: 'Dr. Aisha Patel', avatar: '/placeholders/team-member-3.jpg', score: 1120, change: 'up', badge: 'silver' },
            { id: '2', name: 'Prof. Michael Rodriguez', avatar: '/placeholders/team-member-2.jpg', score: 980, change: 'down', badge: 'bronze' },
            { id: '4', name: 'Dr. James Wilson', avatar: '/placeholders/team-member-4.jpg', score: 840, change: 'up', badge: null },
            { id: '5', name: 'Dr. Emily Zhang', avatar: '/placeholders/team-member-1.jpg', score: 720, change: 'down', badge: null },
          ],
          papers: [
            { id: '2', name: 'Prof. Michael Rodriguez', avatar: '/placeholders/team-member-2.jpg', score: 8, change: 'up', badge: 'gold' },
            { id: '1', name: 'Dr. Sarah Chen', avatar: '/placeholders/team-member-1.jpg', score: 6, change: 'up', badge: 'silver' },
            { id: '4', name: 'Dr. James Wilson', avatar: '/placeholders/team-member-4.jpg', score: 5, change: 'down', badge: 'bronze' },
            { id: '3', name: 'Dr. Aisha Patel', avatar: '/placeholders/team-member-3.jpg', score: 4, change: 'up', badge: null },
            { id: '5', name: 'Dr. Emily Zhang', avatar: '/placeholders/team-member-1.jpg', score: 3, change: 'down', badge: null },
          ],
          datasets: [
            { id: '3', name: 'Dr. Aisha Patel', avatar: '/placeholders/team-member-3.jpg', score: 12, change: 'up', badge: 'gold' },
            { id: '4', name: 'Dr. James Wilson', avatar: '/placeholders/team-member-4.jpg', score: 9, change: 'up', badge: 'silver' },
            { id: '1', name: 'Dr. Sarah Chen', avatar: '/placeholders/team-member-1.jpg', score: 7, change: 'down', badge: 'bronze' },
            { id: '5', name: 'Dr. Emily Zhang', avatar: '/placeholders/team-member-1.jpg', score: 5, change: 'up', badge: null },
            { id: '2', name: 'Prof. Michael Rodriguez', avatar: '/placeholders/team-member-2.jpg', score: 4, change: 'down', badge: null },
          ],
          experiments: [
            { id: '1', name: 'Dr. Sarah Chen', avatar: '/placeholders/team-member-1.jpg', score: 24, change: 'up', badge: 'gold' },
            { id: '3', name: 'Dr. Aisha Patel', avatar: '/placeholders/team-member-3.jpg', score: 18, change: 'up', badge: 'silver' },
            { id: '5', name: 'Dr. Emily Zhang', avatar: '/placeholders/team-member-1.jpg', score: 15, change: 'up', badge: 'bronze' },
            { id: '2', name: 'Prof. Michael Rodriguez', avatar: '/placeholders/team-member-2.jpg', score: 12, change: 'down', badge: null },
            { id: '4', name: 'Dr. James Wilson', avatar: '/placeholders/team-member-4.jpg', score: 10, change: 'down', badge: null },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, []);

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case 'gold':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'silver':
        return 'bg-gray-400/20 text-gray-300 border-gray-400/50';
      case 'bronze':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default:
        return '';
    }
  };

  const getCategoryLabel = () => {
    switch (category) {
      case 'overall':
        return 'Overall Score';
      case 'papers':
        return 'Papers Published';
      case 'datasets':
        return 'Datasets Contributed';
      case 'experiments':
        return 'Experiments Run';
      default:
        return 'Score';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card overflow-hidden"
    >
      <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-[var(--primary)]/20 flex items-center justify-center mr-3">
            <FiAward className="text-[var(--primary)]" size={18} />
          </div>
          <h2 className="text-lg font-bold">Leaderboard</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as LeaderboardCategory)}
            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-md text-sm px-2 py-1 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            aria-label="Leaderboard category"
          >
            <option value="overall">Overall</option>
            <option value="papers">Papers</option>
            <option value="datasets">Datasets</option>
            <option value="experiments">Experiments</option>
          </select>
          
          <button 
            className="p-1 text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="More options"
          >
            <FiMoreVertical size={18} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between text-xs text-gray-400 px-2 pb-2">
          <span>Researcher</span>
          <span>{getCategoryLabel()}</span>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="animate-spin text-[var(--primary)]" size={24} />
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboardData[category].map((researcher, index) => (
              <div 
                key={researcher.id} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === 0 ? 'bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 border border-[var(--primary)]/20' : 'hover:bg-[var(--muted)]/10'
                } transition-colors duration-200`}
              >
                <div className="flex items-center">
                  <div className="w-6 text-center font-medium text-gray-400 mr-2">
                    {index + 1}
                  </div>
                  <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                    <PlaceholderImage
                      text={researcher.name.split(' ')[1]?.[0] + researcher.name.split(' ')[0][0] || researcher.name.substring(0, 2)}
                      width={32}
                      height={32}
                      bgColor="#1e40af"
                      textColor="#ffffff"
                      className="object-cover"
                    />
                    {researcher.badge && (
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border ${getBadgeColor(researcher.badge)} flex items-center justify-center text-[8px]`}>
                        {researcher.badge === 'gold' ? '1' : researcher.badge === 'silver' ? '2' : '3'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm">{researcher.name}</h3>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="font-bold text-white mr-2">
                    {researcher.score}
                  </div>
                  {researcher.change === 'up' ? (
                    <FiTrendingUp className="text-green-500" size={14} />
                  ) : researcher.change === 'down' ? (
                    <FiTrendingUp className="text-red-500 transform rotate-180" size={14} />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-[var(--card-bg)]/50 border-t border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center text-sm">
          <FiStar className="text-[var(--primary)] mr-2" size={16} />
          <span className="text-gray-400">Updated daily</span>
        </div>
        <button className="text-[var(--primary)] hover:text-[var(--secondary)] text-sm transition-colors duration-200">
          View Full Rankings
        </button>
      </div>
    </motion.div>
  );
};

export default Leaderboard; 