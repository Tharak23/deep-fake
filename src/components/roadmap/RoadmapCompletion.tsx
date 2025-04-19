'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCheck, 
  FiStar, 
  FiAward, 
  FiUnlock, 
  FiLoader, 
  FiAlertCircle, 
  FiBriefcase, 
  FiFileText, 
  FiLink, 
  FiX,
  FiCheckCircle
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const RoadmapCompletion = () => {
  const { user, status } = useAuth();
  const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    researchField: '',
    institution: '',
    position: '',
    publicationsCount: 0,
    motivation: '',
    publicationLinks: ['']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [roadmapCompleted, setRoadmapCompleted] = useState(false);
  
  // Check if user is already a researcher
  const isResearcher = user?.role === 'researcher';
  
  // Fetch verification request status on component mount
  useEffect(() => {
    if (status === 'authenticated' && user) {
      fetchVerificationStatus();
      
      // For demo purposes, we'll assume the roadmap is completed
      // In a real app, you would check the user's progress
      setRoadmapCompleted(true);
    }
  }, [status, user]);
  
  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch('/api/user/request-verification');
      const data = await response.json();
      
      if (response.ok) {
        setRequestStatus(data.status || 'none');
      } else {
        console.error('Error fetching verification status:', data.error);
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePublicationLinkChange = (index: number, value: string) => {
    const updatedLinks = [...formData.publicationLinks];
    updatedLinks[index] = value;
    setFormData(prev => ({
      ...prev,
      publicationLinks: updatedLinks
    }));
  };
  
  const addPublicationLink = () => {
    setFormData(prev => ({
      ...prev,
      publicationLinks: [...prev.publicationLinks, '']
    }));
  };
  
  const removePublicationLink = (index: number) => {
    const updatedLinks = formData.publicationLinks.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      publicationLinks: updatedLinks.length ? updatedLinks : ['']
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Filter out empty publication links
      const filteredLinks = formData.publicationLinks.filter(link => link.trim() !== '');
      
      const response = await fetch('/api/user/request-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          publicationLinks: filteredLinks,
          roadmapCompleted
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Your verification request has been submitted successfully!');
        setRequestStatus('pending');
        setShowForm(false);
      } else {
        setError(data.error || 'Failed to submit verification request');
      }
    } catch (error) {
      setError('An error occurred while submitting your request');
      console.error('Error submitting verification request:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderStatusMessage = () => {
    if (isResearcher) {
      return (
        <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 mt-4 flex items-start">
          <FiCheckCircle className="text-green-400 mt-1 mr-3 flex-shrink-0" size={20} />
          <div>
            <h3 className="text-green-400 font-medium">You are a Verified Researcher</h3>
            <p className="text-green-300/80 text-sm mt-1">
              You have full access to all researcher features including blog posting and file storage.
            </p>
          </div>
        </div>
      );
    }
    
    switch (requestStatus) {
      case 'pending':
        return (
          <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4 mt-4 flex items-start">
            <FiLoader className="text-amber-400 mt-1 mr-3 flex-shrink-0 animate-spin" size={20} />
            <div>
              <h3 className="text-amber-400 font-medium">Verification Request Pending</h3>
              <p className="text-amber-300/80 text-sm mt-1">
                Your request is being reviewed by our administrators. You'll be notified once it's processed.
              </p>
            </div>
          </div>
        );
      case 'approved':
        return (
          <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 mt-4 flex items-start">
            <FiCheck className="text-green-400 mt-1 mr-3 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-green-400 font-medium">Verification Request Approved</h3>
              <p className="text-green-300/80 text-sm mt-1">
                Your request has been approved! Please refresh the page or log out and log back in to access researcher features.
              </p>
            </div>
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 mt-4 flex items-start">
            <FiX className="text-red-400 mt-1 mr-3 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-red-400 font-medium">Verification Request Rejected</h3>
              <p className="text-red-300/80 text-sm mt-1">
                Your request was not approved. You can submit a new request with additional information.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-2 text-sm bg-red-900/30 hover:bg-red-900/50 text-red-300 px-3 py-1 rounded-md transition-colors"
              >
                Submit New Request
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-800/50 rounded-t-xl p-6">
        <div className="flex items-center mb-4">
          <div className="bg-indigo-900/50 p-3 rounded-lg mr-4">
            <FiAward className="text-indigo-300" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Research Access Verification</h2>
            <p className="text-indigo-300">Complete all levels to unlock full research platform access</p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
            <div className="flex items-center text-gray-300 mb-2">
              <FiStar className="mr-2 text-amber-400" size={18} />
              <h3 className="font-medium">Researcher Status</h3>
            </div>
            <div className="text-lg font-medium text-white">
              {isResearcher ? 'Verified Researcher' : 'Advanced Learner'}
            </div>
            <div className="mt-1 text-sm text-gray-400">
              {isResearcher ? 'Full platform access granted' : 'Level 3 expertise achieved'}
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
            <div className="flex items-center text-gray-300 mb-2">
              <FiCheck className="mr-2 text-green-400" size={18} />
              <h3 className="font-medium">Verification Requirements</h3>
            </div>
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <div className={`w-3 h-3 rounded-full ${roadmapCompleted ? 'bg-green-500' : 'bg-gray-600'} mr-2`}></div>
              <span>Complete all 5 learning levels</span>
            </div>
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Submit all required assignments</span>
            </div>
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Contribute to research community</span>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
            <div className="flex items-center text-gray-300 mb-2">
              <FiUnlock className="mr-2 text-purple-400" size={18} />
              <h3 className="font-medium">Research Access</h3>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              <p>Unlocks private datasets, advanced training models, and collaboration opportunities.</p>
            </div>
          </div>
        </div>
        
        {/* Status message */}
        {renderStatusMessage()}
        
        {/* Error and success messages */}
        {error && (
          <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 mt-4 flex items-start">
            <FiAlertCircle className="text-red-400 mt-1 mr-3 flex-shrink-0" size={20} />
            <p className="text-red-300">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 mt-4 flex items-start">
            <FiCheck className="text-green-400 mt-1 mr-3 flex-shrink-0" size={20} />
            <p className="text-green-300">{success}</p>
          </div>
        )}
      </div>
      
      <div className="bg-gradient-to-r from-indigo-950/50 to-purple-950/50 border-t border-indigo-900/30 p-6 rounded-b-xl">
        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-4">Researcher Verification Request</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="researchField" className="block text-sm font-medium text-gray-300 mb-1">
                  Research Field*
                </label>
                <input
                  type="text"
                  id="researchField"
                  name="researchField"
                  value={formData.researchField}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Computer Vision, NLP, etc."
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-300 mb-1">
                  Institution*
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Stanford University"
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-300 mb-1">
                  Position*
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., PhD Candidate, Professor"
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="publicationsCount" className="block text-sm font-medium text-gray-300 mb-1">
                  Number of Publications
                </label>
                <input
                  type="number"
                  id="publicationsCount"
                  name="publicationsCount"
                  value={formData.publicationsCount}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="motivation" className="block text-sm font-medium text-gray-300 mb-1">
                Motivation for Access*
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Explain why you need access to the research platform and how it will benefit your work..."
                className="w-full bg-gray-800/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Publication Links
              </label>
              {formData.publicationLinks.map((link, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => handlePublicationLinkChange(index, e.target.value)}
                    placeholder="https://example.com/publication"
                    className="flex-1 bg-gray-800/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => removePublicationLink(index)}
                    className="ml-2 p-2 text-gray-400 hover:text-red-400 transition-colors"
                    aria-label="Remove publication link"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addPublicationLink}
                className="mt-1 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-md transition-colors flex items-center"
              >
                <FiLink className="mr-1" size={14} />
                Add Publication Link
              </button>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-md shadow-lg shadow-indigo-900/30 transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" size={18} />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center mb-1">
                <h3 className="text-lg font-medium text-white">Ready to become a verified researcher?</h3>
              </div>
              <p className="text-indigo-300 text-sm">Request verification once you've completed all levels of the DeepFake research roadmap.</p>
            </div>
            
            {!isResearcher && requestStatus === 'none' && (
              <button
                onClick={() => setShowForm(true)} 
                className="px-5 py-2.5 rounded-lg font-medium transition-all min-w-[180px] bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-900/30"
                disabled={!roadmapCompleted}
                aria-label="Request verification to become a verified researcher"
              >
                Request Verification
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RoadmapCompletion; 