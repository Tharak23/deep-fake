'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUpload, 
  FiDatabase, 
  FiCode, 
  FiClock, 
  FiUser, 
  FiMoreVertical,
  FiDownload
} from 'react-icons/fi';
import { BiBrain } from 'react-icons/bi';

type UploadType = 'all' | 'datasets' | 'models';

const RecentUploads = () => {
  const [activeTab, setActiveTab] = useState<UploadType>('all');
  
  // Mock data for recent uploads
  const uploads = [
    {
      id: 1,
      name: 'FakeVoice-2023 Dataset',
      type: 'dataset',
      size: '2.4 GB',
      uploadedBy: 'Dr. Aisha Patel',
      timestamp: '2 hours ago',
      category: 'Audio',
    },
    {
      id: 2,
      name: 'DeepFake-Transformer-v3',
      type: 'model',
      size: '850 MB',
      uploadedBy: 'Dr. Sarah Chen',
      timestamp: '5 hours ago',
      category: 'Vision',
    },
    {
      id: 3,
      name: 'Political Figures Dataset',
      type: 'dataset',
      size: '4.1 GB',
      uploadedBy: 'Prof. Michael Rodriguez',
      timestamp: '1 day ago',
      category: 'Video',
    },
    {
      id: 4,
      name: 'Audio-GAN Detector',
      type: 'model',
      size: '1.2 GB',
      uploadedBy: 'Dr. James Wilson',
      timestamp: '2 days ago',
      category: 'Audio',
    },
    {
      id: 5,
      name: 'Celebrity Faces 2023',
      type: 'dataset',
      size: '3.7 GB',
      uploadedBy: 'Dr. Sarah Chen',
      timestamp: '3 days ago',
      category: 'Image',
    },
  ];

  const filteredUploads = activeTab === 'all' 
    ? uploads 
    : uploads.filter(upload => upload.type === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="card overflow-hidden"
    >
      <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-[var(--secondary)]/20 flex items-center justify-center mr-3">
            <FiUpload className="text-[var(--secondary)]" size={18} />
          </div>
          <h2 className="text-lg font-bold">Recent Uploads</h2>
        </div>
        
        <button 
          className="p-1 text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="More options"
        >
          <FiMoreVertical size={18} />
        </button>
      </div>
      
      <div className="flex border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors duration-200 ${
            activeTab === 'all'
              ? 'text-[var(--secondary)] border-b-2 border-[var(--secondary)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('datasets')}
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors duration-200 ${
            activeTab === 'datasets'
              ? 'text-[var(--secondary)] border-b-2 border-[var(--secondary)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Datasets
        </button>
        <button
          onClick={() => setActiveTab('models')}
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors duration-200 ${
            activeTab === 'models'
              ? 'text-[var(--secondary)] border-b-2 border-[var(--secondary)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Models
        </button>
      </div>
      
      <div className="divide-y divide-[var(--border)]">
        {filteredUploads.map((upload) => (
          <div key={upload.id} className="p-4 hover:bg-[var(--muted)]/10 transition-colors duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {upload.type === 'dataset' ? (
                    <FiDatabase className="text-blue-400" size={18} />
                  ) : (
                    <BiBrain className="text-purple-400" size={18} />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-white">{upload.name}</h3>
                  <div className="flex items-center text-xs text-gray-400 mt-1 space-x-4">
                    <span className="flex items-center">
                      <FiClock className="mr-1" size={12} />
                      {upload.timestamp}
                    </span>
                    <span className="flex items-center">
                      <FiUser className="mr-1" size={12} />
                      {upload.uploadedBy}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  upload.type === 'dataset' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {upload.category}
                </span>
                <span className="text-xs text-gray-400">{upload.size}</span>
                <button 
                  className="p-1 text-gray-400 hover:text-[var(--secondary)] transition-colors duration-200"
                  aria-label="Download"
                >
                  <FiDownload size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-[var(--card-bg)]/50 border-t border-[var(--border)] text-center">
        <button className="text-[var(--secondary)] hover:text-[var(--primary)] text-sm transition-colors duration-200">
          View All Uploads
        </button>
      </div>
    </motion.div>
  );
};

export default RecentUploads; 