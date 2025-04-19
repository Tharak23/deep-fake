'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiCheck, 
  FiX, 
  FiEdit, 
  FiUser, 
  FiShield, 
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
  FiAlertTriangle,
  FiFileText,
  FiExternalLink,
  FiBriefcase,
  FiMail,
  FiBookOpen,
  FiDatabase,
  FiAward,
  FiLoader,
  FiChevronUp,
  FiChevronDown
} from 'react-icons/fi';

type ResearcherLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

type Researcher = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
  roadmapProgress: number;
  roadmapLevel: ResearcherLevel;
  blogPosts: number;
  datasets: number;
  dateVerified: string;
  institution: string;
  position: string;
  field: string;
};

const VerifiedResearchers = () => {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [filteredResearchers, setFilteredResearchers] = useState<Researcher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'recent'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedResearcherId, setExpandedResearcherId] = useState<string | null>(null);
  const researchersPerPage = 5;

  useEffect(() => {
    const fetchResearchers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch from the API
        const response = await fetch('/api/researchers/verified');
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        if (data.researchers && Array.isArray(data.researchers)) {
          setResearchers(data.researchers);
          setFilteredResearchers(data.researchers);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        console.error('Error fetching researchers:', err);
        setError('Failed to load researchers data');
        // No mock data fallback - we'll show the error state instead
        setResearchers([]);
        setFilteredResearchers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResearchers();
  }, []);

  useEffect(() => {
    // Filter researchers based on search term and filter
    let result = [...researchers];
    
    if (searchTerm) {
      result = result.filter(
        researcher => 
          researcher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          researcher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          researcher.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          researcher.field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filter === 'active') {
      result = result.filter(researcher => researcher.roadmapProgress > 70);
    } else if (filter === 'recent') {
      result = result.sort((a, b) => 
        new Date(b.dateVerified).getTime() - new Date(a.dateVerified).getTime()
      );
    }
    
    setFilteredResearchers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [researchers, searchTerm, filter]);

  const indexOfLastResearcher = currentPage * researchersPerPage;
  const indexOfFirstResearcher = indexOfLastResearcher - researchersPerPage;
  const currentResearchers = filteredResearchers.slice(indexOfFirstResearcher, indexOfLastResearcher);
  const totalPages = Math.ceil(filteredResearchers.length / researchersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getLevelColor = (level: ResearcherLevel) => {
    switch (level) {
      case 'Beginner':
        return 'bg-blue-900/20 text-blue-400 border-blue-700/50';
      case 'Intermediate':
        return 'bg-green-900/20 text-green-400 border-green-700/50';
      case 'Advanced':
        return 'bg-purple-900/20 text-purple-400 border-purple-700/50';
      case 'Expert':
        return 'bg-amber-900/20 text-amber-400 border-amber-700/50';
      default:
        return 'bg-gray-900/20 text-gray-400 border-gray-700/50';
    }
  };
  
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const toggleResearcherDetails = (id: string) => {
    if (expandedResearcherId === id) {
      setExpandedResearcherId(null);
    } else {
      setExpandedResearcherId(id);
    }
  };

  const contactResearcher = (email: string) => {
    window.location.href = `mailto:${email}?subject=Regarding%20Your%20Research%20Contributions`;
  };

  return (
    <div className="bg-[var(--card-bg)] rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-md bg-[var(--primary)]/20 flex items-center justify-center mr-4">
            <FiUsers className="text-[var(--primary)]" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Verified Researchers</h2>
            <p className="text-sm text-gray-400">Manage researchers contributing to the platform</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search researchers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-md text-sm w-full focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'recent')}
            className="px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            aria-label="Filter researchers"
          >
            <option value="all">All Researchers</option>
            <option value="active">Most Active</option>
            <option value="recent">Recently Verified</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="p-12 flex justify-center items-center">
          <FiLoader className="animate-spin text-[var(--primary)] mr-3" size={24} />
          <p className="text-gray-400">Loading researchers data...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-900/10 border-b border-red-900/30 flex items-start">
          <FiAlertTriangle className="text-red-400 mt-1 mr-3 flex-shrink-0" size={20} />
          <p className="text-red-300">{error}</p>
        </div>
      ) : filteredResearchers.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-400">No researchers found matching your criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--bg)]/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Researcher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Roadmap Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contributions</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {currentResearchers.map((researcher) => (
                <React.Fragment key={researcher.id}>
                  <tr className="hover:bg-[var(--bg)]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          {researcher.avatar ? (
                            <img className="h-10 w-10 rounded-full" src={researcher.avatar} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]">
                              {researcher.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-[var(--card-bg)] flex items-center justify-center">
                            <FiAward className="text-white" size={12} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium">{researcher.name}</div>
                          <div className="text-sm text-gray-400">{researcher.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{researcher.institution}</div>
                      <div className="text-xs text-gray-400">{researcher.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden mr-2">
                          <div 
                            className={`h-full ${getProgressColor(researcher.roadmapProgress)}`}
                            style={{ width: `${researcher.roadmapProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{researcher.roadmapProgress}%</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${getLevelColor(researcher.roadmapLevel)}`}>
                          {researcher.roadmapLevel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <FiBookOpen className="text-blue-400 mr-1" size={14} />
                          <span className="text-sm">{researcher.blogPosts}</span>
                        </div>
                        <div className="flex items-center">
                          <FiDatabase className="text-purple-400 mr-1" size={14} />
                          <span className="text-sm">{researcher.datasets}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => contactResearcher(researcher.email)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                          aria-label={`Contact ${researcher.name}`}
                          title="Contact Researcher"
                        >
                          <FiMail size={16} />
                        </button>
                        <a
                          href={`/profile/${researcher.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-green-400 hover:text-green-300 transition-colors"
                          aria-label={`View ${researcher.name}'s profile`}
                          title="View Profile"
                        >
                          <FiExternalLink size={16} />
                        </a>
                        <button
                          onClick={() => toggleResearcherDetails(researcher.id)}
                          className="p-1.5 text-gray-400 hover:text-white transition-colors"
                          aria-label={expandedResearcherId === researcher.id ? "Hide details" : "Show details"}
                          title={expandedResearcherId === researcher.id ? "Hide Details" : "Show Details"}
                        >
                          {expandedResearcherId === researcher.id ? (
                            <FiChevronUp size={16} />
                          ) : (
                            <FiChevronDown size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {expandedResearcherId === researcher.id && (
                    <tr className="bg-[var(--bg)]/20">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-[var(--bg)]/30 p-4 rounded-lg">
                            <h4 className="font-medium text-sm text-gray-300 mb-2 flex items-center">
                              <FiBriefcase className="mr-2" size={14} />
                              Research Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-gray-400">Field: </span>
                                <span>{researcher.field}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Position: </span>
                                <span>{researcher.position}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Verified on: </span>
                                <span>{new Date(researcher.dateVerified).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-[var(--bg)]/30 p-4 rounded-lg">
                            <h4 className="font-medium text-sm text-gray-300 mb-2 flex items-center">
                              <FiBookOpen className="mr-2" size={14} />
                              Recent Blog Posts
                            </h4>
                            {researcher.blogPosts > 0 ? (
                              <ul className="space-y-2 text-sm">
                                <li className="truncate">
                                  <a href="#" className="text-blue-400 hover:underline">
                                    Advances in DeepFake Detection Methods
                                  </a>
                                </li>
                                {researcher.blogPosts > 1 && (
                                  <li className="truncate">
                                    <a href="#" className="text-blue-400 hover:underline">
                                      Ethical Considerations in AI Research
                                    </a>
                                  </li>
                                )}
                                {researcher.blogPosts > 2 && (
                                  <li className="truncate">
                                    <a href="#" className="text-blue-400 hover:underline">
                                      The Future of Synthetic Media
                                    </a>
                                  </li>
                                )}
                                {researcher.blogPosts > 3 && (
                                  <li>
                                    <a href="#" className="text-gray-400 text-xs hover:underline">
                                      View all {researcher.blogPosts} posts...
                                    </a>
                                  </li>
                                )}
                              </ul>
                            ) : (
                              <p className="text-gray-400 text-sm">No blog posts yet.</p>
                            )}
                          </div>
                          
                          <div className="bg-[var(--bg)]/30 p-4 rounded-lg">
                            <h4 className="font-medium text-sm text-gray-300 mb-2 flex items-center">
                              <FiDatabase className="mr-2" size={14} />
                              Datasets Contributed
                            </h4>
                            {researcher.datasets > 0 ? (
                              <ul className="space-y-2 text-sm">
                                <li className="truncate">
                                  <a href="#" className="text-purple-400 hover:underline">
                                    DeepFake Detection Dataset v2.1
                                  </a>
                                </li>
                                {researcher.datasets > 1 && (
                                  <li className="truncate">
                                    <a href="#" className="text-purple-400 hover:underline">
                                      Synthetic Voice Samples Collection
                                    </a>
                                  </li>
                                )}
                                {researcher.datasets > 2 && (
                                  <li className="truncate">
                                    <a href="#" className="text-purple-400 hover:underline">
                                      Facial Manipulation Benchmark
                                    </a>
                                  </li>
                                )}
                                {researcher.datasets > 3 && (
                                  <li>
                                    <a href="#" className="text-gray-400 text-xs hover:underline">
                                      View all {researcher.datasets} datasets...
                                    </a>
                                  </li>
                                )}
                              </ul>
                            ) : (
                              <p className="text-gray-400 text-sm">No datasets contributed yet.</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {!loading && !error && filteredResearchers.length > 0 && (
        <div className="px-6 py-4 bg-[var(--bg)]/20 border-t border-[var(--border)] flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium">{indexOfFirstResearcher + 1}</span> to{' '}
            <span className="font-medium">
              {indexOfLastResearcher > filteredResearchers.length
                ? filteredResearchers.length
                : indexOfLastResearcher}
            </span>{' '}
            of <span className="font-medium">{filteredResearchers.length}</span> researchers
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:bg-[var(--bg)] hover:text-white'
              }`}
              aria-label="Previous page"
            >
              <FiChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={`page-${number}`}
                onClick={() => paginate(number)}
                className={`w-8 h-8 rounded-md ${
                  currentPage === number
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-gray-400 hover:bg-[var(--bg)] hover:text-white'
                }`}
                aria-label={`Page ${number}`}
                aria-current={currentPage === number ? 'page' : undefined}
              >
                {number}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:bg-[var(--bg)] hover:text-white'
              }`}
              aria-label="Next page"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifiedResearchers; 