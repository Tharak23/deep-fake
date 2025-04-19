'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import RoadmapHero from './RoadmapHero';
import RoadmapTimeline from './RoadmapTimeline';
import RoadmapCompletion from './RoadmapCompletion';

const RoadmapPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeLevel, setActiveLevel] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;
      const docHeight = document.body.offsetHeight;
      const totalScroll = docHeight - winHeight;
      const progress = Math.min(scrollY / totalScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f172a] to-[#0f1a2b] overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 z-0 opacity-20">
          <div 
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-[100px]"
            style={{ 
              transform: !isMobile ? `translate(${scrollProgress * 50}px, ${-scrollProgress * 30}px)` : 'none' 
            }}
          ></div>
          <div 
            className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-blue-600/20 blur-[100px]"
            style={{ 
              transform: !isMobile ? `translate(${-scrollProgress * 40}px, ${scrollProgress * 40}px)` : 'none' 
            }}
          ></div>
          <div 
            className="absolute top-2/3 right-1/3 w-72 h-72 rounded-full bg-cyan-600/20 blur-[100px]"
            style={{ 
              transform: !isMobile ? `translate(${scrollProgress * 30}px, ${scrollProgress * 50}px)` : 'none' 
            }}
          ></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <RoadmapHero scrollProgress={scrollProgress} />
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 sm:mt-24"
          >
            <RoadmapTimeline 
              activeLevel={activeLevel} 
              setActiveLevel={setActiveLevel} 
            />
          </motion.div>
          
          <div className="mt-16 sm:mt-24">
            <RoadmapCompletion />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RoadmapPage; 