'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Navbar from '../Navbar';
import Footer from '../Footer';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import ResearchersList from './ResearchersList';
import RecentUploads from './RecentUploads';
import OngoingExperiments from './OngoingExperiments';
import Leaderboard from './Leaderboard';
import PaperRepository from './PaperRepository';

const ResearchDashboard = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  // Set active section based on the current route
  useEffect(() => {
    if (pathname === '/research-platform') {
      setActiveSection('dashboard');
    }
  }, [pathname]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResearchersList />
            <RecentUploads />
            <OngoingExperiments />
            <Leaderboard />
          </div>
        );
      case 'papers':
        return <PaperRepository />;
      case 'datasets':
        return <div className="card p-6">Datasets section (coming soon)</div>;
      case 'models':
        return <div className="card p-6">Models section (coming soon)</div>;
      case 'experiments':
        return <div className="card p-6">Experiments section (coming soon)</div>;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] pt-20">
        <DashboardHeader activeSection={activeSection} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <DashboardSidebar 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
            />
            
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              key={activeSection}
            >
              {renderActiveSection()}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResearchDashboard; 