'use client';

import { useState, useEffect, useCallback } from 'react';
import { IPaper } from '@/models/Paper';

interface PapersResponse {
  papers: IPaper[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface UsePapersOptions {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  sort?: 'newest' | 'oldest' | 'most-cited' | 'most-downloaded';
}

export function usePapers(options: UsePapersOptions = {}) {
  const [papers, setPapers] = useState<IPaper[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPapers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query string
      const queryParams = new URLSearchParams();
      if (options.page) queryParams.append('page', options.page.toString());
      if (options.limit) queryParams.append('limit', options.limit.toString());
      if (options.search) queryParams.append('search', options.search);
      if (options.tags && options.tags.length > 0) queryParams.append('tags', options.tags.join(','));
      if (options.sort) queryParams.append('sort', options.sort);

      // Fetch papers
      const response = await fetch(`/api/papers?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch papers');
      }
      
      const data: PapersResponse = await response.json();
      
      setPapers(data.papers);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching papers');
    } finally {
      setLoading(false);
    }
  }, [options.page, options.limit, options.search, options.tags, options.sort]);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  return {
    papers,
    pagination,
    loading,
    error,
    refetch: fetchPapers,
  };
} 