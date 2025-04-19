'use client';

import { motion } from 'framer-motion';
import { FiCheck, FiUpload } from 'react-icons/fi';
import React, { KeyboardEvent } from 'react';

type LevelStep = {
  id: string;
  title: string;
  icon: React.ReactNode;
};

type Level = {
  level: number;
  title: string;
  description: string;
  steps: LevelStep[];
  requiredFiles: string[];
  color: string;
  x: string;
  y: string;
};

type RoadmapLevelDetailProps = {
  level: Level;
  fileUploads: string[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isCompleted: boolean;
  canComplete: boolean;
  onComplete: () => void;
};

const RoadmapLevelDetail = ({ 
  level, 
  fileUploads, 
  onFileUpload, 
  isCompleted, 
  canComplete,
  onComplete
}: RoadmapLevelDetailProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="ml-16 mt-6 overflow-hidden"
    >
      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {level.steps.map((step) => (
          <motion.div 
            key={step.id} 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`p-5 rounded-lg border transition-colors ${
              isCompleted 
                ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-green-800/30' 
                : 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-indigo-900/30 hover:border-indigo-700/50'
            }`}
            tabIndex={0}
            role="button"
            aria-label={`Step: ${step.title}`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-md bg-gradient-to-r ${level.color} bg-opacity-20`}>
                {step.icon}
              </div>
              <h4 className="font-medium text-white">{step.title}</h4>
            </div>
            {isCompleted && (
              <div className="flex items-center text-green-400 text-sm">
                <FiCheck className="mr-1" size={14} />
                Completed
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* File upload section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="p-5 rounded-lg border border-dashed border-gray-700 bg-gray-900/30"
      >
        <h4 className="font-medium text-white mb-4 flex items-center">
          <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${level.color} mr-2`}></span>
          Required Uploads:
        </h4>
        
        <div className="space-y-3 mb-6">
          {level.requiredFiles.map((file) => (
            <div key={file} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
              <span className="text-gray-300 font-mono text-sm">
                {file}
              </span>
              <div className="flex items-center">
                {fileUploads.some(
                  uploadedFile => uploadedFile.toLowerCase().includes(file.toLowerCase())
                ) ? (
                  <span className="text-green-400 flex items-center text-sm">
                    <FiCheck className="mr-1" size={14} />
                    Uploaded
                  </span>
                ) : (
                  <span className="text-gray-500 text-sm">Required</span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <label className="flex-1">
            <div 
              className={`relative flex items-center justify-center px-4 py-2.5 rounded-md border transition-all ${
                isCompleted 
                  ? 'border-gray-700 bg-gray-800/50 opacity-50 cursor-not-allowed' 
                  : 'border-indigo-700/50 bg-indigo-900/20 hover:bg-indigo-900/30 cursor-pointer'
              }`}
              tabIndex={isCompleted ? -1 : 0}
              role="button"
              aria-label="Upload required files"
              onKeyDown={(e) => !isCompleted && handleKeyDown(e, () => document.getElementById(`file-upload-${level.level}`)?.click())}
            >
              <FiUpload className="mr-2" size={16} />
              <span>Upload Files</span>
              <input
                id={`file-upload-${level.level}`}
                type="file"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={onFileUpload}
                disabled={isCompleted}
                aria-label="Upload required files"
              />
            </div>
          </label>
          
          <button
            onClick={onComplete}
            disabled={isCompleted || !canComplete}
            className={`px-4 py-2.5 rounded-md font-medium transition ${
              isCompleted
                ? 'bg-green-900/40 text-green-400 cursor-not-allowed'
                : canComplete
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
            aria-label={isCompleted ? "Level already completed" : "Mark level as complete"}
          >
            {isCompleted
              ? 'Completed'
              : 'Mark as Complete'}
          </button>
        </div>
        
        {fileUploads.length > 0 && (
          <div className="mt-6">
            <h5 className="text-sm text-gray-400 mb-2">Uploaded Files:</h5>
            <div className="flex flex-wrap gap-2">
              {fileUploads.map((file, index) => (
                <div 
                  key={index} 
                  className="px-2 py-1 rounded-md bg-indigo-900/30 border border-indigo-800/50 text-indigo-300 text-xs font-mono"
                >
                  {file}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RoadmapLevelDetail; 