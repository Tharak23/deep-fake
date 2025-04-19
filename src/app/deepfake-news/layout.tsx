import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DeepFake News & Info',
  description: 'Latest articles, research papers, and news updates about DeepFake technology, detection methods, and ethical considerations. Share your insights with our community.',
  keywords: 'deepfake, ai-generated content, synthetic media, face swapping, digital manipulation, research, news, technology, community, blog',
};

export default function DeepFakeNewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 