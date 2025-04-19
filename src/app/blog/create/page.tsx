'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiSave, FiX, FiLoader, FiAlertCircle, FiImage, FiTag, FiCheck } from 'react-icons/fi';
import dbConnect from '@/lib/mongoose';
import BlogPost from '@/models/BlogPost';

export default function CreateBlogPostPage() {
  const { user, status } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is authenticated and has blog posting enabled
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/blog/create');
      return;
    }

    if (status === 'authenticated' && user && !user.blogEnabled) {
      router.push('/profile');
    }
  }, [user, status, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, or WebP)');
        return;
      }
      
      if (file.size > maxSize) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title for your blog post');
      return;
    }
    
    if (!content.trim()) {
      setError('Please enter content for your blog post');
      return;
    }
    
    if (!excerpt.trim()) {
      setError('Please enter an excerpt for your blog post');
      return;
    }
    
    if (tags.length === 0) {
      setError('Please add at least one tag');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Upload image if provided
      let imageUrl = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('type', 'images');
        formData.append('title', title);
        formData.append('description', excerpt);
        formData.append('tags', JSON.stringify(tags));
        
        const uploadResponse = await fetch('/api/storage/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }
        
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.file.url;
      }
      
      // Create blog post via API
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          tags,
          image: imageUrl,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create blog post');
      }
      
      const data = await response.json();
      
      setSuccess('Blog post created successfully!');
      
      // Redirect to the blog post page after a short delay
      setTimeout(() => {
        router.push(`/blog/${data.post.id}`);
      }, 1500);
    } catch (error: any) {
      console.error('Error creating blog post:', error);
      setError(error.message || 'Failed to create blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-white">Create Blog Post</h1>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push('/blog')}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-300"
                >
                  <FiX className="mr-2" />
                  Cancel
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-[var(--primary)]/20"
                >
                  {loading ? <FiLoader className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
                  {loading ? 'Saving...' : 'Publish Post'}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center text-red-400">
                <FiAlertCircle className="mr-2 flex-shrink-0" size={18} />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center text-green-400">
                <FiCheck className="mr-2 flex-shrink-0" size={18} />
                <span>{success}</span>
              </div>
            )}
            
            <form className="space-y-6">
              <div className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border)]">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a compelling title"
                  className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  required
                />
              </div>
              
              <div className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border)]">
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-2">
                  Excerpt/Summary *
                </label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Write a brief summary of your post (will appear in previews)"
                  className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent h-20 resize-none"
                  required
                />
                <div className="mt-1 text-xs text-gray-500 flex justify-end">
                  {excerpt.length}/200 characters
                </div>
              </div>
              
              <div className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border)]">
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                  Post Content *
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog post content here..."
                  className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent h-64 resize-none"
                  required
                />
              </div>
              
              <div className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border)]">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Featured Image
                </label>
                
                <div className="flex items-center justify-center border-2 border-dashed border-[var(--border)] rounded-lg p-6 bg-[var(--muted)]/50 relative">
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-64 mx-auto rounded-md object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500/80 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200"
                        aria-label="Remove image"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2 text-sm text-gray-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-[var(--primary)]/20 rounded-md font-medium text-[var(--primary)] hover:text-[var(--secondary)] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--primary)]">
                          <span className="px-3 py-2 inline-block">Upload an image</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, or WebP up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border)]">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags *
                </label>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, index) => (
                    <div 
                      key={index}
                      className="flex items-center bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-[var(--primary)] hover:text-white transition-colors duration-200"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex">
                  <div className="relative flex-grow">
                    <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add a tag and press Enter"
                      className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-md pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      disabled={tags.length >= 5}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!currentTag.trim() || tags.length >= 5}
                    className="ml-2 px-4 py-2 bg-[var(--primary)]/20 text-[var(--primary)] rounded-md hover:bg-[var(--primary)]/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {tags.length}/5 tags (press Enter to add)
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center px-6 py-3 rounded-md text-base font-medium bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-[var(--primary)]/20"
                >
                  {loading ? <FiLoader className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
                  {loading ? 'Saving...' : 'Publish Blog Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 