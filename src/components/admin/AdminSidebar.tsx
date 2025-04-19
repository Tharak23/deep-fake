'use client';

import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiUsers, 
  FiShield, 
  FiKey, 
  FiSettings,
  FiCheckCircle,
  FiAward
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

type AdminSidebarProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const AdminSidebar = ({ activeSection, setActiveSection }: AdminSidebarProps) => {
  const { user } = useAuth();
  
  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: <FiHome size={18} /> },
    { id: 'users', label: 'User Management', icon: <FiUsers size={18} /> },
    { id: 'verification', label: 'Researcher Verification', icon: <FiCheckCircle size={18} /> },
    { id: 'researchers', label: 'Verified Researchers', icon: <FiAward size={18} /> },
    { id: 'access', label: 'Access Control', icon: <FiKey size={18} /> },
    { id: 'settings', label: 'Admin Settings', icon: <FiSettings size={18} /> },
  ];

  return (
    <div className="w-full lg:w-64 shrink-0">
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 sticky top-24">
        <div className="border-b border-gray-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            {user?.image ? (
              <img 
                src={user.image} 
                alt={user.name || 'Admin'} 
                className="w-10 h-10 rounded-full object-cover border-2 border-red-500"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center text-red-400 font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </div>
            )}
            <div>
              <div className="font-medium text-white">{user?.name || 'Admin User'}</div>
              <div className="text-xs text-gray-400">{user?.email}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <div className="px-2 py-1 text-xs font-medium bg-red-900/20 text-red-400 rounded flex items-center">
              <FiShield className="mr-1" size={12} />
              Administrator
            </div>
          </div>
        </div>
        
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-red-900/20 to-red-700/10 text-white'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <span className={activeSection === item.id ? 'text-red-400' : ''}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="admin-sidebar-active-indicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="text-xs text-gray-500">
            <p>Admin access restricted</p>
            <p className="mt-1">Last login: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar; 