'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFile, 
  FiImage, 
  FiVideo, 
  FiFileText, 
  FiDownload, 
  FiTrash2, 
  FiEye,
  FiClock,
  FiTag,
  FiUser
} from 'react-icons/fi';
import { FileItem } from './FileStorageSystem';

type FileListProps = {
  files: FileItem[];
  onDeleteFile: (id: string) => void;
};

const FileList = ({ files, onDeleteFile }: FileListProps) => {
  const [expandedFile, setExpandedFile] = useState<string | null>(null);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return <FiImage className="text-blue-400" size={20} />;
    } else if (fileType.includes('video')) {
      return <FiVideo className="text-red-400" size={20} />;
    } else if (fileType.includes('pdf')) {
      return <FiFileText className="text-orange-400" size={20} />;
    } else {
      return <FiFile className="text-gray-400" size={20} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Research':
        return 'bg-blue-500/20 text-blue-400';
      case 'Case Study':
        return 'bg-purple-500/20 text-purple-400';
      case 'Dataset':
        return 'bg-green-500/20 text-green-400';
      case 'Algorithm':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Publication':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const toggleFileExpand = (id: string) => {
    if (expandedFile === id) {
      setExpandedFile(null);
    } else {
      setExpandedFile(id);
    }
  };

  return (
    <div className="overflow-hidden">
      {files.length === 0 ? (
        <div className="text-center py-12 bg-[var(--muted)]/10 rounded-lg">
          <FiFile className="mx-auto text-gray-500 mb-3" size={40} />
          <p className="text-gray-400">No files uploaded yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Upload a file to see it here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg overflow-hidden hover:border-[var(--secondary)]/30 transition-colors duration-300"
            >
              <div 
                className="p-4 cursor-pointer flex items-center justify-between"
                onClick={() => toggleFileExpand(file.id)}
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <h3 className="font-medium text-white">{file.name}</h3>
                    <p className="text-gray-400 text-sm">{file.originalName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(file.category)}`}>
                    {file.category}
                  </span>
                  <span className="text-gray-400 text-sm hidden md:inline">
                    {formatFileSize(file.size)}
                  </span>
                  <span className="text-gray-400 text-sm hidden lg:inline">
                    {formatDate(file.uploadTime)}
                  </span>
                </div>
              </div>
              
              {expandedFile === file.id && (
                <div className="px-4 pb-4 pt-2 border-t border-[var(--border)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <FiClock className="text-gray-400" size={16} />
                      <span className="text-gray-300 text-sm">Uploaded: {formatDate(file.uploadTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiUser className="text-gray-400" size={16} />
                      <span className="text-gray-300 text-sm">By: {file.uploadedBy}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiTag className="text-gray-400" size={16} />
                      <span className="text-gray-300 text-sm">Category: {file.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiFile className="text-gray-400" size={16} />
                      <span className="text-gray-300 text-sm">Size: {formatFileSize(file.size)}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary flex items-center space-x-1 text-sm py-1.5"
                    >
                      <FiEye size={14} />
                      <span>View</span>
                    </a>
                    <a
                      href={file.url}
                      download={file.originalName}
                      className="btn bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-white flex items-center space-x-1 text-sm py-1.5"
                    >
                      <FiDownload size={14} />
                      <span>Download</span>
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFile(file.id);
                      }}
                      className="btn bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center space-x-1 text-sm py-1.5"
                    >
                      <FiTrash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList; 