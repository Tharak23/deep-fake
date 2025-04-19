'use client';

import { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiCheckCircle, 
  FiFileText, 
  FiDatabase,
  FiActivity,
  FiAlertCircle,
  FiClock
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Mock data for demo purposes
const activityData = [
  { name: 'Jan', uploads: 12, verifications: 5, blogs: 8 },
  { name: 'Feb', uploads: 19, verifications: 7, blogs: 12 },
  { name: 'Mar', uploads: 15, verifications: 10, blogs: 15 },
  { name: 'Apr', uploads: 25, verifications: 12, blogs: 17 },
  { name: 'May', uploads: 32, verifications: 15, blogs: 19 },
  { name: 'Jun', uploads: 28, verifications: 20, blogs: 22 },
];

const userGrowthData = [
  { name: 'Jan', users: 120 },
  { name: 'Feb', users: 175 },
  { name: 'Mar', users: 230 },
  { name: 'Apr', users: 310 },
  { name: 'May', users: 420 },
  { name: 'Jun', users: 510 },
];

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedResearchers: 0,
    pendingVerifications: 0,
    blogPosts: 0,
    datasets: 0,
    weeklyActivity: 0
  });

  useEffect(() => {
    // In a real app, you would fetch these stats from the server
    // For now, let's use dummy data
    setStats({
      totalUsers: 512,
      verifiedResearchers: 87,
      pendingVerifications: 14,
      blogPosts: 126,
      datasets: 64,
      weeklyActivity: 92
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-md bg-indigo-900/30 mr-3">
              <FiUsers className="text-indigo-400" size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Total Users</h3>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
            <div className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">
              +8% this month
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-md bg-green-900/30 mr-3">
              <FiCheckCircle className="text-green-400" size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Verified Researchers</h3>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-white">{stats.verifiedResearchers}</div>
            <div className="text-xs text-indigo-400 bg-indigo-900/30 px-2 py-1 rounded">
              {Math.round((stats.verifiedResearchers / stats.totalUsers) * 100)}% of users
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-md bg-amber-900/30 mr-3">
              <FiClock className="text-amber-400" size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Pending Verifications</h3>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-white">{stats.pendingVerifications}</div>
            <div className="text-xs text-amber-400 bg-amber-900/30 px-2 py-1 rounded">
              Requires attention
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-md bg-purple-900/30 mr-3">
              <FiFileText className="text-purple-400" size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Blog Posts</h3>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-white">{stats.blogPosts}</div>
            <div className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">
              +5 this week
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-md bg-blue-900/30 mr-3">
              <FiDatabase className="text-blue-400" size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Datasets</h3>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-white">{stats.datasets}</div>
            <div className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
              +3 this week
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-md bg-cyan-900/30 mr-3">
              <FiActivity className="text-cyan-400" size={20} />
            </div>
            <h3 className="text-lg font-medium text-white">Weekly Activity</h3>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-white">{stats.weeklyActivity}</div>
            <div className="text-xs text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded">
              Actions/uploads
            </div>
          </div>
        </div>
      </div>
      
      {/* Alerts */}
      <div className="bg-red-900/20 border border-red-900/40 rounded-lg p-4 flex items-start">
        <FiAlertCircle className="text-red-400 mr-3 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <h3 className="font-medium text-white">Action Required</h3>
          <p className="text-gray-400 text-sm mt-1">
            {stats.pendingVerifications} researchers are awaiting verification. Please review their applications in the Researcher Verification section.
          </p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
          <h3 className="text-lg font-medium text-white mb-4">Platform Activity</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activityData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151',
                    color: '#F9FAFB'
                  }} 
                />
                <Bar dataKey="uploads" name="Dataset Uploads" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="verifications" name="Verifications" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="blogs" name="Blog Posts" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
          <h3 className="text-lg font-medium text-white mb-4">User Growth</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={userGrowthData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151',
                    color: '#F9FAFB'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  name="Total Users"
                  stroke="#6366F1" 
                  strokeWidth={2}
                  dot={{ stroke: '#6366F1', strokeWidth: 2, r: 4, fill: '#111827' }}
                  activeDot={{ stroke: '#6366F1', strokeWidth: 2, r: 6, fill: '#111827' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
        <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="border-l-2 border-indigo-500 pl-4 pb-1">
            <div className="text-sm text-gray-400">1 hour ago</div>
            <div className="text-white mt-1">New researcher application from <span className="text-indigo-400">John Doe</span></div>
          </div>
          <div className="border-l-2 border-green-500 pl-4 pb-1">
            <div className="text-sm text-gray-400">3 hours ago</div>
            <div className="text-white mt-1">Researcher <span className="text-green-400">Alice Johnson</span> was verified</div>
          </div>
          <div className="border-l-2 border-blue-500 pl-4 pb-1">
            <div className="text-sm text-gray-400">5 hours ago</div>
            <div className="text-white mt-1">New dataset uploaded by <span className="text-blue-400">William Brown</span></div>
          </div>
          <div className="border-l-2 border-purple-500 pl-4 pb-1">
            <div className="text-sm text-gray-400">12 hours ago</div>
            <div className="text-white mt-1">New blog post published by <span className="text-purple-400">Emma Wilson</span></div>
          </div>
          <div className="border-l-2 border-red-500 pl-4 pb-1">
            <div className="text-sm text-gray-400">1 day ago</div>
            <div className="text-white mt-1">User <span className="text-red-400">Robert Smith</span> was flagged for suspicious activity</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 