'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { FiLinkedin, FiTwitter, FiGithub, FiMail } from 'react-icons/fi';

const TeamSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const teamMembers = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      role: 'Lead Researcher',
      image: '/placeholders/team-member-1.jpg',
      bio: 'Ph.D. in Computer Vision with 10+ years of experience in AI and machine learning. Leading our facial manipulation detection research.',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com',
        email: 'mailto:sarah@deepfakelab.com',
      },
    },
    {
      id: 2,
      name: 'Prof. Michael Rodriguez',
      role: 'Research Director',
      image: '/placeholders/team-member-2.jpg',
      bio: 'Former Google AI researcher with expertise in generative models and neural networks. Oversees all research projects and partnerships.',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com',
        email: 'mailto:michael@deepfakelab.com',
      },
    },
    {
      id: 3,
      name: 'Dr. Aisha Patel',
      role: 'Audio Analysis Specialist',
      image: '/placeholders/team-member-3.jpg',
      bio: 'Specializes in audio deepfake detection with background in signal processing and acoustic engineering from MIT.',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com',
        email: 'mailto:aisha@deepfakelab.com',
      },
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      role: 'Video Forensics Expert',
      image: '/placeholders/team-member-4.jpg',
      bio: 'Expert in temporal analysis and video forensics with previous experience at the FBI Cyber Division.',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com',
        email: 'mailto:james@deepfakelab.com',
      },
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
    <section className="py-20 bg-[#0a0a0a]" id="team">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Meet Our <span className="text-[var(--accent)]">Team</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            World-class researchers and experts dedicated to advancing deepfake detection technology
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              className="card overflow-hidden group hover:glow-box hover:border-[var(--accent)]/50 transition-all duration-300"
            >
              <div className="relative h-64 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-[var(--secondary)] text-sm">{member.role}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">{member.bio}</p>
              <div className="flex space-x-3">
                <a
                  href={member.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[var(--secondary)] transition-colors duration-300"
                >
                  <FiLinkedin size={18} />
                </a>
                <a
                  href={member.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[var(--secondary)] transition-colors duration-300"
                >
                  <FiTwitter size={18} />
                </a>
                <a
                  href={member.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[var(--secondary)] transition-colors duration-300"
                >
                  <FiGithub size={18} />
                </a>
                <a
                  href={member.social.email}
                  className="text-gray-400 hover:text-[var(--secondary)] transition-colors duration-300"
                >
                  <FiMail size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection; 