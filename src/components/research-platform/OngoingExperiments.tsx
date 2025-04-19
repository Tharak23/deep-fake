'use client';

import { motion } from 'framer-motion';
import { 
  FiActivity, 
  FiMoreVertical, 
  FiClock, 
  FiUser, 
  FiBarChart2,
  FiCheckCircle,
  FiAlertCircle,
  FiPlayCircle
} from 'react-icons/fi';

const OngoingExperiments = () => {
  // Mock data for ongoing experiments
  const experiments = [
    {
      id: 1,
      name: 'Facial Manipulation Detection v4',
      status: 'running',
      progress: 68,
      startedBy: 'Dr. Sarah Chen',
      timeRemaining: '~2 hours',
      metrics: {
        accuracy: 94.2,
        precision: 92.8,
        recall: 91.5,
      },
    },
    {
      id: 2,
      name: 'Voice Deepfake Analysis',
      status: 'completed',
      progress: 100,
      startedBy: 'Dr. Aisha Patel',
      timeRemaining: 'Completed',
      metrics: {
        accuracy: 96.7,
        precision: 95.3,
        recall: 94.1,
      },
    },
    {
      id: 3,
      name: 'Video Temporal Inconsistency',
      status: 'paused',
      progress: 45,
      startedBy: 'Dr. James Wilson',
      timeRemaining: 'Paused',
      metrics: {
        accuracy: 89.5,
        precision: 87.2,
        recall: 86.9,
      },
    },
    {
      id: 4,
      name: 'GAN Fingerprint Detection',
      status: 'queued',
      progress: 0,
      startedBy: 'Prof. Michael Rodriguez',
      timeRemaining: 'In queue',
      metrics: {
        accuracy: null,
        precision: null,
        recall: null,
      },
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <FiPlayCircle className="text-blue-400" size={16} />;
      case 'completed':
        return <FiCheckCircle className="text-green-400" size={16} />;
      case 'paused':
        return <FiAlertCircle className="text-yellow-400" size={16} />;
      case 'queued':
        return <FiClock className="text-gray-400" size={16} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-500/20 text-blue-400';
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'queued':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'queued':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card overflow-hidden"
    >
      <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-[var(--accent)]/20 flex items-center justify-center mr-3">
            <FiActivity className="text-[var(--accent)]" size={18} />
          </div>
          <h2 className="text-lg font-bold">Ongoing Experiments</h2>
        </div>
        
        <button 
          className="p-1 text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="More options"
        >
          <FiMoreVertical size={18} />
        </button>
      </div>
      
      <div className="divide-y divide-[var(--border)]">
        {experiments.map((experiment) => (
          <div key={experiment.id} className="p-4 hover:bg-[var(--muted)]/10 transition-colors duration-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium text-white mr-2">{experiment.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex items-center ${getStatusColor(experiment.status)}`}>
                    {getStatusIcon(experiment.status)}
                    <span className="ml-1 capitalize">{experiment.status}</span>
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-400 mt-1 space-x-4">
                  <span className="flex items-center">
                    <FiUser className="mr-1" size={12} />
                    {experiment.startedBy}
                  </span>
                  <span className="flex items-center">
                    <FiClock className="mr-1" size={12} />
                    {experiment.timeRemaining}
                  </span>
                </div>
              </div>
              
              {experiment.metrics.accuracy !== null && (
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Accuracy</p>
                    <p className="text-sm font-bold text-white">{experiment.metrics.accuracy}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Precision</p>
                    <p className="text-sm font-bold text-white">{experiment.metrics.precision}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Recall</p>
                    <p className="text-sm font-bold text-white">{experiment.metrics.recall}%</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-full h-1.5 bg-[var(--muted)]/30 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getProgressColor(experiment.status)}`}
                style={{ width: `${experiment.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-[var(--card-bg)]/50 border-t border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center text-sm">
          <FiBarChart2 className="text-[var(--accent)] mr-2" size={16} />
          <span className="text-gray-400">
            <span className="text-white font-medium">3</span> running, 
            <span className="text-white font-medium"> 1</span> completed today
          </span>
        </div>
        <button className="text-[var(--accent)] hover:text-[var(--primary)] text-sm transition-colors duration-200">
          View All Experiments
        </button>
      </div>
    </motion.div>
  );
};

export default OngoingExperiments; 