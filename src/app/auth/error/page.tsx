'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';
import { RiAiGenerate } from 'react-icons/ri';

export default function AuthError() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    const errorParam = searchParams.get('error');
    
    if (errorParam) {
      switch (errorParam) {
        case 'Configuration':
          setError('There is a problem with the server configuration.');
          break;
        case 'AccessDenied':
          setError('You do not have permission to sign in.');
          break;
        case 'Verification':
          setError('The verification link may have been used or is no longer valid.');
          break;
        case 'OAuthSignin':
          setError('Error in the OAuth sign-in process. Please try again.');
          break;
        case 'OAuthCallback':
          setError('Error in the OAuth callback process. Please try again.');
          break;
        case 'OAuthCreateAccount':
          setError('Could not create a user account using the OAuth provider.');
          break;
        case 'EmailCreateAccount':
          setError('Could not create a user account using the email provider.');
          break;
        case 'Callback':
          setError('Error in the authentication callback process.');
          break;
        case 'OAuthAccountNotLinked':
          setError('This email is already associated with another account. Please sign in using the original method.');
          break;
        case 'EmailSignin':
          setError('Error sending the email for sign-in. Please try again.');
          break;
        case 'CredentialsSignin':
          setError('The email or password you entered is incorrect.');
          break;
        case 'SessionRequired':
          setError('You must be signed in to access this page.');
          break;
        default:
          setError('An unknown error occurred during authentication.');
      }
    } else {
      setError('An unknown error occurred during authentication.');
    }
  }, [searchParams]);

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
          <h1 className="text-3xl font-bold text-white mb-2">Authentication Error</h1>
        </div>
        
        <div className="card p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-red-500/20 rounded-full p-4">
              <FiAlertTriangle className="h-10 w-10 text-red-500" />
            </div>
          </div>
          
          <p className="text-center text-white text-lg mb-6">{error}</p>
          
          <div className="flex flex-col space-y-4">
            <Link
              href="/auth/signin"
              className="btn btn-primary flex items-center justify-center"
            >
              <FiArrowLeft className="mr-2" />
              Back to Sign In
            </Link>
            
            <Link
              href="/"
              className="text-gray-400 hover:text-white text-center transition-colors duration-300"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 