import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchRepositories } from './api.service';

vi.stubGlobal('fetch', vi.fn());

describe('api.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchRepositories', () => {
    it('should fetch repositories successfully', async () => {
      const mockResponse = {
        items: [
          {
            id: 1,
            name: 'test-repo',
            description: 'Test repo',
            url: 'https://github.com/test/test-repo',
            stars: 100,
            forks: 20,
            language: 'TypeScript',
            lastUpdated: '2024-05-20T00:00:00Z',
            createdAt: '2023-01-01T00:00:00Z',
            popularityScore: 50,
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          totalCount: 1,
          totalPages: 1,
        },
      };

      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchRepositories({
        language: 'typescript',
        createdAfter: '2023-01-01',
      });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/repositories'),
      );
    });

    it('should include pagination parameters in query string', async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [],
          pagination: { page: 2, limit: 30, totalCount: 0, totalPages: 0 },
        }),
      });

      await fetchRepositories({
        language: 'python',
        createdAfter: '2024-01-01',
        page: 2,
        limit: 30,
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=30'),
      );
    });

    it('should throw ApiError on non-200 response', async () => {
      const errorResponse = {
        message: 'Invalid language filter',
      };

      (fetch as any).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => errorResponse,
      });

      await expect(
        fetchRepositories({
          language: '',
          createdAfter: '2023-01-01',
        }),
      ).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: 'Invalid language filter',
        }),
      );
    });

    it('should handle 429 rate limit error', async () => {
      (fetch as any).mockResolvedValue({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => ({ message: 'Rate limited' }),
      });

      await expect(
        fetchRepositories({
          language: 'typescript',
          createdAfter: '2023-01-01',
        }),
      ).rejects.toEqual(
        expect.objectContaining({
          status: 429,
        }),
      );
    });

    it('should use default page and limit if not provided', async () => {
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [],
          pagination: { page: 1, limit: 20, totalCount: 0, totalPages: 0 },
        }),
      });

      await fetchRepositories({
        language: 'typescript',
        createdAfter: '2023-01-01',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1'),
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=20'),
      );
    });

    it('should handle JSON parse error gracefully', async () => {
      (fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(
        fetchRepositories({
          language: 'typescript',
          createdAfter: '2023-01-01',
        }),
      ).rejects.toEqual(
        expect.objectContaining({
          status: 500,
          message: expect.stringContaining('HTTP 500'),
        }),
      );
    });
  });
});
