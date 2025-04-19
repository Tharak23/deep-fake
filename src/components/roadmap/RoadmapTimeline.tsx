'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiLock, FiChevronRight, FiUpload, FiCheckCircle, FiFileText, FiCode, FiBookOpen, FiAward } from 'react-icons/fi';
import { MdOutlineScience } from 'react-icons/md';
import { AiOutlineExperiment } from 'react-icons/ai';
import { CgPathTrim } from 'react-icons/cg';
import RoadmapLevelDetail from './RoadmapLevelDetail';

type RoadmapTimelineProps = {
  activeLevel: number;
  setActiveLevel: (level: number) => void;
};

const RoadmapTimeline = ({ activeLevel, setActiveLevel }: RoadmapTimelineProps) => {
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(1);
  const [fileUploads, setFileUploads] = useState<{ [key: number]: string[] }>({});

  const roadmapData = [
    {
      level: 1,
      title: "Beginner – Understanding AI & Deep Learning",
      description: "Master the foundations of AI, ML, and deep learning to build a solid base for your deepfake research journey.",
      steps: [
        { id: 'basics', title: "Basics of AI, ML, and Deep Learning", icon: <FiBookOpen size={18} /> },
        { id: 'nn', title: "Intro to Neural Networks & CNNs", icon: <MdOutlineScience size={18} /> },
        { id: 'python', title: "Python, TensorFlow, and PyTorch basics", icon: <FiCode size={18} /> },
      ],
      requiredFiles: ['ai_basics_quiz.pdf'],
      color: 'from-blue-600 to-cyan-400',
      x: '10%',
      y: '20%',
    },
    {
      level: 2,
      title: "Intermediate – GANs & Face Generation",
      description: "Explore the world of Generative Adversarial Networks and learn how they're used for creating realistic synthetic images.",
      steps: [
        { id: 'gans', title: "Understanding GANs (Generative Adversarial Networks)", icon: <FiBookOpen size={18} /> },
        { id: 'train', title: "Training a simple GAN for image generation", icon: <AiOutlineExperiment size={18} /> },
        { id: 'style', title: "Intro to StyleGAN & DeepFake architectures", icon: <MdOutlineScience size={18} /> },
      ],
      requiredFiles: ['gan_implementation.py', 'training_results.pdf'],
      color: 'from-teal-500 to-emerald-400',
      x: '30%',
      y: '35%',
    },
    {
      level: 3,
      title: "Advanced – DeepFake Detection & Ethics",
      description: "Develop skills to identify manipulated media and understand the ethical implications of deepfake technology.",
      steps: [
        { id: 'identify', title: "Identifying AI-generated fake videos", icon: <FiCheckCircle size={18} /> },
        { id: 'techniques', title: "Techniques for detecting manipulated media", icon: <MdOutlineScience size={18} /> },
        { id: 'ethics', title: "Ethical considerations & legal issues", icon: <FiFileText size={18} /> },
      ],
      requiredFiles: ['detection_algorithm.py', 'ethics_paper.pdf'],
      color: 'from-violet-600 to-purple-400',
      x: '50%',
      y: '20%',
    },
    {
      level: 4,
      title: "Hands-on – Building & Detecting DeepFakes",
      description: "Apply your knowledge to create and detect deepfakes while analyzing real-world datasets.",
      steps: [
        { id: 'training', title: "Training DeepFake models", icon: <AiOutlineExperiment size={18} /> },
        { id: 'implement', title: "Implementing detection algorithms", icon: <FiCode size={18} /> },
        { id: 'analyze', title: "Analyzing real-world DeepFake datasets", icon: <FiFileText size={18} /> },
      ],
      requiredFiles: ['deepfake_model.h5', 'detection_results.pdf'],
      color: 'from-amber-500 to-orange-400',
      x: '70%',
      y: '35%',
    },
    {
      level: 5,
      title: "Expert – Contributing to Research",
      description: "Join the global research community by publishing findings and contributing to open-source projects.",
      steps: [
        { id: 'publish', title: "Publishing research findings", icon: <FiFileText size={18} /> },
        { id: 'contribute', title: "Contributing to open-source DeepFake projects", icon: <FiCode size={18} /> },
        { id: 'verify', title: "Becoming a verified researcher", icon: <FiAward size={18} /> },
      ],
      requiredFiles: ['research_paper.pdf', 'project_contribution.pdf', 'verification_request.pdf'],
      color: 'from-rose-500 to-pink-400',
      x: '90%',
      y: '20%',
    },
  ];

  const handleFileUpload = (level: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files).map(file => file.name);
      setFileUploads(prev => ({
        ...prev,
        [level]: [...(prev[level] || []), ...newFiles]
      }));
    }
  };

  const checkLevelCompletion = (level: number) => {
    const requiredFiles = roadmapData[level - 1].requiredFiles;
    const uploadedFiles = fileUploads[level] || [];
    
    // Check if all required files are uploaded
    return requiredFiles.every(file => 
      uploadedFiles.some(uploadedFile => 
        uploadedFile.toLowerCase().includes(file.toLowerCase())
      )
    );
  };

  const completeLevel = (level: number) => {
    if (!completedLevels.includes(level) && checkLevelCompletion(level)) {
      setCompletedLevels(prev => [...prev, level]);
      
      // If there's a next level, unlock it
      if (level < roadmapData.length) {
        setActiveLevel(level + 1);
        setExpandedLevel(level + 1);
      }
    }
  };

  const isLevelLocked = (level: number) => {
    // Level 1 is always unlocked
    if (level === 1) return false;
    
    // Level is unlocked if the previous level is completed
    return !completedLevels.includes(level - 1);
  };

  const toggleExpandLevel = (level: number) => {
    if (isLevelLocked(level)) return;
    
    setExpandedLevel(expandedLevel === level ? null : level);
    setActiveLevel(level);
  };

  const handleKeyDown = (event: React.KeyboardEvent, level: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isLevelLocked(level)) {
        toggleExpandLevel(level);
      }
    }
  };

  return (
    <div className="space-y-16">
      {/* Interactive Map */}
      <div className="relative h-[400px] w-full rounded-xl overflow-hidden p-8 bg-gradient-to-r from-[#0a192f] to-[#0f2942] border border-indigo-900/40">
        {/* Decorative Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-blue-900/10 to-transparent"></div>
          <div className="absolute w-full h-full opacity-10" style={{ backgroundImage: 'url(/grid-pattern.svg)' }}></div>
        </div>
        
        {/* Path lines */}
        <svg className="absolute inset-0 w-full h-full z-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          
          {/* Connection lines between nodes */}
          <path 
            d={`M ${roadmapData[0].x} ${roadmapData[0].y} L ${roadmapData[1].x} ${roadmapData[1].y}`} 
            stroke={completedLevels.includes(1) ? "url(#pathGradient)" : "#1e293b"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={completedLevels.includes(1) ? "0" : "5,5"}
            fill="none"
          />
          <path 
            d={`M ${roadmapData[1].x} ${roadmapData[1].y} L ${roadmapData[2].x} ${roadmapData[2].y}`} 
            stroke={completedLevels.includes(2) ? "url(#pathGradient)" : "#1e293b"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={completedLevels.includes(2) ? "0" : "5,5"}
            fill="none"
          />
          <path 
            d={`M ${roadmapData[2].x} ${roadmapData[2].y} L ${roadmapData[3].x} ${roadmapData[3].y}`} 
            stroke={completedLevels.includes(3) ? "url(#pathGradient)" : "#1e293b"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={completedLevels.includes(3) ? "0" : "5,5"}
            fill="none"
          />
          <path 
            d={`M ${roadmapData[3].x} ${roadmapData[3].y} L ${roadmapData[4].x} ${roadmapData[4].y}`} 
            stroke={completedLevels.includes(4) ? "url(#pathGradient)" : "#1e293b"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={completedLevels.includes(4) ? "0" : "5,5"}
            fill="none"
          />
        </svg>
        
        {/* Map Nodes */}
        <div className="relative z-10 h-full">
          {roadmapData.map((level) => (
            <motion.div
              key={level.level}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: isLevelLocked(level.level) ? 0.5 : 1,
                x: activeLevel === level.level ? 5 : 0,
                y: activeLevel === level.level ? -5 : 0,
              }}
              transition={{ 
                duration: 0.4, 
                delay: level.level * 0.1,
              }}
              style={{
                position: 'absolute',
                left: level.x,
                top: level.y,
                transform: 'translate(-50%, -50%)',
              }}
              className={`cursor-pointer ${isLevelLocked(level.level) ? 'cursor-not-allowed' : ''}`}
              onClick={() => toggleExpandLevel(level.level)}
              onKeyDown={(event) => handleKeyDown(event, level.level)}
              tabIndex={0}
            >
              <div className="relative">
                {/* Node */}
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
                    completedLevels.includes(level.level)
                      ? `bg-gradient-to-r ${level.color} border-2 border-white/10`
                      : isLevelLocked(level.level)
                      ? 'bg-gray-800/80 border border-gray-700'
                      : `bg-gradient-to-r ${level.color} opacity-80 border border-white/10`
                  } ${
                    activeLevel === level.level
                      ? 'ring-4 ring-indigo-500/30 scale-110'
                      : ''
                  }`}
                >
                  {completedLevels.includes(level.level) ? (
                    <FiCheck size={24} className="text-white" />
                  ) : isLevelLocked(level.level) ? (
                    <FiLock size={20} className="text-gray-500" />
                  ) : (
                    <span className="font-bold text-xl text-white">{level.level}</span>
                  )}
                </div>
                
                {/* Label */}
                <div 
                  className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap text-center ${
                    activeLevel === level.level ? 'text-white font-medium' : 'text-gray-400'
                  }`}
                >
                  <span>{level.title.split('–')[0].trim()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Timeline View */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
          <CgPathTrim className="mr-2 text-indigo-400" size={24} />
          Your Learning Journey
          <div className="ml-auto px-3 py-1 text-sm font-medium rounded-full bg-indigo-900/50 text-indigo-300 border border-indigo-800/50">
            {completedLevels.length}/5 Levels
          </div>
        </h2>
        
        <div className="relative pb-10">
          {/* Timeline line */}
          <div className="absolute left-8 top-6 bottom-0 w-0.5 bg-gradient-to-b from-indigo-600 via-purple-500 to-indigo-800"></div>
          
          {/* Levels */}
          <div className="space-y-10">
            {roadmapData.map((level) => (
              <div key={level.level}>
                <div 
                  className={`flex items-start cursor-pointer ${isLevelLocked(level.level) ? 'opacity-50' : ''}`}
                  onClick={() => toggleExpandLevel(level.level)}
                  onKeyDown={(event) => handleKeyDown(event, level.level)}
                  tabIndex={0}
                >
                  {/* Level indicator */}
                  <div 
                    className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${
                      completedLevels.includes(level.level)
                        ? `bg-gradient-to-r ${level.color} shadow-lg shadow-purple-600/20`
                        : isLevelLocked(level.level)
                        ? 'bg-gray-800 border border-gray-700'
                        : `bg-gradient-to-r ${level.color} opacity-80`
                    } ${
                      activeLevel === level.level
                        ? 'ring-4 ring-indigo-500/30 scale-110'
                        : ''
                    }`}
                  >
                    {completedLevels.includes(level.level) ? (
                      <FiCheck size={24} className="text-white" />
                    ) : isLevelLocked(level.level) ? (
                      <FiLock size={22} className="text-gray-500" />
                    ) : (
                      <span className="font-bold text-xl text-white">{level.level}</span>
                    )}
                  </div>
                  
                  {/* Level title and description */}
                  <div className="ml-6 flex-1">
                    <h3 className="text-xl font-semibold text-white flex items-center group">
                      {level.title}
                      {completedLevels.includes(level.level) && (
                        <span className="ml-3 text-xs px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full">
                          Completed
                        </span>
                      )}
                      <FiChevronRight 
                        className={`ml-2 text-indigo-400 transition-transform duration-300 ${
                          expandedLevel === level.level ? 'rotate-90' : 'rotate-0'
                        } ${isLevelLocked(level.level) ? 'opacity-30' : 'group-hover:translate-x-1'}`} 
                        size={18} 
                      />
                    </h3>
                    <p className="text-gray-400 mt-1">{level.description}</p>
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedLevel === level.level && !isLevelLocked(level.level) && (
                    <RoadmapLevelDetail 
                      level={level} 
                      fileUploads={fileUploads[level.level] || []}
                      onFileUpload={(e) => handleFileUpload(level.level, e)}
                      isCompleted={completedLevels.includes(level.level)}
                      canComplete={checkLevelCompletion(level.level)}
                      onComplete={() => completeLevel(level.level)}
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapTimeline; 