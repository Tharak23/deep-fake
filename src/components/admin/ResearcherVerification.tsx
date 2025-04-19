'use client';

import { useState, useEffect } from 'react';
import { 
  FiCheckCircle, 
  FiX, 
  FiUser, 
  FiFileText, 
  FiExternalLink,
  FiClock,
  FiInfo,
  FiChevronDown,
  FiEye,
  FiLoader,
  FiAlertCircle,
  FiMail,
  FiBriefcase
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

// Define the verification request type
type VerificationRequest = {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  dateSubmitted: string;
  researchField: string;
  institution: string;
  position: string;
  publicationsCount: number;
  motivation: string;
  publicationLinks: string[];
  status: 'pending' | 'approved' | 'rejected';
  roadmapCompleted: boolean;
  reviewedBy?: string;
  reviewDate?: string;
  reviewNotes?: string;
  avatar?: string | null;
};

const ResearcherVerification = () => {
  const { user } = useAuth();
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [processedCount, setProcessedCount] = useState({ approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Fetch verification requests from the API
  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/verification-requests');
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Set verification requests
      setVerificationRequests(data.requests || []);
      
      // Calculate processed counts
      const approved = data.requests.filter((req: VerificationRequest) => req.status === 'approved').length;
      const rejected = data.requests.filter((req: VerificationRequest) => req.status === 'rejected').length;
      setProcessedCount({ approved, rejected });
      
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      setError('Failed to load verification requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    if (window.confirm('Are you sure you want to approve this researcher verification request?')) {
      try {
        setActionLoading(requestId);
        
        const response = await fetch('/api/admin/verification-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requestId,
            action: 'approve',
            notes: reviewNotes
          })
        });
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        // Update local state
        setVerificationRequests(
          verificationRequests.map((request) =>
            request._id === requestId ? { ...request, status: 'approved', reviewDate: new Date().toISOString(), reviewNotes } : request
          )
        );
        
        setProcessedCount(prev => ({ ...prev, approved: prev.approved + 1 }));
        setReviewNotes('');
        
      } catch (error) {
        console.error('Error approving request:', error);
        alert('Failed to approve request. Please try again.');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (window.confirm('Are you sure you want to reject this researcher verification request?')) {
      try {
        setActionLoading(requestId);
        
        const response = await fetch('/api/admin/verification-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requestId,
            action: 'reject',
            notes: reviewNotes
          })
        });
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        // Update local state
        setVerificationRequests(
          verificationRequests.map((request) =>
            request._id === requestId ? { ...request, status: 'rejected', reviewDate: new Date().toISOString(), reviewNotes } : request
          )
        );
        
        setProcessedCount(prev => ({ ...prev, rejected: prev.rejected + 1 }));
        setReviewNotes('');
        
      } catch (error) {
        console.error('Error rejecting request:', error);
        alert('Failed to reject request. Please try again.');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const toggleRequestDetails = (requestId: string) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
        <h2 className="text-xl font-bold text-white flex items-center">
          <FiCheckCircle className="mr-2" size={20} />
          Researcher Verification
        </h2>
        <p className="text-gray-400 mt-1">
          Review and approve researcher verification requests to grant access to advanced platform features.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Pending Requests</div>
            <div className="text-2xl font-bold text-white mt-1">{verificationRequests.filter(r => r.status === 'pending').length}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Approved (Total)</div>
            <div className="text-2xl font-bold text-green-400 mt-1">{processedCount.approved}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Rejected (Total)</div>
            <div className="text-2xl font-bold text-red-400 mt-1">{processedCount.rejected}</div>
          </div>
        </div>
      </div>
      
      {/* Guidelines section */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-800/40 rounded-lg p-5">
        <div className="flex items-start">
          <div className="p-2 bg-indigo-900/40 rounded-md mr-4">
            <FiInfo className="text-indigo-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Verification Guidelines</h3>
            <ul className="text-gray-300 mt-2 space-y-2 list-disc pl-5">
              <li>Verify the applicant's academic or research credentials</li>
              <li>Check for relevant publications or research experience</li>
              <li>Assess whether their research focus aligns with the platform's purpose</li>
              <li>Evaluate their motivation for requesting access</li>
              <li>Consider their institution's reputation if applicable</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Loading and error states */}
      {loading && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 flex justify-center items-center">
          <FiLoader className="animate-spin text-indigo-400 mr-3" size={24} />
          <p className="text-gray-300">Loading verification requests...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-900/10 border border-red-800/30 rounded-lg p-5 flex items-start">
          <FiAlertCircle className="text-red-400 mt-1 mr-3 flex-shrink-0" size={20} />
          <div>
            <h3 className="text-red-400 font-medium">Error Loading Requests</h3>
            <p className="text-red-300/80 text-sm mt-1">{error}</p>
            <button
              onClick={fetchVerificationRequests}
              className="mt-2 text-sm bg-red-900/30 hover:bg-red-900/50 text-red-300 px-3 py-1 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* Verification requests list */}
      {!loading && !error && verificationRequests.length === 0 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">No verification requests found.</p>
        </div>
      )}
      
      {!loading && !error && verificationRequests.length > 0 && (
        <div className="space-y-4">
          {verificationRequests.map((request) => (
            <div
              key={request._id}
              className={`bg-gray-900/50 border rounded-lg overflow-hidden transition-colors ${
                request.status === 'approved'
                  ? 'border-green-700 bg-green-900/5'
                  : request.status === 'rejected'
                  ? 'border-red-700 bg-red-900/5'
                  : 'border-gray-800'
              }`}
            >
              {/* Request header */}
              <div className="p-5">
                <div className="flex flex-col sm:flex-row justify-between">
                  {/* User info */}
                  <div className="flex items-center mb-4 sm:mb-0">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                      {request.avatar ? (
                        <img src={request.avatar} alt={request.userName} className="w-12 h-12 rounded-full" />
                      ) : (
                        <FiUser className="text-gray-400" size={24} />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-medium text-white">{request.userName}</div>
                      <div className="text-sm text-gray-400">{request.userEmail}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {request.institution} · {request.position}
                      </div>
                    </div>
                  </div>

                  {/* Status and actions */}
                  <div className="flex flex-col sm:items-end">
                    <div className="flex items-center mb-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                        request.status === 'approved'
                          ? 'bg-green-900/30 text-green-400'
                          : request.status === 'rejected'
                          ? 'bg-red-900/30 text-red-400'
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        {request.status === 'approved' ? (
                          <>
                            <FiCheckCircle className="mr-1" size={12} />
                            Approved
                          </>
                        ) : request.status === 'rejected' ? (
                          <>
                            <FiX className="mr-1" size={12} />
                            Rejected
                          </>
                        ) : (
                          <>
                            <FiClock className="mr-1" size={12} />
                            Pending Review
                          </>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 ml-2">
                        Submitted {new Date(request.dateSubmitted).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          disabled={actionLoading === request._id}
                          className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 text-xs rounded transition-colors flex items-center"
                        >
                          {actionLoading === request._id ? (
                            <FiLoader className="animate-spin mr-1" size={12} />
                          ) : (
                            <FiX className="mr-1" size={12} />
                          )}
                          Reject
                        </button>
                        
                        <button
                          onClick={() => handleApproveRequest(request._id)}
                          disabled={actionLoading === request._id}
                          className="px-3 py-1 bg-green-900/30 hover:bg-green-900/50 text-green-300 text-xs rounded transition-colors flex items-center"
                        >
                          {actionLoading === request._id ? (
                            <FiLoader className="animate-spin mr-1" size={12} />
                          ) : (
                            <FiCheckCircle className="mr-1" size={12} />
                          )}
                          Approve
                        </button>
                        
                        <button
                          onClick={() => toggleRequestDetails(request._id)}
                          className="px-3 py-1 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 text-xs rounded transition-colors flex items-center"
                        >
                          <FiEye className="mr-1" size={12} />
                          {expandedRequest === request._id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                    )}
                    
                    {(request.status === 'approved' || request.status === 'rejected') && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleRequestDetails(request._id)}
                          className="px-3 py-1 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 text-xs rounded transition-colors flex items-center"
                        >
                          <FiEye className="mr-1" size={12} />
                          {expandedRequest === request._id ? 'Hide Details' : 'View Details'}
                        </button>
                        
                        <a
                          href={`mailto:${request.userEmail}`}
                          className="px-3 py-1 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 text-xs rounded transition-colors flex items-center"
                        >
                          <FiMail className="mr-1" size={12} />
                          Contact
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Expanded details */}
                {expandedRequest === request._id && (
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-medium mb-3">Researcher Information</h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <FiBriefcase className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={16} />
                            <div>
                              <div className="text-xs text-gray-500">Institution</div>
                              <div className="text-sm text-white">{request.institution}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <FiUser className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={16} />
                            <div>
                              <div className="text-xs text-gray-500">Position</div>
                              <div className="text-sm text-white">{request.position}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <FiFileText className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={16} />
                            <div>
                              <div className="text-xs text-gray-500">Research Field</div>
                              <div className="text-sm text-white">{request.researchField}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <FiFileText className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={16} />
                            <div>
                              <div className="text-xs text-gray-500">Publications</div>
                              <div className="text-sm text-white">{request.publicationsCount} publications</div>
                            </div>
                          </div>
                          
                          {request.publicationLinks && request.publicationLinks.length > 0 && (
                            <div className="flex items-start">
                              <FiExternalLink className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={16} />
                              <div>
                                <div className="text-xs text-gray-500">Publication Links</div>
                                <div className="space-y-1 mt-1">
                                  {request.publicationLinks.map((link, index) => (
                                    <a
                                      key={index}
                                      href={link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block text-sm text-blue-400 hover:text-blue-300 truncate max-w-xs"
                                    >
                                      {link}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-start">
                            <FiInfo className="text-gray-400 mt-1 mr-2 flex-shrink-0" size={16} />
                            <div>
                              <div className="text-xs text-gray-500">Roadmap Completed</div>
                              <div className="text-sm text-white">{request.roadmapCompleted ? 'Yes' : 'No'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-3">Motivation</h4>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <p className="text-gray-300 text-sm whitespace-pre-line">{request.motivation}</p>
                        </div>
                        
                        {request.status === 'pending' && (
                          <div className="mt-4">
                            <label htmlFor={`notes-${request._id}`} className="block text-sm font-medium text-gray-300 mb-1">
                              Review Notes (Optional)
                            </label>
                            <textarea
                              id={`notes-${request._id}`}
                              value={reviewNotes}
                              onChange={(e) => setReviewNotes(e.target.value)}
                              rows={3}
                              placeholder="Add notes about this verification request..."
                              className="w-full bg-gray-800/70 border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        )}
                        
                        {request.reviewNotes && (
                          <div className="mt-4">
                            <h4 className="text-white font-medium mb-2">Review Notes</h4>
                            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                              <p className="text-gray-300 text-sm">{request.reviewNotes}</p>
                              {request.reviewDate && (
                                <p className="text-gray-500 text-xs mt-2">
                                  Reviewed on {new Date(request.reviewDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearcherVerification; 