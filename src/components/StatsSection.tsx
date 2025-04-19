'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiBarChart2, FiFileText, FiUsers, FiAward } from 'react-icons/fi';

const StatsSection = () => {
  const [counts, setCounts] = useState({
    deepfakesDetected: 0,
    papersPublished: 0,
    teamMembers: 0,
    accuracy: 0,
  });

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      const duration = 2000; // ms
      const interval = 20; // ms
      const steps = duration / interval;

      const targetCounts = {
        deepfakesDetected: 15782,
        papersPublished: 47,
        teamMembers: 24,
        accuracy: 99.7,
      };

      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep += 1;
        const progress = currentStep / steps;

        setCounts({
          deepfakesDetected: Math.floor(targetCounts.deepfakesDetected * progress),
          papersPublished: Math.floor(targetCounts.papersPublished * progress),
          teamMembers: Math.floor(targetCounts.teamMembers * progress),
          accuracy: parseFloat((targetCounts.accuracy * progress).toFixed(1)),
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setCounts(targetCounts);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [inView]);

  const stats = [
    {
      id: 1,
      title: 'Deepfakes Detected',
      value: counts.deepfakesDetected.toLocaleString(),
      icon: <FiBarChart2 size={24} className="text-[var(--secondary)]" />,
      color: 'from-[var(--secondary)]/20 to-transparent',
    },
    {
      id: 2,
      title: 'Papers Published',
      value: counts.papersPublished,
      icon: <FiFileText size={24} className="text-[var(--primary)]" />,
      color: 'from-[var(--primary)]/20 to-transparent',
    },
    {
      id: 3,
      title: 'Team Members',
      value: counts.teamMembers,
      icon: <FiUsers size={24} className="text-[var(--accent)]" />,
      color: 'from-[var(--accent)]/20 to-transparent',
    },
    {
      id: 4,
      title: 'Detection Accuracy',
      value: `${counts.accuracy}%`,
      icon: <FiAward size={24} className="text-[var(--secondary)]" />,
      color: 'from-[var(--secondary)]/20 to-transparent',
    },
  ];

  return (
    <section className="py-16 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="card overflow-hidden relative group hover:glow-box transition-all duration-300"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}
              ></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-300">{stat.title}</h3>
                  {stat.icon}
                </div>
                <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection; 