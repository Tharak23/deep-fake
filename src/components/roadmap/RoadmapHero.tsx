'use client';

import { motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { RiAiGenerate } from 'react-icons/ri';

type RoadmapHeroProps = {
  scrollProgress: number;
};

const RoadmapHero = ({ scrollProgress }: RoadmapHeroProps) => {
  return (
    <div className="relative">
      {/* Decorative elements that move based on scroll */}
      <div 
        className="absolute -left-12 top-20 opacity-30"
        style={{ transform: `translateY(${scrollProgress * 60}px)` }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="59.5" stroke="url(#paint0_linear)" strokeOpacity="0.5" />
          <circle cx="60" cy="60" r="40" stroke="url(#paint1_linear)" strokeOpacity="0.5" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366F1" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="paint1_linear" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div 
        className="absolute -right-16 top-40 opacity-20" 
        style={{ transform: `translateY(${-scrollProgress * 80}px)` }}
      >
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="159" height="159" rx="19.5" stroke="url(#paint0_linear)" strokeOpacity="0.7" />
          <rect x="40.5" y="40.5" width="79" height="79" rx="9.5" stroke="url(#paint1_linear)" strokeOpacity="0.7" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="paint1_linear" x1="40" y1="40" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="1" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main content */}
      <div className="relative text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-700/30">
            <RiAiGenerate className="h-12 w-12 text-indigo-400" />
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-indigo-200"
        >
          Mastering DeepFake Research
        </motion.h1>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-indigo-300 mb-6">
            A Step-by-Step Roadmap
          </h2>
          
          <p className="text-gray-400 max-w-3xl mx-auto mb-10">
            Navigate your journey through 5 progressive levels of DeepFake research. 
            Track your progress, complete interactive challenges, and unlock access to 
            advanced research resources as you gain expertise in this cutting-edge field.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex justify-center"
        >
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="animate-bounce flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/30 transition-colors"
            aria-label="Scroll down to view roadmap"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
              }
            }}
          >
            <FiChevronDown size={20} />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default RoadmapHero; 