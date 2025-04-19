'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiUser, FiMail, FiEdit2, FiSave, FiX, FiLoader, FiCalendar, FiAward, FiFileText, FiDatabase, FiActivity, FiUpload, FiCheck, FiAlertCircle } from 'react-icons/fi';
import AuthDebug from '@/components/AuthDebug';

export default function ProfilePage() {
  const { user, status, refreshUserProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    console.log("Profile page - Auth status:", status);
    console.log("Profile page - User data:", user);
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/profile');
    }

    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setSpecialization(user.specialization || '');
      setInterests(user.interests || '');
      setProfileLoaded(true);
      
      // Check if user is new (no bio or specialization)
      const newUserCheck = !user.bio || !user.specialization;
      setIsNewUser(newUserCheck);
    }
  }, [user, status, router]);

  // Force refresh user profile when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      if (status === 'authenticated') {
        try {
          console.log("Refreshing user profile...");
          await refreshUserProfile();
          console.log("Profile refreshed successfully");
        } catch (error) {
          console.error("Error refreshing profile:", error);
          setError("Failed to load profile data. Please try again.");
        }
      }
    };
    
    loadProfile();
  }, [status, refreshUserProfile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      formData.append('specialization', specialization);
      formData.append('interests', interests);
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      console.log("Updating profile...");
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      console.log("Profile updated successfully:", data);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setImageFile(null);
      
      // Refresh user profile after update
      await refreshUserProfile();
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Replace the renderProfileCompletionStatus function with a simpler version
  const renderProfileCompletionStatus = () => {
    if (!user) return null;
    
    // Calculate completion percentage based on filled profile fields
    const fields = [user.name, user.bio, user.specialization, user.interests, user.image];
    const filledFields = fields.filter(Boolean).length;
    const completionPercentage = Math.round((filledFields / fields.length) * 100);
    
    if (completionPercentage === 100) return null; // Don't show if profile is complete
    
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6 flex items-center">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-400">Profile completion</span>
            <span className="text-xs text-gray-400">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="ml-4 text-xs bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 px-3 py-1.5 rounded transition-colors"
        >
          Complete
        </button>
      </div>
    );
  };

  if (status === 'loading' || !profileLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--secondary)] mb-4"></div>
        <p className="text-white">Loading your profile...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] flex flex-col items-center justify-center">
        <p className="text-white mb-4">Please sign in to view your profile</p>
        <button 
          onClick={() => router.push('/auth/signin?callbackUrl=/profile')}
          className="btn btn-primary"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white">Your Profile</h1>
              
              {/* Admin Dashboard Link */}
              {isAdmin && (
                <button
                  onClick={() => router.push('/admin')}
                  className="flex items-center px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors"
                >
                  <FiUser className="mr-2" />
                  Admin Dashboard
                </button>
              )}
            </div>

            {/* Optional Profile completion status */}
            {renderProfileCompletionStatus()}

            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-800 border-4 border-[var(--border)]">
                    {user?.image ? (
                      <img 
                        src={imagePreview || user.image} 
                        alt={user.name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-900/30 text-indigo-300">
                        <FiUser size={50} />
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <div className="absolute bottom-0 right-0">
                      <label htmlFor="profile-image" className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg transition-colors">
                        <FiUpload size={18} />
                        <input 
                          type="file" 
                          id="profile-image" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageChange}
                          aria-label="Upload profile picture"
                        />
                      </label>
                    </div>
                  )}
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="specialization" className="block text-sm font-medium text-gray-400 mb-1">Specialization</label>
                        <input
                          type="text"
                          id="specialization"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., Computer Vision, NLP, etc."
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="interests" className="block text-sm font-medium text-gray-400 mb-1">Research Interests</label>
                        <input
                          type="text"
                          id="interests"
                          value={interests}
                          onChange={(e) => setInterests(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., Deepfake Detection, Face Recognition"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                        <textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={4}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Tell us about yourself and your research background"
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setName(user?.name || '');
                            setBio(user?.bio || '');
                            setSpecialization(user?.specialization || '');
                            setInterests(user?.interests || '');
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center transition-colors"
                        >
                          <FiX className="mr-1" size={16} />
                          Cancel
                        </button>
                        
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center transition-colors"
                        >
                          {loading ? (
                            <>
                              <FiLoader className="animate-spin mr-1" size={16} />
                              Saving...
                            </>
                          ) : (
                            <>
                              <FiSave className="mr-1" size={16} />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 rounded-md text-sm transition-colors mt-2 md:mt-0"
                        >
                          <FiEdit2 className="mr-1" size={14} />
                          Edit Profile
                        </button>
                      </div>
                      
                      <div className="flex items-center text-gray-400 mb-4">
                        <FiMail className="mr-1" size={14} />
                        <span>{user?.email}</span>
                        {isAdmin && (
                          <span className="ml-2 px-2 py-0.5 bg-red-900/30 text-red-400 text-xs rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      
                      {user?.specialization && (
                        <div className="mb-2">
                          <span className="text-gray-400 text-sm">Specialization:</span>
                          <span className="ml-2 text-white">{user.specialization}</span>
                        </div>
                      )}
                      
                      {user?.interests && (
                        <div className="mb-2">
                          <span className="text-gray-400 text-sm">Research Interests:</span>
                          <span className="ml-2 text-white">{user.interests}</span>
                        </div>
                      )}
                      
                      {user?.bio && (
                        <div className="mt-4">
                          <span className="text-gray-400 text-sm block mb-1">Bio:</span>
                          <p className="text-gray-300">{user.bio}</p>
                        </div>
                      )}
                      
                      {user?.createdAt && (
                        <div className="mt-4 text-sm text-gray-500 flex items-center">
                          <FiCalendar className="mr-1" size={14} />
                          Member since {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {/* Error and Success Messages */}
              {error && (
                <div className="mx-8 mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center text-red-400">
                  <FiAlertCircle className="mr-2" size={16} />
                  <span>{error}</span>
                </div>
              )}
              
              {success && (
                <div className="mx-8 mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center text-green-400">
                  <FiCheck className="mr-2" size={16} />
                  <span>{success}</span>
                </div>
              )}
            </div>
            
            {/* Research Contributions Section */}
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FiAward className="mr-2 text-[var(--primary)]" />
                  Research Contributions
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center mb-2">
                      <FiFileText className="text-blue-400 mr-2" size={18} />
                      <h3 className="text-white font-medium">Papers</h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {user?.contributions?.papers?.length ? 
                        `${user.contributions.papers.length} published papers` : 
                        'No papers published yet'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center mb-2">
                      <FiDatabase className="text-green-400 mr-2" size={18} />
                      <h3 className="text-white font-medium">Datasets</h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {user?.contributions?.datasets?.length ? 
                        `${user.contributions.datasets.length} datasets contributed` : 
                        'No datasets contributed yet'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center mb-2">
                      <FiActivity className="text-purple-400 mr-2" size={18} />
                      <h3 className="text-white font-medium">Experiments</h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {user?.contributions?.experiments?.length ? 
                        `${user.contributions.experiments.length} experiments conducted` : 
                        'No experiments conducted yet'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Debug Information (only in development) */}
            {process.env.NODE_ENV === 'development' && <AuthDebug />}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
} 