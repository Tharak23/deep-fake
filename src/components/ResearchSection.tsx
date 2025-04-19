'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

const ResearchSection = () => {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const projects = [
    {
      id: 1,
      title: 'Facial Manipulation Detection',
      description:
        'Developing advanced neural networks to detect subtle inconsistencies in manipulated facial images and videos.',
      image: '/placeholders/research-facial.jpg',
      tags: ['Computer Vision', 'CNN', 'Facial Analysis'],
    },
    {
      id: 2,
      title: 'Audio Deepfake Analysis',
      description:
        'Creating algorithms to identify synthetic voice generation and audio manipulation in media content.',
      image: '/placeholders/research-audio.jpg',
      tags: ['Audio Processing', 'ML', 'Voice Analysis'],
    },
    {
      id: 3,
      title: 'Temporal Inconsistency Detection',
      description:
        'Analyzing frame-by-frame temporal patterns to identify inconsistencies in deepfake videos.',
      image: '/placeholders/research-temporal.jpg',
      tags: ['Video Analysis', 'RNN', 'Temporal Patterns'],
    },
    {
      id: 4,
      title: 'Generative Model Fingerprinting',
      description:
        'Identifying unique signatures left by different AI models used to generate synthetic media.',
      image: '/placeholders/research-fingerprinting.jpg',
      tags: ['GAN', 'Model Analysis', 'Forensics'],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#0f172a] to-[#0a0a0a]" id="research">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Our <span className="text-[var(--secondary)]">Research</span> Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Exploring cutting-edge techniques to detect and analyze deepfakes across various media types
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className={`card overflow-hidden group transition-all duration-300 ${
                activeProject === project.id
                  ? 'ring-2 ring-[var(--secondary)] scale-[1.02]'
                  : ''
              }`}
              onMouseEnter={() => setActiveProject(project.id)}
              onMouseLeave={() => setActiveProject(null)}
            >
              <div
                className="h-48 bg-cover bg-center mb-4 rounded-lg transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${project.image})`,
                }}
              ></div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[var(--secondary)] transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-gray-400 mb-4 text-sm">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-[var(--muted)]/30 text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/research/${project.id}`}
                className="inline-flex items-center text-[var(--secondary)] hover:text-[var(--accent)] transition-colors duration-300 text-sm"
              >
                Learn more <FiArrowRight className="ml-1" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link
            href="/research"
            className="btn btn-primary inline-flex items-center"
          >
            View All Research <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResearchSection; 