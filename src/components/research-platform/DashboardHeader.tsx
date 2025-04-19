'use client';

import { motion } from 'framer-motion';
import { FiSearch, FiBell, FiSettings } from 'react-icons/fi';
import { RiAiGenerate } from 'react-icons/ri';

type DashboardHeaderProps = {
  activeSection: string;
};

const DashboardHeader = ({ activeSection }: DashboardHeaderProps) => {
  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'Research Dashboard';
      case 'papers':
        return 'Paper Repository';
      case 'datasets':
        return 'Dataset Management';
      case 'models':
        return 'Model Training';
      case 'experiments':
        return 'Experiments & Results';
      default:
        return 'Research Platform';
    }
  };

  return (
    <div className="bg-[var(--card-bg)]/80 backdrop-blur-md border-b border-[var(--border)] sticky top-16 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mr-3 bg-[var(--primary)]/20 p-2 rounded-lg"
            >
              <RiAiGenerate className="h-6 w-6 text-[var(--secondary)]" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-2xl font-bold"
                key={activeSection}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {getSectionTitle()}
              </motion.h1>
              <p className="text-gray-400 text-sm">
                DeepFake Detection Research Platform
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full md:w-64 px-4 py-2 pl-10 bg-[var(--card-bg)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] text-white text-sm"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            
            <button className="p-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-md hover:bg-[var(--muted)]/30 transition-colors duration-300 relative" aria-label="Notifications">
              <FiBell className="text-gray-400" size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--accent)] rounded-full"></span>
            </button>
            
            <button className="p-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-md hover:bg-[var(--muted)]/30 transition-colors duration-300" aria-label="Settings">
              <FiSettings className="text-gray-400" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader; 