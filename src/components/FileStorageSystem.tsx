'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from './Navbar';
import Footer from './Footer';
import FileUploadZone from './FileUploadZone';
import FileList from './FileList';
import SuccessModal from './SuccessModal';

// File type definition
export type FileItem = {
  id: string;
  name: string;
  originalName: string;
  category: string;
  size: number;
  type: string;
  uploadTime: Date;
  uploadedBy: string;
  url: string;
};

const FileStorageSystem = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<FileItem | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Load files from localStorage on component mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('deepfakeFiles');
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles).map((file: any) => ({
          ...file,
          uploadTime: new Date(file.uploadTime),
        }));
        setFiles(parsedFiles);
      } catch (error) {
        console.error('Error parsing saved files:', error);
      }
    }
  }, []);

  // Save files to localStorage when files state changes
  useEffect(() => {
    if (files.length > 0) {
      localStorage.setItem('deepfakeFiles', JSON.stringify(files));
    }
  }, [files]);

  const handleFileUpload = (newFile: FileItem) => {
    setFiles((prevFiles) => [...prevFiles, newFile]);
    setUploadedFile(newFile);
    setShowSuccessModal(true);
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         file.originalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || file.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Research', 'Case Study', 'Dataset', 'Algorithm', 'Publication'];

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Secure <span className="text-[var(--secondary)] glow">File</span>{' '}
              <span className="text-[var(--accent)] glow">Storage</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Upload, manage, and securely store research files, datasets, and case studies
              for the DeepFake Detection Research Lab.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <motion.div
                ref={ref}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <FileUploadZone onFileUpload={handleFileUpload} />
              </motion.div>
            </div>

            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="card overflow-hidden"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">Stored Files</h2>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-grow">
                      <input
                        type="text"
                        placeholder="Search files..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] text-white"
                      />
                    </div>
                    <div>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] text-white"
                        aria-label="Filter by category"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <FileList files={filteredFiles} onDeleteFile={handleDeleteFile} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showSuccessModal && uploadedFile && (
          <SuccessModal
            file={uploadedFile}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default FileStorageSystem; 