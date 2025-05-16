'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';

const BlogSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const blogPosts = [
    {
      id: 1,
      title: 'Advances in Facial Manipulation Detection Using Transformer Models',
      excerpt:
        'Our team has developed a new approach using transformer-based architectures to detect facial manipulations with unprecedented accuracy.',
      image: '/placeholders/blog-facial.jpg',
      date: 'May 15, 2023',
      author: 'Dr. gagan aditya',
      category: 'Research',
    },
    {
      id: 2,
      title: 'The Growing Threat of Political Deepfakes in Election Cycles',
      excerpt:
        'As election seasons approach, we examine the increasing sophistication of political deepfakes and their potential impact on democratic processes.',
      image: '/placeholders/blog-political.jpg',
      date: 'April 28, 2023',
      author: 'Prof. Michael Rodriguez',
      category: 'Analysis',
    },
    {
      id: 3,
      title: 'Audio Deepfake Detection: New Challenges in Voice Synthesis',
      excerpt:
        'Recent advancements in voice synthesis technology present new challenges for audio deepfake detection. Our research addresses these emerging threats.',
      image: '/placeholders/blog-audio.jpg',
      date: 'April 10, 2023',
      author: 'Dr. Aisha Patel',
      category: 'Technology',
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
    <section className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#0f172a]" id="blog">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Latest <span className="text-[var(--primary)]">News</span> & Insights
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Stay updated with the latest developments in deepfake detection research and technology
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              className="card overflow-hidden group hover:glow-box hover:border-[var(--primary)]/50 transition-all duration-300"
            >
              <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-0 right-0 bg-[var(--primary)] text-white text-xs font-bold px-3 py-1 m-2 rounded">
                  {post.category}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-400 mb-3 space-x-4">
                <div className="flex items-center">
                  <FiCalendar className="mr-1" size={14} />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <FiUser className="mr-1" size={14} />
                  <span>{post.author}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[var(--primary)] transition-colors duration-300">
                {post.title}
              </h3>
              <p className="text-gray-400 mb-4 text-sm">{post.excerpt}</p>
              <Link
                href={`/blog/${post.id}`}
                className="inline-flex items-center text-[var(--primary)] hover:text-[var(--secondary)] transition-colors duration-300 text-sm"
              >
                Read more <FiArrowRight className="ml-1" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="btn btn-primary inline-flex items-center"
          >
            View All Articles <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection; 
