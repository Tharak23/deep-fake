'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';
import { FileItem } from './FileStorageSystem';

type FileUploadZoneProps = {
  onFileUpload: (file: FileItem) => void;
};

const FileUploadZone = ({ onFileUpload }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFile(file);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!fileName.trim()) {
      setError('Please enter a file name');
      return;
    }
    
    if (!category) {
      setError('Please select a category');
      return;
    }
    
    // Simulate upload process
    setIsUploading(true);
    setUploadProgress(0);
    
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    // Simulate upload completion
    setTimeout(() => {
      clearInterval(uploadInterval);
      setUploadProgress(100);
      
      // Create a new file object
      const newFile: FileItem = {
        id: Date.now().toString(),
        name: fileName.trim(),
        originalName: file.name,
        category,
        size: file.size,
        type: file.type,
        uploadTime: new Date(),
        uploadedBy: 'Current User', // In a real app, this would come from authentication
        url: URL.createObjectURL(file), // In a real app, this would be a server URL
      };
      
      onFileUpload(newFile);
      
      // Reset form
      setFile(null);
      setFileName('');
      setCategory('');
      setIsUploading(false);
      setUploadProgress(0);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 2000);
  };

  const resetForm = () => {
    setFile(null);
    setFileName('');
    setCategory('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const categories = ['Research', 'Case Study', 'Dataset', 'Algorithm', 'Publication'];

  return (
    <div className="card overflow-hidden">
      <h2 className="text-2xl font-bold mb-6">Upload File</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="fileName" className="block text-sm font-medium text-gray-300 mb-2">
            File Name
          </label>
          <input
            type="text"
            id="fileName"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-4 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] text-white"
            placeholder="Enter a name for your file"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] text-white"
            aria-label="File category"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 mb-6 ${
            isDragging
              ? 'border-[var(--secondary)] bg-[var(--secondary)]/10'
              : file
                ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                : 'border-[var(--border)] hover:border-[var(--secondary)]/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!file ? (
            <div className="py-6">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <FiUpload className="mx-auto text-[var(--secondary)] mb-4" size={40} />
              </motion.div>
              <p className="text-gray-300 mb-2">
                Drag and drop your file here, or{' '}
                <label className="text-[var(--secondary)] cursor-pointer hover:underline">
                  browse
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              </p>
              <p className="text-gray-500 text-sm">
                Supported formats: PDF, JPG, PNG, MP4, etc.
              </p>
            </div>
          ) : (
            <div className="py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FiFile className="text-[var(--accent)] mr-2" size={24} />
                  <div className="text-left">
                    <p className="text-white font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white p-1"
                  aria-label="Remove file"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-md p-3 mb-6">
            {error}
          </div>
        )}
        
        {isUploading && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-[var(--muted)]/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                initial={{ width: '0%' }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>
          </div>
        )}
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isUploading}
            className={`btn btn-primary flex-grow ${
              isUploading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
          
          {file && !isUploading && (
            <button
              type="button"
              onClick={resetForm}
              className="btn bg-[var(--muted)] hover:bg-[var(--muted)]/70 text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FileUploadZone; 