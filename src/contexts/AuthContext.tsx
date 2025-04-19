'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Define provider data type
interface ProviderData {
  email?: string;
  id?: string;
  name?: string;
  image?: string;
  [key: string]: any; // For other provider-specific fields
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  bio?: string;
  specialization?: string;
  interests?: string;
  teamRegistered?: boolean;
  blogEnabled?: boolean;
  isVerified?: boolean;
  roadmapProgress?: number;
  roadmapLevel?: string;
  blogPosts?: any[];
  datasets?: any[];
  createdAt?: string;
  updatedAt?: string;
  providerData?: ProviderData[]; // Use the defined type instead of any[]
  contributions?: {
    papers: any[];
    datasets: any[];
    experiments: any[];
  };
}

interface AuthContextType {
  user: UserProfile | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  signIn: (provider?: string, options?: Record<string, unknown>) => Promise<any>;
  signOut: () => Promise<any>;
  refreshUserProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  getEmail: () => string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: 'loading',
  signIn,
  signOut,
  refreshUserProfile: async () => {},
  updateProfile: async () => false,
  getEmail: () => null
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status: sessionStatus } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  const [profileError, setProfileError] = useState<string | null>(null);
  const router = useRouter();

  const getEmail = () => {
    // First check our user profile
    if (userProfile?.email) return userProfile.email;
    
    // Then check session
    if (session?.user?.email) return session.user.email;
    
    // Check for Google auth format
    if (userProfile?.providerData?.[0]?.email) {
      return userProfile.providerData[0].email;
    }
    
    return null;
  };

  const fetchUserProfile = async () => {
    if (!session?.user) {
      setUserProfile(null);
      setStatus('unauthenticated');
      return;
    }
    
    try {
      console.log("Fetching user profile for user:", session.user);
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", response.status, errorData);
        throw new Error(`API returned status ${response.status}: ${errorData.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log("Received user profile data:", data);
      
      // Check if we have a valid user object
      if (data && (data.user || data._id)) {
        // Handle both response formats (data.user or direct user object)
        const userObj = data.user || data;
        
        // Extract provider data if available
        const providerData = userObj.providerData || 
          // @ts-expect-error - Session user might have providerData in some auth configurations
          (session.user.providerData as ProviderData[] | undefined) || 
          [];
        
        // Use type assertion to access extended session properties
        const sessionUser = session.user as any;
        
        // Ensure all required fields are present
        const userProfile: UserProfile = {
          id: userObj._id || userObj.id || sessionUser.id || '',
          name: userObj.name || sessionUser.name || 'User',
          email: userObj.email || sessionUser.email || getProviderEmail(providerData) || '',
          image: userObj.image || sessionUser.image || '',
          role: userObj.role || 'user',
          bio: userObj.bio || '',
          specialization: userObj.specialization || '',
          interests: userObj.interests || '',
          teamRegistered: userObj.teamRegistered || false,
          blogEnabled: userObj.blogEnabled || false,
          isVerified: userObj.isVerified || sessionUser.isVerified || false,
          roadmapProgress: userObj.roadmapProgress || sessionUser.roadmapProgress || 0,
          roadmapLevel: userObj.roadmapLevel || sessionUser.roadmapLevel || 'Beginner',
          blogPosts: userObj.blogPosts || [],
          datasets: userObj.datasets || [],
          createdAt: userObj.createdAt || new Date().toISOString(),
          updatedAt: userObj.updatedAt,
          providerData: providerData,
          contributions: userObj.contributions || {
            papers: [],
            datasets: [],
            experiments: []
          }
        };
        
        setUserProfile(userProfile);
        setStatus('authenticated');
        setLastRefresh(Date.now());
        setProfileError(null);
        return;
      } else {
        throw new Error('Invalid user profile data received');
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setProfileError((error as Error).message);
      // Fall back to session data
      fallbackToSessionData();
    }
  };
  
  const getProviderEmail = (providerData: ProviderData[]): string | undefined => {
    if (!providerData || !providerData.length) return undefined;
    return providerData[0]?.email;
  };
  
  const fallbackToSessionData = () => {
    console.log("Falling back to session data:", session?.user);
    if (session?.user) {
      // @ts-expect-error - Session user might have providerData in some auth configurations
      const providerData = (session.user.providerData as ProviderData[] | undefined) || [];
      
      // Use type assertion to access extended session properties
      const user = session.user as any;
      
      const sessionUser: UserProfile = {
        id: user.id || '',
        name: user.name || 'User',
        email: user.email || getProviderEmail(providerData) || '',
        image: user.image || '',
        role: user.role || 'user',
        isVerified: user.isVerified || false,
        roadmapProgress: user.roadmapProgress || 0,
        roadmapLevel: user.roadmapLevel || 'Beginner',
        blogEnabled: user.blogEnabled || false,
        providerData: providerData,
        contributions: { papers: [], datasets: [], experiments: [] }
      };
      setUserProfile(sessionUser);
      setStatus('authenticated');
    } else {
      setUserProfile(null);
      setStatus('unauthenticated');
    }
  };

  useEffect(() => {
    console.log("Auth status changed:", sessionStatus);
    console.log("Session data:", session);
    
    if (sessionStatus === 'loading') {
      setStatus('loading');
    } else if (sessionStatus === 'authenticated' && session?.user) {
      fetchUserProfile();
    } else if (sessionStatus === 'unauthenticated') {
      setUserProfile(null);
      setStatus('unauthenticated');
    }
  }, [sessionStatus, session]);

  const refreshUserProfile = async () => {
    console.log("Refreshing user profile...");
    // Only refresh if authenticated and not refreshed in the last 2 seconds
    if (sessionStatus === 'authenticated' && (Date.now() - lastRefresh) > 2000) {
      await fetchUserProfile();
      return;
    }
    
    console.log("Skipping refresh - either not authenticated or refreshed recently");
    return;
  };

  // Update profile function
  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!userProfile) return false;
    
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const updatedData = await response.json();
      
      // Update local state with the returned data
      setUserProfile(prev => prev ? { ...prev, ...updatedData.user } : null);
      setLastRefresh(Date.now());
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError((error as Error).message);
      return false;
    }
  };

  // Custom sign-out function that ensures proper cleanup
  const handleSignOut = async (options?: any) => {
    console.log("Signing out...");
    setUserProfile(null);
    setStatus('unauthenticated');
    setProfileError(null);
    return await signOut(options);
  };

  return (
    <AuthContext.Provider
      value={{
        user: userProfile,
        status,
        signIn,
        signOut: handleSignOut,
        refreshUserProfile,
        updateProfile,
        getEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 