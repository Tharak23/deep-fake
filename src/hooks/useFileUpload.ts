'use client';

import { useState } from 'react';

interface UploadResponse {
  url: string;
  filename: string;
  originalFilename: string;
  contentType: string;
  size: number;
}

interface UseFileUploadOptions {
  onSuccess?: (data: UploadResponse) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadResponse | null>(null);

  const uploadFile = async (file: File, type: string) => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);
      setUploadedFile(null);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      // Upload file
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const data: UploadResponse = await response.json();
      
      setUploadedFile(data);
      setProgress(100);
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
      
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while uploading the file';
      setError(errorMessage);
      
      if (options.onError) {
        options.onError(errorMessage);
      }
      
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading,
    progress,
    error,
    uploadedFile,
  };
} 