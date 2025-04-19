'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiArrowUp, FiArrowDown, FiMoreVertical } from 'react-icons/fi';
import PlaceholderImage from './PlaceholderImage';

const TeamContributions = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  
  // Mock data for team contributions
  const teamMembers = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      role: 'Lead Researcher',
      avatar: '/placeholders/team-member-1.jpg',
      papers: 3,
      datasets: 2,
      experiments: 8,
      trend: 'up',
      percentage: 12,
    },
    {
      id: 2,
      name: 'Prof. Michael Rodriguez',
      role: 'Research Director',
      avatar: '/placeholders/team-member-2.jpg',
      papers: 2,
      datasets: 1,
      experiments: 5,
      trend: 'up',
      percentage: 8,
    },
    {
      id: 3,
      name: 'Dr. Aisha Patel',
      role: 'Audio Analysis Specialist',
      avatar: '/placeholders/team-member-3.jpg',
      papers: 1,
      datasets: 4,
      experiments: 12,
      trend: 'up',
      percentage: 15,
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      role: 'Video Forensics Expert',
      avatar: '/placeholders/team-member-4.jpg',
      papers: 2,
      datasets: 3,
      experiments: 7,
      trend: 'down',
      percentage: 3,
    },
  ];

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
          <h2 className="text-lg font-bold">Team Contributions</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'quarter')}
            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-md text-sm px-2 py-1 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--secondary)]"
            aria-label="Time range"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          
          <button 
            className="p-1 text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="More options"
          >
            <FiMoreVertical size={18} />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <PlaceholderImage
                    text={member.name.split(' ')[1][0] + member.name.split(' ')[0][0]}
                    width={40}
                    height={40}
                    bgColor="#1e40af"
                    textColor="#ffffff"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-white">{member.name}</h3>
                  <p className="text-gray-400 text-xs">{member.role}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{member.papers}</p>
                  <p className="text-gray-400 text-xs">Papers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{member.datasets}</p>
                  <p className="text-gray-400 text-xs">Datasets</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{member.experiments}</p>
                  <p className="text-gray-400 text-xs">Experiments</p>
                </div>
                <div className="flex items-center">
                  {member.trend === 'up' ? (
                    <div className="flex items-center text-green-500">
                      <FiArrowUp size={14} className="mr-1" />
                      <span>{member.percentage}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <FiArrowDown size={14} className="mr-1" />
                      <span>{member.percentage}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-[var(--card-bg)]/50 border-t border-[var(--border)] text-center">
        <button className="text-[var(--secondary)] hover:text-[var(--primary)] text-sm transition-colors duration-200">
          View All Team Members
        </button>
      </div>
    </motion.div>
  );
};

export default TeamContributions; 