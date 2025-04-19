'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Custom logger for NextAuth
const customLogger = {
  error: (code: string, metadata: any) => {
    console.error(`NextAuth Error [${code}]:`, metadata);
  },
  warn: (code: string) => {
    console.warn(`NextAuth Warning [${code}]`);
  },
  debug: (code: string, metadata: any) => {
    console.log(`NextAuth Debug [${code}]:`, metadata);
  },
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider logger={customLogger} refetchInterval={5 * 60}>
      <AuthProvider>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              style: {
                background: '#166534',
              },
            },
            error: {
              style: {
                background: '#991b1b',
              },
            },
          }}
        />
      </AuthProvider>
    </SessionProvider>
  );
} 