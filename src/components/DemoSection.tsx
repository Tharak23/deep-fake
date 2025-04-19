'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { FiUpload, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import Link from 'next/link';

const DemoSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<'real' | 'fake' | null>(null);
  const [confidence, setConfidence] = useState(0);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }
    
    setFile(file);
    setResult(null);
    setConfidence(0);
  };

  const analyzeImage = () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis with a timeout
    setTimeout(() => {
      // Randomly determine if the image is real or fake for demo purposes
      const isFake = Math.random() > 0.5;
      setResult(isFake ? 'fake' : 'real');
      setConfidence(isFake ? 85 + Math.random() * 14 : 75 + Math.random() * 20);
      setIsAnalyzing(false);
    }, 2500);
  };

  const resetDemo = () => {
    setFile(null);
    setResult(null);
    setConfidence(0);
  };

  return (
    <section className="py-20 bg-[#0a0a0a]" id="demo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Try Our <span className="text-[var(--primary)]">Demo</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Upload an image to see our deepfake detection technology in action
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="card max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Upload an Image</h3>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${
                  isDragging
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                    : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                } ${file ? 'bg-[var(--card-bg)]' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {!file ? (
                  <div className="py-8">
                    <FiUpload className="mx-auto text-gray-400 mb-4" size={40} />
                    <p className="text-gray-300 mb-2">
                      Drag and drop an image here, or{' '}
                      <label className="text-[var(--primary)] cursor-pointer hover:underline">
                        browse
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileInput}
                        />
                      </label>
                    </p>
                    <p className="text-gray-500 text-sm">
                      Supported formats: JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative h-64 w-full">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="Uploaded image"
                      fill
                      className="object-contain"
                    />
                    <button
                      onClick={resetDemo}
                      className="absolute top-2 right-2 bg-red-500/80 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-300"
                      aria-label="Remove uploaded image"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                )}
              </div>

              {file && !result && (
                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className={`btn btn-primary w-full mt-4 ${
                    isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                </button>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Analysis Results</h3>
              {!file && (
                <div className="bg-[var(--muted)]/20 rounded-lg p-8 text-center h-64 flex items-center justify-center">
                  <p className="text-gray-400">
                    Upload an image to see the analysis results
                  </p>
                </div>
              )}

              {file && isAnalyzing && (
                <div className="bg-[var(--muted)]/20 rounded-lg p-8 text-center h-64 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-300">Analyzing image...</p>
                  <p className="text-gray-400 text-sm mt-2">
                    This may take a few seconds
                  </p>
                </div>
              )}

              {file && result && (
                <div className="bg-[var(--muted)]/20 rounded-lg p-6 h-64 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        result === 'fake'
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-green-500/20 text-green-500'
                      }`}
                    >
                      {result === 'fake' ? (
                        <FiX size={24} />
                      ) : (
                        <FiCheck size={24} />
                      )}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold">
                        {result === 'fake' ? 'Likely Deepfake' : 'Likely Authentic'}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Confidence: {confidence.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="h-2 bg-[var(--muted)]/30 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          result === 'fake'
                            ? 'bg-red-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-[var(--card-bg)] p-4 rounded-lg flex-grow overflow-y-auto">
                    <h5 className="font-bold text-sm mb-2">Analysis Details:</h5>
                    <ul className="text-sm text-gray-400 space-y-2">
                      {result === 'fake' ? (
                        <>
                          <li className="flex items-start">
                            <FiInfo className="text-red-400 mt-1 mr-2 flex-shrink-0" size={14} />
                            <span>Inconsistent facial features detected</span>
                          </li>
                          <li className="flex items-start">
                            <FiInfo className="text-red-400 mt-1 mr-2 flex-shrink-0" size={14} />
                            <span>Unnatural lighting patterns identified</span>
                          </li>
                          <li className="flex items-start">
                            <FiInfo className="text-red-400 mt-1 mr-2 flex-shrink-0" size={14} />
                            <span>GAN fingerprint matches known deepfake generators</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start">
                            <FiInfo className="text-green-400 mt-1 mr-2 flex-shrink-0" size={14} />
                            <span>Natural facial feature consistency</span>
                          </li>
                          <li className="flex items-start">
                            <FiInfo className="text-green-400 mt-1 mr-2 flex-shrink-0" size={14} />
                            <span>Expected lighting and shadow patterns</span>
                          </li>
                          <li className="flex items-start">
                            <FiInfo className="text-green-400 mt-1 mr-2 flex-shrink-0" size={14} />
                            <span>No synthetic generation markers detected</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              <div className="mt-4 text-center">
                <Link
                  href="/demo"
                  className="text-[var(--primary)] hover:text-[var(--secondary)] text-sm"
                >
                  Try our advanced demo with more features →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoSection; 