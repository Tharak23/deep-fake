'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '../Navbar';
import Footer from '../Footer';
import AdminSidebar from './AdminSidebar';
import UsersManagement from './UsersManagement';
import ResearcherVerification from './ResearcherVerification';
import DashboardOverview from './DashboardOverview';
import AccessControl from './AccessControl';
import AdminSettings from './AdminSettings';
import VerifiedResearchers from './VerifiedResearchers';

// List of admin emails
const ADMIN_EMAILS = [
  'tharak.nagaveti@gmail.com',
  'adityasaisontena@gmail.com',
  'dhanushyangal@gmail.com',
  'tejeshvarma07@gmail.com'
];

const AdminDashboard = () => {
  const router = useRouter();
  const { user, status, getEmail } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Collect debug info
    const info = {
      status,
      userObject: user ? { ...user } : null,
      email: getEmail(),
      isAdminEmail: getEmail() ? ADMIN_EMAILS.includes(getEmail() as string) : false,
      timestamp: new Date().toISOString()
    };
    setDebugInfo(info);
    
    // Check if user is authenticated and is an admin
    if (status === 'authenticated') {
      const email = getEmail();
      
      if (!email) {
        setError('User profile not loaded correctly. Please try signing in again.');
        setIsLoading(false);
        return;
      }
      
      if (!ADMIN_EMAILS.includes(email)) {
        // Not an admin, redirect to home
        console.log('User not authorized as admin:', email);
        router.push('/');
        return;
      }
      
      // User is authenticated and has admin access
      setIsLoading(false);
      setError(null);
    } else if (status === 'unauthenticated') {
      // Not logged in, redirect to login
      router.push('/auth/signin');
    }
    // Loading state persists while status is 'loading'
  }, [user, status, router, getEmail]);

  const renderActiveSection = () => {
    // Show error instead of section if there's an error
    if (error) {
      return (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-red-300">{error}</p>
          <button 
            onClick={() => router.push('/auth/signin')}
            className="mt-4 px-4 py-2 bg-red-900/50 text-red-200 rounded hover:bg-red-900/70"
          >
            Sign In Again
          </button>
          
          {/* Debug information */}
          {debugInfo && (
            <div className="mt-6 border-t border-red-800 pt-4">
              <h3 className="text-md font-semibold text-white mb-2">Debug Information</h3>
              <pre className="bg-gray-900 p-3 rounded-md text-xs text-gray-400 overflow-auto max-h-64">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
      );
    }
    
    // Render the appropriate section
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'users':
        return <UsersManagement />;
      case 'verification':
        return <ResearcherVerification />;
      case 'researchers':
        return <VerifiedResearchers />;
      case 'access':
        return <AccessControl />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] pt-20 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-12 w-12 mx-auto rounded-full bg-indigo-600/50"></div>
            <div className="mt-4 text-indigo-400">Verifying admin access...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // If user email isn't in admin list, show unauthorized message
  const userEmail = getEmail();
  if (userEmail && !ADMIN_EMAILS.includes(userEmail)) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] pt-20 flex items-center justify-center">
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-8 max-w-md text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-red-900/50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mt-4">Unauthorized Access</h2>
            <p className="text-red-300 mt-2">
              Your account ({userEmail}) does not have administrator privileges.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="mt-6 px-4 py-2 bg-red-900/50 text-red-200 rounded hover:bg-red-900/70"
            >
              Return to Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <AdminSidebar 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
            />
            
            <div className="flex-1">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 mb-6">
                <h1 className="text-2xl font-bold text-white flex items-center">
                  Admin Dashboard
                  <span className="ml-3 text-xs px-2 py-0.5 bg-red-900/30 text-red-400 rounded-full">
                    Admin Access
                  </span>
                </h1>
                <p className="text-gray-400 mt-1">
                  Manage users, approve researchers, and control platform access
                </p>
                {userEmail && (
                  <div className="mt-4 text-sm text-gray-500">
                    Logged in as: <span className="text-indigo-400">{userEmail}</span>
                  </div>
                )}
              </div>
              
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard; 