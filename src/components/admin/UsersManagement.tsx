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
  FiMail
} from 'react-icons/fi';

// Mock data for the demo
const mockUsers = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 'user', status: 'active', dateJoined: '2023-05-12', avatar: null },
  { id: 2, name: 'Alice Johnson', email: 'alice.j@example.com', role: 'verified_researcher', status: 'active', dateJoined: '2023-04-03', avatar: null },
  { id: 3, name: 'Robert Brown', email: 'robert.brown@example.com', role: 'user', status: 'pending', dateJoined: '2023-06-08', avatar: null, verificationRequest: { institution: 'Stanford University', position: 'PhD Candidate', field: 'Computer Vision', publications: 3, submissionDate: '2023-06-10' } },
  { id: 4, name: 'Emma Wilson', email: 'emma.w@example.com', role: 'verified_researcher', status: 'active', dateJoined: '2023-02-19', avatar: null },
  { id: 5, name: 'Michael Davis', email: 'michael.d@example.com', role: 'user', status: 'active', dateJoined: '2023-05-25', avatar: null },
  { id: 6, name: 'Sarah Martinez', email: 'sarah.m@example.com', role: 'user', status: 'suspended', dateJoined: '2023-03-30', avatar: null },
  { id: 7, name: 'David Thompson', email: 'david.t@example.com', role: 'user', status: 'active', dateJoined: '2023-06-15', avatar: null },
  { id: 8, name: 'Jennifer Garcia', email: 'jennifer.g@example.com', role: 'verified_researcher', status: 'active', dateJoined: '2023-01-22', avatar: null },
  { id: 9, name: 'William Clark', email: 'william.c@example.com', role: 'user', status: 'pending', dateJoined: '2023-06-20', avatar: null, verificationRequest: { institution: 'MIT', position: 'Assistant Professor', field: 'Deep Learning', publications: 8, submissionDate: '2023-06-22' } },
  { id: 10, name: 'Elizabeth Rodriguez', email: 'elizabeth.r@example.com', role: 'user', status: 'active', dateJoined: '2023-05-17', avatar: null },
];

