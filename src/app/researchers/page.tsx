'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  FiUsers, 
  FiSearch, 
  FiFilter, 
  FiBookOpen, 
  FiDatabase, 
  FiExternalLink,
  FiAward,
  FiLoader,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import Link from 'next/link';

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

export default function ResearchersPage() {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [filteredResearchers, setFilteredResearchers] = useState<Researcher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'progress' | 'contributions' | 'field'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const researchersPerPage = 10;

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
      } catch (error) {
        console.error('Error fetching researchers:', error);
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
          researcher.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          researcher.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
          researcher.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filter === 'progress') {
      result = [...result].sort((a, b) => b.roadmapProgress - a.roadmapProgress);
    } else if (filter === 'contributions') {
      result = [...result].sort((a, b) => {
        const aTotal = a.blogPosts + a.datasets;
        const bTotal = b.blogPosts + b.datasets;
        return bTotal - aTotal;
      });
    } else if (filter === 'field') {
      result = [...result].sort((a, b) => a.field.localeCompare(b.field));
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Verified Researchers</h1>
            <p className="text-gray-400">
              Explore the community of verified researchers contributing to DeepFake research
            </p>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-md bg-blue-900/20 flex items-center justify-center mr-4">
                  <FiUsers className="text-blue-400" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Research Community</h2>
                  <p className="text-sm text-gray-400">
                    {filteredResearchers.length} verified researchers
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search researchers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>
                
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'progress' | 'contributions' | 'field')}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label="Filter researchers"
                >
                  <option value="all">All Researchers</option>
                  <option value="progress">Highest Progress</option>
                  <option value="contributions">Most Contributions</option>
                  <option value="field">By Research Field</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="p-12 flex justify-center items-center">
                <FiLoader className="animate-spin text-blue-500 mr-3" size={24} />
                <p className="text-gray-400">Loading researchers data...</p>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-900/10 border-b border-red-900/30 flex items-start">
                <FiAlertCircle className="text-red-400 mt-1 mr-3 flex-shrink-0" size={20} />
                <p className="text-red-300">{error}</p>
              </div>
            ) : filteredResearchers.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400">No researchers found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {currentResearchers.map((researcher) => (
                  <div 
                    key={researcher.id} 
                    className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:bg-gray-800/80 transition-colors"
                  >
                    <div className="p-5">
                      <div className="flex items-start mb-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                          {researcher.avatar ? (
                            <img 
                              src={researcher.avatar} 
                              alt={researcher.name} 
                              className="w-12 h-12 object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 font-semibold">
                              {researcher.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                            <FiAward size={10} className="text-white" />
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-white">{researcher.name}</h3>
                          <p className="text-sm text-gray-400">{researcher.institution}</p>
                          <div className="mt-1 flex items-center">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${getLevelColor(researcher.roadmapLevel)}`}>
                              {researcher.roadmapLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-sm text-gray-400 mb-1">Research Field</div>
                        <div className="text-white">{researcher.field}</div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-sm text-gray-400 mb-1">Roadmap Progress</div>
                        <div className="flex items-center">
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mr-2">
                            <div 
                              className={`h-full ${getProgressColor(researcher.roadmapProgress)}`}
                              style={{ width: `${researcher.roadmapProgress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-white">{researcher.roadmapProgress}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <FiBookOpen className="text-blue-400 mr-1" size={14} />
                            <span className="text-sm text-white">{researcher.blogPosts}</span>
                          </div>
                          <div className="flex items-center">
                            <FiDatabase className="text-purple-400 mr-1" size={14} />
                            <span className="text-sm text-white">{researcher.datasets}</span>
                          </div>
                        </div>
                        
                        <Link 
                          href={`/profile/${researcher.id}`}
                          className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                          aria-label={`View ${researcher.name}'s profile`}
                        >
                          <FiExternalLink size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && !error && filteredResearchers.length > 0 && (
              <div className="px-6 py-4 bg-gray-900/30 border-t border-gray-800 flex items-center justify-between">
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
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
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
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
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
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                    aria-label="Next page"
                  >
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Become a Verified Researcher</h2>
            <p className="text-gray-300 mb-4">
              Are you a researcher working in the field of DeepFake detection or related areas? 
              Join our community of verified researchers to contribute datasets, share knowledge, 
              and collaborate with peers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/roadmap" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-center transition-colors"
              >
                Complete the Roadmap
              </Link>
              <Link 
                href="/verification" 
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-center transition-colors"
              >
                Apply for Verification
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 