import FileStorageSystem from '@/components/FileStorageSystem';

export const metadata = {
  title: 'Secure File Storage | DeepFake Detection Research Lab',
  description: 'Upload and manage research files, datasets, and case studies securely.',
};

export default function StoragePage() {
  return (
    <main>
      <FileStorageSystem />
    </main>
  );
} 