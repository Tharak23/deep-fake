'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiBookmark, 
  FiLink, 
  FiClock,
  FiUser,
  FiTag,
  FiPlus,
  FiCopy,
  FiEye
} from 'react-icons/fi';

type PaperTag = 'All' | 'Facial' | 'Audio' | 'Video' | 'GAN' | 'Detection' | 'Analysis';
type CitationFormat = 'APA' | 'IEEE' | 'MLA' | 'Chicago';

const PaperRepository = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<PaperTag[]>(['All']);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedPaper, setExpandedPaper] = useState<number | null>(null);
  const [citationFormat, setCitationFormat] = useState<CitationFormat>('IEEE');
  
  // Mock data for papers
  const papers = [
    {
      id: 1,
      title: 'Advanced Facial Manipulation Detection Using Transformer-Based Architecture',
      authors: ['Sarah Chen', 'Michael Rodriguez'],
      abstract: 'This paper presents a novel approach to detecting facial manipulations in deepfake videos using a transformer-based architecture. Our method achieves state-of-the-art results on multiple benchmark datasets, with an average accuracy of 97.3%.',
      tags: ['Facial', 'Detection', 'GAN'],
      date: 'March 15, 2023',
      journal: 'IEEE Transactions on Image Processing',
      doi: '10.1109/TIP.2023.1234567',
      citations: 24,
      downloads: 156,
      bookmarked: true,
    },
    {
      id: 2,
      title: 'Temporal Inconsistency Detection in DeepFake Videos',
      authors: ['James Wilson', 'Aisha Patel', 'Sarah Chen'],
      abstract: 'We propose a method for detecting deepfake videos by analyzing temporal inconsistencies between frames. Our approach focuses on subtle motion patterns that are difficult for generative models to replicate consistently across video sequences.',
      tags: ['Video', 'Detection', 'Analysis'],
      date: 'January 8, 2023',
      journal: 'Computer Vision and Pattern Recognition (CVPR)',
      doi: '10.1109/CVPR.2023.7654321',
      citations: 18,
      downloads: 132,
      bookmarked: false,
    },
    {
      id: 3,
      title: 'Audio DeepFake Detection: Challenges and Solutions',
      authors: ['Aisha Patel', 'Emily Zhang'],
      abstract: 'This paper addresses the growing challenge of detecting audio deepfakes. We present a comprehensive analysis of current detection methods and propose a new approach based on spectral analysis and neural network classification.',
      tags: ['Audio', 'Detection', 'Analysis'],
      date: 'November 22, 2022',
      journal: 'IEEE/ACM Transactions on Audio, Speech, and Language Processing',
      doi: '10.1109/TASLP.2022.9876543',
      citations: 31,
      downloads: 205,
      bookmarked: true,
    },
    {
      id: 4,
      title: 'GAN Fingerprinting for DeepFake Attribution',
      authors: ['Michael Rodriguez', 'James Wilson'],
      abstract: 'We demonstrate that generative adversarial networks (GANs) leave unique fingerprints in their outputs, which can be used to identify the specific model used to create a deepfake. This attribution method achieves 92.7% accuracy across five popular GAN architectures.',
      tags: ['GAN', 'Analysis', 'Facial'],
      date: 'August 5, 2022',
      journal: 'Neural Information Processing Systems (NeurIPS)',
      doi: '10.1109/NEURIPS.2022.5432167',
      citations: 42,
      downloads: 278,
      bookmarked: false,
    },
  ];

  const handleTagToggle = (tag: PaperTag) => {
    if (tag === 'All') {
      setSelectedTags(['All']);
    } else {
      const newTags = selectedTags.filter(t => t !== 'All');
      if (newTags.includes(tag)) {
        const updatedTags = newTags.filter(t => t !== tag);
        setSelectedTags(updatedTags.length === 0 ? ['All'] : updatedTags);
      } else {
        setSelectedTags([...newTags, tag]);
      }
    }
  };

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = selectedTags.includes('All') || 
                       paper.tags.some(tag => selectedTags.includes(tag as PaperTag));
    
    return matchesSearch && matchesTags;
  });

  const togglePaperExpand = (id: number) => {
    if (expandedPaper === id) {
      setExpandedPaper(null);
    } else {
      setExpandedPaper(id);
    }
  };

  const getCitation = (paper: typeof papers[0], format: CitationFormat) => {
    switch (format) {
      case 'APA':
        return `${paper.authors.join(', ')}. (${paper.date.split(' ')[1]}). ${paper.title}. ${paper.journal}. https://doi.org/${paper.doi}`;
      case 'IEEE':
        return `${paper.authors.map((a, i) => i === 0 ? a : a.split(' ')[1] + ', ' + a.split(' ')[0][0] + '.').join(', ')}, "${paper.title}," ${paper.journal}, ${paper.date.split(' ')[1]}, doi: ${paper.doi}.`;
      case 'MLA':
        return `${paper.authors[0].split(' ')[1]}, ${paper.authors[0].split(' ')[0]}${paper.authors.length > 1 ? ', et al' : ''}. "${paper.title}." ${paper.journal}, ${paper.date}.`;
      case 'Chicago':
        return `${paper.authors.join(', ')}. "${paper.title}." ${paper.journal} (${paper.date.split(' ')[1]}). https://doi.org/${paper.doi}.`;
      default:
        return '';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you would show a toast notification here
  };

  const allTags: PaperTag[] = ['All', 'Facial', 'Audio', 'Video', 'GAN', 'Detection', 'Analysis'];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card overflow-hidden"
      >
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-2xl font-bold mb-6">Research Paper Repository</h2>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search papers by title, author, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-[var(--card-bg)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] text-white"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-md hover:bg-[var(--muted)]/30 transition-colors duration-300"
            >
              <FiFilter className="mr-2 text-[var(--secondary)]" size={18} />
              <span>Filters</span>
            </button>
            
            <button className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-md hover:opacity-90 transition-opacity duration-300">
              <FiPlus className="mr-2" size={18} />
              <span>Upload Paper</span>
            </button>
          </div>
          
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 bg-[var(--card-bg)]/50 rounded-md border border-[var(--border)]"
            >
              <h3 className="text-sm font-medium mb-3">Filter by tags:</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-[var(--secondary)] text-black'
                        : 'bg-[var(--muted)]/30 text-gray-300 hover:bg-[var(--muted)]/50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="divide-y divide-[var(--border)]">
          {filteredPapers.length === 0 ? (
            <div className="p-8 text-center">
              <FiFileText className="mx-auto text-gray-500 mb-3" size={40} />
              <p className="text-gray-400">No papers match your search criteria</p>
              <p className="text-gray-500 text-sm mt-1">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            filteredPapers.map((paper) => (
              <div key={paper.id} className="p-6 hover:bg-[var(--muted)]/10 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center mb-2">
                      <FiFileText className="text-[var(--secondary)] mr-3" size={20} />
                      <h3 
                        className="text-xl font-bold text-white hover:text-[var(--secondary)] transition-colors duration-200 cursor-pointer"
                        onClick={() => togglePaperExpand(paper.id)}
                      >
                        {paper.title}
                      </h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center text-sm text-gray-400 mb-3 gap-x-4 gap-y-2">
                      <span className="flex items-center">
                        <FiUser className="mr-1" size={14} />
                        {paper.authors.join(', ')}
                      </span>
                      <span className="flex items-center">
                        <FiClock className="mr-1" size={14} />
                        {paper.date}
                      </span>
                      <span className="flex items-center">
                        <FiTag className="mr-1" size={14} />
                        {paper.journal}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-4">
                      {expandedPaper === paper.id 
                        ? paper.abstract 
                        : `${paper.abstract.substring(0, 180)}${paper.abstract.length > 180 ? '...' : ''}`}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {paper.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-[var(--muted)]/30 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <button 
                      className={`p-2 rounded-full ${paper.bookmarked ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'bg-[var(--muted)]/20 text-gray-400 hover:text-white'} transition-colors duration-200`}
                      aria-label={paper.bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                    >
                      <FiBookmark size={16} />
                    </button>
                    <button 
                      className="p-2 rounded-full bg-[var(--muted)]/20 text-gray-400 hover:text-white transition-colors duration-200"
                      aria-label="Download paper"
                    >
                      <FiDownload size={16} />
                    </button>
                    <button 
                      className="p-2 rounded-full bg-[var(--muted)]/20 text-gray-400 hover:text-white transition-colors duration-200"
                      aria-label="View paper"
                    >
                      <FiEye size={16} />
                    </button>
                  </div>
                </div>
                
                {expandedPaper === paper.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-4 bg-[var(--card-bg)]/50 rounded-md border border-[var(--border)]"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Citation</h4>
                        <div className="flex items-center space-x-2">
                          <select
                            value={citationFormat}
                            onChange={(e) => setCitationFormat(e.target.value as CitationFormat)}
                            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-md text-xs px-2 py-1 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[var(--secondary)]"
                            aria-label="Citation format"
                          >
                            <option value="IEEE">IEEE</option>
                            <option value="APA">APA</option>
                            <option value="MLA">MLA</option>
                            <option value="Chicago">Chicago</option>
                          </select>
                          <button 
                            onClick={() => copyToClipboard(getCitation(paper, citationFormat))}
                            className="p-1 text-gray-400 hover:text-white transition-colors duration-200"
                            aria-label="Copy citation"
                          >
                            <FiCopy size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Citations</p>
                          <p className="text-lg font-bold text-white">{paper.citations}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Downloads</p>
                          <p className="text-lg font-bold text-white">{paper.downloads}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400">DOI</p>
                          <a 
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-[var(--secondary)] hover:underline text-sm"
                          >
                            <FiLink size={12} className="mr-1" />
                            {paper.doi}
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-300">
                      <p className="mb-2">{getCitation(paper, citationFormat)}</p>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={() => togglePaperExpand(paper.id)}
                        className="text-[var(--secondary)] hover:text-[var(--primary)] text-sm transition-colors duration-200"
                      >
                        Show Less
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card overflow-hidden"
      >
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold">AI-Generated Summaries</h2>
          <p className="text-gray-400 text-sm mt-1">
            Our AI automatically generates concise summaries of research papers to help you quickly understand key findings.
          </p>
        </div>
        
        <div className="p-6">
          <div className="bg-[var(--card-bg)]/50 rounded-md border border-[var(--border)] p-4 mb-4">
            <h3 className="font-medium text-white mb-2">Advanced Facial Manipulation Detection Using Transformer-Based Architecture</h3>
            <p className="text-gray-300 text-sm">
              This paper introduces a novel transformer-based architecture for detecting facial manipulations in deepfake videos. The approach achieves 97.3% accuracy across multiple benchmark datasets by focusing on spatial inconsistencies and temporal artifacts. The model uses a two-stage detection process: first identifying potential manipulation regions, then analyzing these regions in detail. Key innovations include a custom attention mechanism and a new loss function specifically designed for deepfake detection.
            </p>
          </div>
          
          <div className="bg-[var(--card-bg)]/50 rounded-md border border-[var(--border)] p-4">
            <h3 className="font-medium text-white mb-2">Audio DeepFake Detection: Challenges and Solutions</h3>
            <p className="text-gray-300 text-sm">
              This paper addresses the growing challenge of detecting audio deepfakes through spectral analysis and neural network classification. The authors identify three key vulnerabilities in current audio deepfake technologies: frequency inconsistencies, unnatural transitions, and background noise patterns. Their proposed detection method combines wavelet transforms with a specialized CNN architecture, achieving 94.8% detection accuracy on a diverse dataset of synthetic voice samples. The paper also discusses countermeasures being developed by deepfake creators and suggests future research directions.
            </p>
          </div>
        </div>
        
        <div className="p-4 bg-[var(--card-bg)]/50 border-t border-[var(--border)] text-center">
          <button className="text-[var(--secondary)] hover:text-[var(--primary)] text-sm transition-colors duration-200">
            Generate More Summaries
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaperRepository; 