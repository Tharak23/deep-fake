'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiClock, FiUser, FiTag, FiMessageCircle, FiThumbsUp, FiShare2, FiArrowLeft, FiLoader, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';

type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
  tags: string[];
  likes: number;
  comments: number;
  image?: string;
};

export default function BlogPostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchBlogPost = async () => {
      setLoading(true);
      try {
        // Fetch blog post from API
        const response = await fetch(`/api/blog/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }
        
        const data = await response.json();
        setBlogPost(data.post);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Failed to load blog post. Please try again later.');
        
        // Use placeholder data if there's an error
        const placeholderPost: BlogPost = {
          id: id as string,
          title: 'Advancements in Deepfake Detection Algorithms',
          content: `
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
            
            <p>Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
            
            <h2>Key Findings</h2>
            
            <p>Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
            
            <ul>
              <li>Finding 1: Lorem ipsum dolor sit amet</li>
              <li>Finding 2: Consectetur adipiscing elit</li>
              <li>Finding 3: Nullam euismod, nisl eget aliquam ultricies</li>
            </ul>
            
            <h2>Conclusion</h2>
            
            <p>Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
          `,
          excerpt: 'Recent advancements in deepfake detection algorithms have shown promising results in identifying manipulated media with high accuracy.',
          author: {
            id: 'author-1',
            name: 'Dr. Sarah Chen',
            image: '/placeholders/team-member-1.jpg'
          },
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          tags: ['AI', 'Deepfake', 'Computer Vision'],
          likes: 42,
          comments: 8,
          image: '/placeholders/blog-1.jpg'
        };
        
        setBlogPost(placeholderPost);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchBlogPost();
    }
  }, [id]);
  
  const handleLike = async () => {
    if (!blogPost || !user) return;
    
    try {
      // Update likes via API
      const response = await fetch(`/api/blog/${blogPost.id}/like`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to like post');
      }
      
      setBlogPost({
        ...blogPost,
        likes: blogPost.likes + 1
      });
      
      setLiked(true);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] pt-20 flex items-center justify-center">
          <FiLoader className="animate-spin text-[var(--primary)]" size={32} />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !blogPost) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 flex items-center text-red-400">
                <FiAlertCircle className="mr-3 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-lg font-medium mb-2">Error Loading Blog Post</h2>
                  <p>{error || 'The requested blog post could not be found.'}</p>
                  <Link 
                    href="/blog"
                    className="mt-4 inline-flex items-center text-[var(--primary)] hover:text-[var(--secondary)] transition-colors duration-200"
                  >
                    <FiArrowLeft className="mr-2" />
                    Back to Blog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <Link 
              href="/blog"
              className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2" />
              Back to Blog
            </Link>
            
            {blogPost.image && (
              <div className="mb-8 rounded-xl overflow-hidden h-64 md:h-80 lg:h-96 relative">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${blogPost.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60"></div>
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{blogPost.title}</h1>
            
            <div className="flex flex-wrap items-center text-gray-400 mb-8 gap-y-2">
              <div className="flex items-center mr-6">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--muted)] mr-2">
                  {blogPost.author.image ? (
                    <img 
                      src={blogPost.author.image} 
                      alt={blogPost.author.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white text-xs">
                      {blogPost.author.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <span className="text-sm">{blogPost.author.name}</span>
              </div>
              
              <div className="flex items-center mr-6">
                <FiClock className="mr-2" size={14} />
                <span className="text-sm">{formatDate(blogPost.createdAt)}</span>
              </div>
              
              <div className="flex items-center mr-6">
                <FiThumbsUp className="mr-2" size={14} />
                <span className="text-sm">{blogPost.likes} likes</span>
              </div>
              
              <div className="flex items-center">
                <FiMessageCircle className="mr-2" size={14} />
                <span className="text-sm">{blogPost.comments} comments</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {blogPost.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="prose prose-invert prose-lg max-w-none mb-8">
              {/* Render content as HTML */}
              <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
            </div>
            
            <div className="border-t border-[var(--border)] pt-6 mt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    disabled={liked}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      liked
                        ? 'bg-[var(--primary)]/20 text-[var(--primary)] cursor-not-allowed'
                        : 'bg-[var(--muted)] text-gray-300 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]'
                    }`}
                  >
                    <FiThumbsUp className="mr-2" />
                    {liked ? 'Liked' : 'Like'}
                  </button>
                  
                  <button
                    className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-[var(--muted)] text-gray-300 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all duration-300"
                  >
                    <FiMessageCircle className="mr-2" />
                    Comment
                  </button>
                </div>
                
                <button
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-[var(--muted)] text-gray-300 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all duration-300"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                >
                  <FiShare2 className="mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 