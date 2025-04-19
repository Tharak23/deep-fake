'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { RiAiGenerate } from 'react-icons/ri';

// Loading fallback for suspense
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Loading...</h1>
      </div>
    </div>
  );
}

const SignInContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  
  // Check for error or success in URL params
  useEffect(() => {
    const errorParam = searchParams?.get('error');
    if (errorParam) {
      if (errorParam === 'OAuthAccountNotLinked') {
        setError('An account with this email already exists. Please sign in with your original method.');
      } else if (errorParam === 'CredentialsSignin') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('An error occurred during sign in. Please try again.');
      }
    }
    
    const successParam = searchParams?.get('success');
    if (successParam) {
      setSuccess('Sign in successful! Redirecting...');
      setTimeout(() => {
        router.push(callbackUrl);
      }, 1500);
    }
  }, [searchParams, callbackUrl, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl
      });
      
      if (result?.error) {
        setError(result.error === 'CredentialsSignin' 
          ? 'Invalid email or password. Please try again.' 
          : result.error);
        return;
      }
      
      setSuccess('Sign in successful! Redirecting...');
      setTimeout(() => {
        router.push(callbackUrl);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError(null);
      
      await signIn('google', {
        callbackUrl,
      });
      
      // Note: The above will redirect, so the code below won't execute
      // unless there's an error and redirect: false is set
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      setError('An unexpected error occurred. Please try again.');
      setGoogleLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <RiAiGenerate className="h-10 w-10 text-[var(--secondary)]" />
            <span className="text-2xl font-bold text-white ml-2">
              <span className="text-[var(--secondary)]">Deep</span>
              <span className="text-[var(--accent)]">Fake</span>
              <span>Lab</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
          <p className="text-gray-400">
            Access the DeepFake Detection Research Platform
          </p>
        </div>
        
        <div className="bg-[#1a1a1a] rounded-lg shadow-xl p-8">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-md p-3 mb-6 flex items-center">
              <FiAlertCircle className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/20 border border-green-500/30 text-green-400 rounded-md p-3 mb-6 flex items-center">
              <FiAlertCircle className="mr-2 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] text-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 px-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 bg-[var(--secondary)] text-white rounded-md hover:bg-[var(--secondary)]/90 transition-colors duration-200 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1a1a1a] text-gray-400">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className={`w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-white bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors duration-200 ${
                  googleLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {googleLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting to Google...
                  </span>
                ) : (
                  <>
                    <FcGoogle className="h-5 w-5 mr-2" />
                    <span>Google</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-[var(--secondary)] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignInPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SignInContent />
    </Suspense>
  );
};

export default SignInPage; 