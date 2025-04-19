'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { FiArrowRight, FiAlertTriangle, FiCheck, FiInfo } from 'react-icons/fi';
import Link from 'next/link';

const CaseStudySection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const caseStudies = [
    {
      id: 1,
      title: 'Political Deepfakes',
      description:
        'In 2020, a series of deepfake videos featuring political figures made rounds on social media, potentially influencing public opinion. Our team analyzed these videos and identified key markers of manipulation.',
      image: '/placeholders/case-political.jpg',
      icon: <FiAlertTriangle className="text-red-500" size={20} />,
      stats: [
        { label: 'Videos Analyzed', value: '24' },
        { label: 'Detection Rate', value: '98.2%' },
        { label: 'Social Media Reach', value: '12M+' },
      ],
    },
    {
      id: 2,
      title: 'Celebrity Impersonation',
      description:
        'Deepfakes of celebrities endorsing products or making controversial statements have become increasingly common. Our research has developed specific detection methods for celebrity impersonation.',
      image: '/placeholders/case-celebrity.jpg',
      icon: <FiInfo className="text-blue-500" size={20} />,
      stats: [
        { label: 'Cases Documented', value: '156' },
        { label: 'Legal Actions', value: '37' },
        { label: 'Detection Time', value: '<5s' },
      ],
    },
    {
      id: 3,
      title: 'Corporate Fraud',
      description:
        'In 2022, a major financial fraud was attempted using deepfake technology to impersonate a CEO in video conferences. Our technology helped identify the fraud before significant damage occurred.',
      image: '/placeholders/case-corporate.jpg',
      icon: <FiCheck className="text-green-500" size={20} />,
      stats: [
        { label: 'Prevented Loss', value: '$4.2M' },
        { label: 'Response Time', value: '2.5h' },
        { label: 'Success Rate', value: '100%' },
      ],
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#0f172a] to-[#0a0a0a]" id="case-studies">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Real-World <span className="text-[var(--accent)]">Case Studies</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Examining notable deepfake incidents and how our technology has been applied to detect and analyze them
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center mb-8">
          {caseStudies.map((study, index) => (
            <button
              key={study.id}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 mx-2 mb-2 rounded-full transition-all duration-300 ${
                activeTab === index
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--muted)]/30 text-gray-300 hover:bg-[var(--muted)]/50'
              }`}
            >
              <div className="flex items-center">
                {study.icon}
                <span className="ml-2">{study.title}</span>
              </div>
            </button>
          ))}
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="card overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative h-64 lg:h-auto rounded-lg overflow-hidden">
              <Image
                src={caseStudies[activeTab].image}
                alt={caseStudies[activeTab].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {caseStudies[activeTab].title}
                </h3>
                <div className="flex items-center">
                  {caseStudies[activeTab].icon}
                  <span className="ml-2 text-white text-sm">Case Study #{caseStudies[activeTab].id}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-gray-300 mb-6">{caseStudies[activeTab].description}</p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {caseStudies[activeTab].stats.map((stat, index) => (
                  <div key={index} className="bg-[var(--muted)]/20 p-4 rounded-lg">
                    <p className="text-[var(--secondary)] font-bold text-xl">{stat.value}</p>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
              <Link
                href={`/case-studies/${caseStudies[activeTab].id}`}
                className="btn btn-accent inline-flex items-center"
              >
                Read Full Case Study <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-12">
          <Link
            href="/case-studies"
            className="text-[var(--accent)] hover:text-[var(--secondary)] transition-colors duration-300 inline-flex items-center"
          >
            View All Case Studies <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CaseStudySection; 