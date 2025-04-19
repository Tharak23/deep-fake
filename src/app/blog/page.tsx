'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiLoader } from 'react-icons/fi';

export default function BlogRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new deepfake-news page
    router.replace('/deepfake-news');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] flex flex-col items-center justify-center">
      <FiLoader className="animate-spin text-[var(--primary)]" size={48} />
      <p className="mt-4 text-white text-lg">Redirecting to DeepFake News & Info...</p>
    </div>
  );
} 