type VerificationRequest = {
  institution: string;
  position: string;
  field: string;
  publications: number;
  submissionDate: string;
  status?: string;
  id?: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  dateJoined: string;
  avatar: string | null;
  verificationRequest?: VerificationRequest;
};

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'all' | 'verification'>('all');
  const [expandedRequestId, setExpandedRequestId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const usersPerPage = 6;

  useEffect(() => {
    // In a real app, this would be a fetch to your API
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    
    // Fetch verification requests
    fetchVerificationRequests();
  }, []);
  
  const fetchVerificationRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/verification-requests');
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update users with verification requests
      if (data.requests && data.requests.length > 0) {
        const updatedUsers = [...users];
        
        data.requests.forEach((request: any) => {
          const userIndex = updatedUsers.findIndex(user => 
            user.email.toLowerCase() === request.userEmail.toLowerCase()
          );
          
          if (userIndex !== -1) {
            updatedUsers[userIndex].verificationRequest = {
              institution: request.institution,
              position: request.position,
              field: request.researchField,
              publications: request.publicationsCount,
              submissionDate: request.dateSubmitted,
              status: request.status,
              id: request._id
            };
          }
        });
        
        setUsers(updatedUsers);
        applyFilters(updatedUsers, searchTerm, filter, viewMode);
      }
      
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      setError('Failed to load verification requests');
    } finally {
      setLoading(false);
    }
  };
  
  const applyFilters = (usersList: User[], search: string, roleFilter: string, mode: 'all' | 'verification') => {
    let result = usersList;
    
    // Filter by view mode first
    if (mode === 'verification') {
      result = result.filter(user => user.verificationRequest);
    }
    
    // Apply search filter
    if (search) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) || 
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply role/status filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter || user.status === roleFilter);
    }
    
    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page on filter change
  };

  useEffect(() => {
    applyFilters(users, searchTerm, filter, viewMode);
  }, [searchTerm, filter, users, viewMode]);

  const handlePromoteUser = async (userId: number) => {
    // Find the user
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // If the user has a verification request, use the API to approve it
    if (user.verificationRequest && user.verificationRequest.id) {
      try {
        const response = await fetch('/api/admin/verification-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requestId: user.verificationRequest.id,
            action: 'approve',
            notes: 'Approved from user management'
          })
        });
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        // Update local state
        setUsers(users.map(u => 
          u.id === userId 
            ? { ...u, role: 'researcher', status: 'active', verificationRequest: undefined } 
            : u
        ));
        
      } catch (error) {
        console.error('Error approving request:', error);
        alert('Failed to approve request. Please try again.');
        return;
      }
    } else {
      // Just update local state for demo
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: 'researcher', status: 'active' } 
          : user
      ));
    }
    
    // Close the expanded request if this user was being viewed
    if (expandedRequestId === userId) {
      setExpandedRequestId(null);
    }
  };

  const handleSuspendUser = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'suspended' ? 'active' : 'suspended' } 
        : user
    ));
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(user => user.id !== userId));
      // Close the expanded request if this user was being viewed
      if (expandedRequestId === userId) {
        setExpandedRequestId(null);
      }
    }
  };

  const handleRejectVerification = async (userId: number) => {
    // Find the user
    const user = users.find(u => u.id === userId);
    if (!user || !user.verificationRequest || !user.verificationRequest.id) return;
    
    if (window.confirm('Are you sure you want to reject this verification request?')) {
      try {
        const response = await fetch('/api/admin/verification-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requestId: user.verificationRequest.id,
            action: 'reject',
            notes: 'Rejected from user management'
          })
        });
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        // Update local state
        setUsers(users.map(u => 
          u.id === userId 
            ? { ...u, verificationRequest: undefined, status: 'active' } 
            : u
        ));
        
        // Close the expanded request
        setExpandedRequestId(null);
        
      } catch (error) {
        console.error('Error rejecting request:', error);
        alert('Failed to reject request. Please try again.');
      }
    }
  };

  const toggleRequestDetails = (userId: number) => {
    setExpandedRequestId(expandedRequestId === userId ? null : userId);
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Count verification requests
  const verificationRequestCount = users.filter(user => user.verificationRequest).length;

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <FiUsers className="mr-2" size={22} />
            User Management
          </h2>
          <p className="text-gray-400 text-sm">
            Manage users, control access, and verify researchers
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search users..." 
              className="px-3 py-2 pr-10 bg-gray-900/70 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white text-sm w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          
          <div className="relative inline-block">
            <select 
              className="px-3 py-2 pl-10 bg-gray-900/70 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white text-sm appearance-none w-full"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter users"
            >
              <option value="all">All Users</option>
              <option value="verified_researcher">Verified Researchers</option>
              <option value="user">Regular Users</option>
              <option value="active">Active Users</option>
              <option value="pending">Pending Users</option>
              <option value="suspended">Suspended Users</option>
            </select>
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      </div>
      
      {/* View toggle */}
      <div className="flex border border-gray-800 rounded-lg overflow-hidden">
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            viewMode === 'all' 
              ? 'bg-indigo-900/30 text-indigo-300 border-b-2 border-indigo-500' 
              : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/30'
          }`}
          onClick={() => setViewMode('all')}
          aria-label="View all users"
        >
          All Users
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium flex items-center justify-center ${
            viewMode === 'verification' 
              ? 'bg-indigo-900/30 text-indigo-300 border-b-2 border-indigo-500' 
              : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/30'
          }`}
          onClick={() => setViewMode('verification')}
          aria-label="View verification requests"
        >
          Verification Requests
          {verificationRequestCount > 0 && (
            <span className="ml-2 bg-amber-900/50 text-amber-300 text-xs px-2 py-0.5 rounded-full">
              {verificationRequestCount}
            </span>
          )}
        </button>
      </div>
      
      {/* User list table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date Joined
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-gray-900/30">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <React.Fragment key={user.id}>
                    <tr 
                      className={`hover:bg-gray-800/20 transition-colors ${
                        user.status === 'suspended' 
                          ? 'bg-red-900/5' 
                          : user.verificationRequest 
                            ? 'bg-amber-900/5'
                            : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                            {user.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                            ) : (
                              <FiUser className="text-gray-400" size={18} />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{user.name}</div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                            {user.verificationRequest && (
                              <div className="mt-1">
                                <span 
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-900/30 text-amber-300 cursor-pointer hover:bg-amber-900/50"
                                  onClick={() => toggleRequestDetails(user.id)}
                                >
                                  <FiFileText className="mr-1" size={10} />
                                  Verification Request
                                  {expandedRequestId === user.id ? (
                                    <FiChevronLeft className="ml-1" size={12} />
                                  ) : (
                                    <FiChevronRight className="ml-1" size={12} />
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'verified_researcher' 
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-gray-800 text-gray-300'
                        }`}>
                          {user.role === 'verified_researcher' ? (
                            <>
                              <FiShield className="mr-1" size={12} />
                              Verified Researcher
                            </>
                          ) : (
                            <>
                              <FiUser className="mr-1" size={12} />
                              Regular User
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-blue-900/30 text-blue-400'
                            : user.status === 'pending'
                            ? 'bg-yellow-900/30 text-yellow-400'
                            : 'bg-red-900/30 text-red-400'
                        }`}>
                          {user.status === 'active' ? (
                            <>
                              <FiCheck className="mr-1" size={12} />
                              Active
                            </>
                          ) : user.status === 'pending' ? (
                            <>
                              <svg className="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Pending
                            </>
                          ) : (
                            <>
                              <FiX className="mr-1" size={12} />
                              Suspended
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(user.dateJoined).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end space-x-2">
                          {user.role !== 'verified_researcher' && (
                            <button
                              onClick={() => handlePromoteUser(user.id)}
                              className="text-green-400 hover:text-green-300 transition-colors"
                              aria-label="Promote user"
                              title="Promote to Researcher"
                            >
                              <FiShield size={18} />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleSuspendUser(user.id)}
                            className={`${user.status === 'suspended' ? 'text-blue-400 hover:text-blue-300' : 'text-yellow-400 hover:text-yellow-300'} transition-colors`}
                            aria-label={user.status === 'suspended' ? 'Reactivate user' : 'Suspend user'}
                            title={user.status === 'suspended' ? 'Reactivate User' : 'Suspend User'}
                          >
                            {user.status === 'suspended' ? <FiCheck size={18} /> : <FiAlertTriangle size={18} />}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            aria-label="Delete user"
                            title="Delete User"
                          >
                            <FiX size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded verification request details */}
                    {user.verificationRequest && expandedRequestId === user.id && (
                      <tr className="bg-amber-900/10">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-amber-900/30">
                            <h4 className="text-white font-medium mb-3">Verification Request Details</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <div className="flex items-start mb-2">
                                  <FiBriefcase className="text-amber-400 mt-1 mr-2 flex-shrink-0" size={16} />
                                  <div>
                                    <div className="text-xs text-gray-400">Institution</div>
                                    <div className="text-sm text-white">{user.verificationRequest.institution}</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start mb-2">
                                  <FiUser className="text-amber-400 mt-1 mr-2 flex-shrink-0" size={16} />
                                  <div>
                                    <div className="text-xs text-gray-400">Position</div>
                                    <div className="text-sm text-white">{user.verificationRequest.position}</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex items-start mb-2">
                                  <FiFileText className="text-amber-400 mt-1 mr-2 flex-shrink-0" size={16} />
                                  <div>
                                    <div className="text-xs text-gray-400">Research Field</div>
                                    <div className="text-sm text-white">{user.verificationRequest.field}</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start">
                                  <FiExternalLink className="text-amber-400 mt-1 mr-2 flex-shrink-0" size={16} />
                                  <div>
                                    <div className="text-xs text-gray-400">Publications</div>
                                    <div className="text-sm text-white">{user.verificationRequest.publications} publications</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                              <div className="text-xs text-gray-400">
                                Submitted on {new Date(user.verificationRequest.submissionDate).toLocaleDateString()}
                              </div>
                              
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleRejectVerification(user.id)}
                                  className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 text-xs rounded transition-colors flex items-center"
                                >
                                  <FiX className="mr-1" size={12} />
                                  Reject
                                </button>
                                
                                <button
                                  onClick={() => handlePromoteUser(user.id)}
                                  className="px-3 py-1 bg-green-900/30 hover:bg-green-900/50 text-green-300 text-xs rounded transition-colors flex items-center"
                                >
                                  <FiCheck className="mr-1" size={12} />
                                  Approve
                                </button>
                                
                                <button
                                  onClick={() => window.open(`mailto:${user.email}`)}
                                  className="px-3 py-1 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 text-xs rounded transition-colors flex items-center"
                                >
                                  <FiMail className="mr-1" size={12} />
                                  Contact
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    {viewMode === 'verification' 
                      ? 'No verification requests found.' 
                      : 'No users found matching your filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              aria-label="Previous page"
            >
              <FiChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={`page-${number}`}
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded ${
                  currentPage === number
                    ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                aria-label={`Go to page ${number}`}
              >
                {number}
              </button>
            ))}
            
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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

export default UsersManagement; 