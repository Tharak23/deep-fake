'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RiAiGenerate } from 'react-icons/ri';
import { FiUser, FiUserPlus, FiArrowRight } from 'react-icons/fi';

export default function AuthLanding() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cardVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
  };

  const arrowVariants = {
    initial: { x: 0, opacity: 0.7 },
    hover: { x: 5, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center mb-16">
        <div className="flex items-center justify-center mb-8">
          <RiAiGenerate className="h-16 w-16 text-[var(--secondary)]" />
          <span className="text-4xl font-bold text-white ml-3">
            <span className="text-[var(--secondary)]">Deep</span>
            <span className="text-[var(--accent)]">Fake</span>
            <span>Lab</span>
          </span>
        </div>
        <h1 className="text-5xl font-bold text-white mb-6">
          Welcome to the DeepFake Detection Research Platform
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Join our community of researchers and contribute to cutting-edge deepfake detection technology
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Sign In Card */}
        <Link href="/auth/signin">
          <motion.div
            className="card p-8 h-full cursor-pointer border-2 hover:border-[var(--secondary)] transition-colors duration-300"
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            onMouseEnter={() => setHoveredCard('signin')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[var(--secondary)]/10 mb-6 mx-auto">
              <FiUser className="h-8 w-8 text-[var(--secondary)]" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-4">Sign In</h2>
            <p className="text-gray-400 text-center mb-6">
              Already have an account? Sign in to access your research, datasets, and experiments.
            </p>
            <div className="flex items-center justify-center text-[var(--secondary)]">
              <span className="mr-2">Continue</span>
              <motion.div variants={arrowVariants}>
                <FiArrowRight />
              </motion.div>
            </div>
          </motion.div>
        </Link>

        {/* Sign Up Card */}
        <Link href="/auth/signup">
          <motion.div
            className="card p-8 h-full cursor-pointer border-2 hover:border-[var(--accent)] transition-colors duration-300"
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            onMouseEnter={() => setHoveredCard('signup')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[var(--accent)]/10 mb-6 mx-auto">
              <FiUserPlus className="h-8 w-8 text-[var(--accent)]" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-4">Create Account</h2>
            <p className="text-gray-400 text-center mb-6">
              New to the platform? Join our community of researchers and contribute to deepfake detection.
            </p>
            <div className="flex items-center justify-center text-[var(--accent)]">
              <span className="mr-2">Get Started</span>
              <motion.div variants={arrowVariants}>
                <FiArrowRight />
              </motion.div>
            </div>
          </motion.div>
        </Link>
      </div>

      <div className="mt-16 text-center">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-300">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
} 