'use client';

import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ResearchSection from '@/components/ResearchSection';
import TeamSection from '@/components/TeamSection';
import StatsSection from '@/components/StatsSection';
import BlogSection from '@/components/BlogSection';
import CaseStudySection from '@/components/CaseStudySection';
import DemoSection from '@/components/DemoSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import Link from 'next/link';
import AuthDebug from '@/components/AuthDebug';

export default function Home() {
  const { user, status } = useAuth();

  return (
    <main>
      <Navbar />
      
      {/* Authentication Status Banner */}
      {status !== 'loading' && (
        <div className="fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg bg-[var(--card-bg)] border border-[var(--border)] max-w-xs">
          <h3 className="text-lg font-semibold mb-2">
            {status === 'authenticated' ? 'Authenticated ✅' : 'Not Authenticated ❌'}
          </h3>
          {status === 'authenticated' && user ? (
            <div className="text-sm">
              <p><span className="text-gray-400">Name:</span> {user.name}</p>
              <p><span className="text-gray-400">Email:</span> {user.email}</p>
              <p><span className="text-gray-400">Role:</span> {user.role}</p>
              <Link href="/profile" className="text-[var(--secondary)] hover:underline mt-2 inline-block">
                View Profile
              </Link>
            </div>
          ) : (
            <div className="text-sm">
              <p>You are not signed in.</p>
              <Link href="/auth" className="text-[var(--secondary)] hover:underline mt-2 inline-block">
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
      
      <Hero />
      <StatsSection />
      <ResearchSection />
      <TeamSection />
      <CaseStudySection />
      <DemoSection />
      <BlogSection />
      <ContactSection />
      <Footer />
      <AuthDebug />
    </main>
  );
}
