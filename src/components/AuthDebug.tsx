'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from 'next-auth/react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function AuthDebug() {
  const { user, status, refreshUserProfile } = useAuth();
  const { data: session, status: sessionStatus } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 text-white hover:bg-[var(--muted)]/20"
        >
          <span className="font-medium">Auth Debug</span>
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {isOpen && (
          <div className="p-4 border-t border-[var(--border)] space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-1">Auth Context Status</h3>
              <p className="text-white bg-[var(--muted)]/30 p-2 rounded">{status}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-1">NextAuth Session Status</h3>
              <p className="text-white bg-[var(--muted)]/30 p-2 rounded">{sessionStatus}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-1">User Data</h3>
              <pre className="text-xs text-white bg-[var(--muted)]/30 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-1">Session Data</h3>
              <pre className="text-xs text-white bg-[var(--muted)]/30 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
            
            <button
              onClick={() => refreshUserProfile()}
              className="w-full bg-[var(--secondary)] text-black py-2 rounded hover:bg-[var(--secondary)]/80"
            >
              Refresh User Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 