'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiX, FiFile, FiClock, FiTag } from 'react-icons/fi';
import { FileItem } from './FileStorageSystem';

type SuccessModalProps = {
  file: FileItem;
  onClose: () => void;
};

const SuccessModal = ({ file, onClose }: SuccessModalProps) => {
  // Close modal with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-xl max-w-md w-full overflow-hidden"
      >
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300"
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <FiCheckCircle className="text-green-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Upload Successful!</h2>
            <p className="text-gray-400">
              Your file has been uploaded successfully and is now available in the storage.
            </p>
          </div>

          <div className="bg-[var(--muted)]/20 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <FiFile className="text-[var(--secondary)] mt-1" size={20} />
              <div>
                <h3 className="font-medium text-white">{file.name}</h3>
                <p className="text-gray-400 text-sm">{file.originalName}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <FiTag className="text-gray-400" size={14} />
                    <span className="text-gray-300">{file.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiClock className="text-gray-400" size={14} />
                    <span className="text-gray-300">{formatDate(file.uploadTime)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn btn-primary w-full"
            >
              Done
            </button>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-[var(--muted)] hover:bg-[var(--muted)]/70 text-white"
            >
              View File
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[var(--primary)]/20 via-[var(--secondary)]/20 to-[var(--accent)]/20 h-1.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 5 }}
            className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)]"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessModal; 