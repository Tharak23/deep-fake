import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import AdminDashboard from '@/components/DeepFakeNews/AdminDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DeepFake News Admin Dashboard',
  description: 'Manage DeepFake news articles, fetch new content, and schedule publications.',
};

export default async function DeepFakeNewsAdminPage() {
  // Check authentication and authorization on the server
  const session = await getServerSession(authOptions);
  
  // Redirect if not authenticated or not admin
  if (!session || session.user?.role !== 'admin') {
    redirect('/login?callbackUrl=/admin/deepfake-news');
  }
  
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminDashboard />
    </main>
  );
} 