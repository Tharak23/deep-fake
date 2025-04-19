'use client';

import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiFileText, 
  FiDatabase, 
  FiActivity, 
  FiUsers, 
  FiStar,
  FiBookmark
} from 'react-icons/fi';
import { BiBrain } from 'react-icons/bi';
import PlaceholderImage from './PlaceholderImage';

type DashboardSidebarProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const DashboardSidebar = ({ activeSection, setActiveSection }: DashboardSidebarProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome size={18} /> },
    { id: 'papers', label: 'Paper Repository', icon: <FiFileText size={18} /> },
    { id: 'datasets', label: 'Datasets', icon: <FiDatabase size={18} /> },
    { id: 'models', label: 'Models', icon: <BiBrain size={18} /> },
    { id: 'experiments', label: 'Experiments', icon: <FiActivity size={18} /> },
    { id: 'team', label: 'Team', icon: <FiUsers size={18} /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <FiBookmark size={18} /> },
  ];

  return (
    <div className="w-full lg:w-64 shrink-0">
      <div className="card overflow-hidden sticky top-36">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <PlaceholderImage
                text="SC"
                width={40}
                height={40}
                bgColor="#1e40af"
                textColor="#ffffff"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-white">Dr. Sarah Chen</h3>
              <p className="text-[var(--secondary)] text-xs">Lead Researcher</p>
            </div>
          </div>
        </div>
        
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-[var(--primary)]/20 to-[var(--secondary)]/10 text-white'
                      : 'text-gray-400 hover:bg-[var(--muted)]/20 hover:text-white'
                  }`}
                >
                  <span className={activeSection === item.id ? 'text-[var(--secondary)]' : ''}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--secondary)]"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 mt-4 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-white">Research Score</h4>
            <span className="flex items-center text-[var(--secondary)] text-xs">
              <FiStar className="mr-1" size={12} />
              Advanced
            </span>
          </div>
          <div className="w-full h-2 bg-[var(--muted)]/30 rounded-full overflow-hidden">
            <div className="h-full w-4/5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"></div>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            78% progress to next level
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar; 