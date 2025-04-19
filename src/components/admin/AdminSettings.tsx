'use client';

import { useState } from 'react';
import { 
  FiSettings, 
  FiSave, 
  FiAlertTriangle, 
  FiMail, 
  FiUser, 
  FiLock,
  FiHelpCircle,
  FiSliders,
  FiShield
} from 'react-icons/fi';

const AdminSettings = () => {
  // Admin profile state
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    notificationsEnabled: true,
    darkModeEnabled: true,
    twoFactorEnabled: false
  });
  
  // Platform settings
  const [platformSettings, setPlatformSettings] = useState({
    allowNewUsers: true,
    allowResearcherApplications: true,
    maintenanceMode: false,
    dataSharingEnabled: true,
    auditLoggingEnabled: true
  });
  
  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 800));
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update user profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle platform settings update
  const handlePlatformSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Simulate API call to update platform settings
      await new Promise(resolve => setTimeout(resolve, 800));
      setSuccessMessage('Platform settings updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating platform settings:', error);
      setErrorMessage('Failed to update platform settings');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle toggle changes
  const handleToggle = (setting: string, section: 'profile' | 'platform') => {
    if (section === 'profile') {
      setProfile({
        ...profile,
        [setting]: !profile[setting as keyof typeof profile]
      });
    } else {
      setPlatformSettings({
        ...platformSettings,
        [setting]: !platformSettings[setting as keyof typeof platformSettings]
      });
    }
  };
  
  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
        <h2 className="text-xl font-bold text-white flex items-center">
          <FiSettings className="mr-2" size={20} />
          Admin Settings
        </h2>
        <p className="text-gray-400 mt-1">
          Manage your admin profile and platform settings
        </p>
      </div>
      
      {/* Success/Error notifications */}
      {successMessage && (
        <div className="bg-green-900/30 border border-green-800 rounded-lg p-4 flex items-center text-green-400">
          <FiShield className="mr-2" size={18} />
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 flex items-center text-red-400">
          <FiAlertTriangle className="mr-2" size={18} />
          {errorMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Profile Section */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-800/50 border-b border-gray-700">
            <h3 className="font-medium text-white flex items-center">
              <FiUser className="mr-2" size={18} />
              Admin Profile
            </h3>
          </div>
          
          <div className="p-5">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  aria-label="Admin name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  aria-label="Admin email"
                />
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-300">Preferences</h4>
                
                <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-md">
                  <div className="flex items-center">
                    <FiMail className="text-indigo-400 mr-2" size={16} />
                    <span className="text-sm text-gray-300">Email Notifications</span>
                  </div>
                  <div 
                    className={`w-10 h-5 rounded-full flex items-center ${
                      profile.notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-700'
                    } transition-colors cursor-pointer`}
                    onClick={() => handleToggle('notificationsEnabled', 'profile')}
                    role="switch"
                    aria-checked={profile.notificationsEnabled ? "true" : "false"}
                    tabIndex={0}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                      profile.notificationsEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-md">
                  <div className="flex items-center">
                    <FiSliders className="text-indigo-400 mr-2" size={16} />
                    <span className="text-sm text-gray-300">Dark Mode</span>
                  </div>
                  <div 
                    className={`w-10 h-5 rounded-full flex items-center ${
                      profile.darkModeEnabled ? 'bg-indigo-600' : 'bg-gray-700'
                    } transition-colors cursor-pointer`}
                    onClick={() => handleToggle('darkModeEnabled', 'profile')}
                    role="switch"
                    aria-checked={profile.darkModeEnabled ? "true" : "false"}
                    tabIndex={0}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                      profile.darkModeEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-md">
                  <div className="flex items-center">
                    <FiLock className="text-indigo-400 mr-2" size={16} />
                    <span className="text-sm text-gray-300">Two-Factor Authentication</span>
                  </div>
                  <div 
                    className={`w-10 h-5 rounded-full flex items-center ${
                      profile.twoFactorEnabled ? 'bg-indigo-600' : 'bg-gray-700'
                    } transition-colors cursor-pointer`}
                    onClick={() => handleToggle('twoFactorEnabled', 'profile')}
                    role="switch"
                    aria-checked={profile.twoFactorEnabled ? "true" : "false"}
                    tabIndex={0}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                      profile.twoFactorEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-900/50 text-indigo-300 rounded hover:bg-indigo-900/70 transition-colors text-sm flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2 text-indigo-300" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-1" size={16} />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Platform Settings Section */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-800/50 border-b border-gray-700">
            <h3 className="font-medium text-white flex items-center">
              <FiSettings className="mr-2" size={18} />
              Platform Settings
            </h3>
          </div>
          
          <div className="p-5">
            <form onSubmit={handlePlatformSettingsUpdate} className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-300">Access Controls</h4>
                
                <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-md">
                  <div className="flex items-center">
                    <FiUser className="text-blue-400 mr-2" size={16} />
                    <span className="text-sm text-gray-300">Allow New User Registration</span>
                  </div>
                  <div 
                    className={`w-10 h-5 rounded-full flex items-center ${
                      platformSettings.allowNewUsers ? 'bg-indigo-600' : 'bg-gray-700'
                    } transition-colors cursor-pointer`}
                    onClick={() => handleToggle('allowNewUsers', 'platform')}
                    role="switch"
                    aria-checked={platformSettings.allowNewUsers ? "true" : "false"}
                    tabIndex={0}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                      platformSettings.allowNewUsers ? 'translate-x-5' : 'translate-x-1'
                    }`}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-md">
                  <div className="flex items-center">
                    <FiShield className="text-green-400 mr-2" size={16} />
                    <span className="text-sm text-gray-300">Allow Researcher Applications</span>
                  </div>
                  <div 
                    className={`w-10 h-5 rounded-full flex items-center ${
                      platformSettings.allowResearcherApplications ? 'bg-indigo-600' : 'bg-gray-700'
                    } transition-colors cursor-pointer`}
                    onClick={() => handleToggle('allowResearcherApplications', 'platform')}
                    role="switch"
                    aria-checked={platformSettings.allowResearcherApplications ? "true" : "false"}
                    tabIndex={0}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                      platformSettings.allowResearcherApplications ? 'translate-x-5' : 'translate-x-1'
                    }`}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-md">
                  <div className="flex items-center">
                    <FiAlertTriangle className="text-amber-400 mr-2" size={16} />
                    <span className="text-sm text-gray-300">Maintenance Mode</span>
                  </div>
                  <div 
                    className={`w-10 h-5 rounded-full flex items-center ${
                      platformSettings.maintenanceMode ? 'bg-indigo-600' : 'bg-gray-700'
                    } transition-colors cursor-pointer`}
                    onClick={() => handleToggle('maintenanceMode', 'platform')}
                    role="switch"
                    aria-checked={platformSettings.maintenanceMode ? "true" : "false"}
                    tabIndex={0}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                      platformSettings.maintenanceMode ? 'translate-x-5' : 'translate-x-1'
                    }`}></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <h4 className="text-sm font-medium text-gray-300">Data & Security</h4>
                
                <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-md">
                  <div className="flex items-center">
                    <FiHelpCircle className="text-blue-400 mr-2" size={16} />
                    <span className="text-sm text-gray-300">Enable Data Sharing</span>
                  </div>
                  <div 
                    className={`w-10 h-5 rounded-full flex items-center ${
                      platformSettings.dataSharingEnabled ? 'bg-indigo-600' : 'bg-gray-700'
                    } transition-colors cursor-pointer`}
                    onClick={() => handleToggle('dataSharingEnabled', 'platform')}
                    role="switch"
                    aria-checked={platformSettings.dataSharingEnabled ? "true" : "false"}
                    tabIndex={0}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                      platformSettings.dataSharingEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-md">
                  <div className="flex items-center">
                    <FiLock className="text-blue-400 mr-2" size={16} />
                    <span className="text-sm text-gray-300">Enable Audit Logging</span>
                  </div>
                  <div 
                    className={`w-10 h-5 rounded-full flex items-center ${
                      platformSettings.auditLoggingEnabled ? 'bg-indigo-600' : 'bg-gray-700'
                    } transition-colors cursor-pointer`}
                    onClick={() => handleToggle('auditLoggingEnabled', 'platform')}
                    role="switch"
                    aria-checked={platformSettings.auditLoggingEnabled ? "true" : "false"}
                    tabIndex={0}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                      platformSettings.auditLoggingEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-900/50 text-indigo-300 rounded hover:bg-indigo-900/70 transition-colors text-sm flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2 text-indigo-300" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-1" size={16} />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Help Section */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
        <div className="flex items-start">
          <div className="p-2 rounded-md bg-blue-900/30 mr-4 mt-1">
            <FiHelpCircle className="text-blue-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Support & Documentation</h3>
            <p className="text-gray-400 mt-1">
              Need help with admin settings? Check our documentation or contact the development team.
            </p>
            <div className="mt-4 space-x-3">
              <a 
                href="#" 
                className="inline-block px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors text-sm"
              >
                View Documentation
              </a>
              <a 
                href="mailto:support@deepfakeslab.com" 
                className="inline-block px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors text-sm"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings; 