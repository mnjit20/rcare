import { GithubService } from './github.service';
import { HttpException } from '@nestjs/common';
import * as octokitModule from '@octokit/rest';

jest.mock('@octokit/rest');

describe('GithubService', () => {
  let service: GithubService;
  let mockOctokit: any;

  beforeEach(() => {
    mockOctokit = {
      rest: {
        search: {
          repos: jest.fn(),
        },
      },
    };

    (octokitModule.Octokit as jest.Mock).mockImplementation(() => mockOctokit);

    service = new GithubService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchRepositories', () => {
    const mockResponse = {
      data: {
        items: [
          {
            id: 1,
            name: 'test-repo',
            description: 'A test repo',
            html_url: 'https://github.com/test/test-repo',
            stargazers_count: 100,
            forks_count: 50,
            language: 'TypeScript',
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
        ],
      },
    };

    it('should return mapped repositories on successful search', async () => {
      mockOctokit.rest.search.repos.mockResolvedValue(mockResponse);

      const result = await service.searchRepositories('typescript', '2023-01-01', 1, 20);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 1,
        name: 'test-repo',
        description: 'A test repo',
        url: 'https://github.com/test/test-repo',
        stars: 100,
        forks: 50,
        language: 'TypeScript',
        lastUpdated: mockResponse.data.items[0].updated_at,
        createdAt: mockResponse.data.items[0].created_at,
      });
    });

    it('should return empty array on empty search results', async () => {
      mockOctokit.rest.search.repos.mockResolvedValue({
        data: { items: [] },
      });

      const result = await service.searchRepositories('typescript', '2023-01-01', 1, 20);

      expect(result).toEqual([]);
    });

    it('should handle null description', async () => {
      const responseWithNullDesc = {
        data: {
          items: [
            {
              ...mockResponse.data.items[0],
              description: null,
            },
          ],
        },
      };

      mockOctokit.rest.search.repos.mockResolvedValue(responseWithNullDesc);

      const result = await service.searchRepositories('typescript', '2023-01-01', 1, 20);

      expect(result[0].description).toBeNull();
    });

    it('should handle null language', async () => {
      const responseWithNullLang = {
        data: {
          items: [
            {
              ...mockResponse.data.items[0],
              language: null,
            },
          ],
        },
      };

      mockOctokit.rest.search.repos.mockResolvedValue(responseWithNullLang);

      const result = await service.searchRepositories('typescript', '2023-01-01', 1, 20);

      expect(result[0].language).toBeNull();
    });

    it('should throw HttpException with 429 status on rate limit (429 status)', async () => {
      const error = new Error('Rate limit');
      (error as any).status = 429;
      (error as any).headers = { 'retry-after': '60' };

      mockOctokit.rest.search.repos.mockRejectedValue(error);

      await expect(
        service.searchRepositories('typescript', '2023-01-01', 1, 20),
      ).rejects.toThrow(HttpException);

      try {
        await service.searchRepositories('typescript', '2023-01-01', 1, 20);
      } catch (e) {
        expect((e as HttpException).getStatus()).toBe(429);
      }
    });

    it('should throw HttpException with 429 status on forbidden (403 status)', async () => {
      const error = new Error('Forbidden');
      (error as any).status = 403;
      (error as any).headers = { 'retry-after': '60' };

      mockOctokit.rest.search.repos.mockRejectedValue(error);

      try {
        await service.searchRepositories('typescript', '2023-01-01', 1, 20);
      } catch (e) {
        expect((e as HttpException).getStatus()).toBe(429);
      }
    });

    it('should throw HttpException with 503 status on timeout', async () => {
      const error = new Error('Timeout');
      (error as any).name = 'AbortError';

      mockOctokit.rest.search.repos.mockRejectedValue(error);

      try {
        await service.searchRepositories('typescript', '2023-01-01', 1, 20);
      } catch (e) {
        expect((e as HttpException).getStatus()).toBe(503);
      }
    });

    it('should throw HttpException with 503 status on other API errors', async () => {
      const error = new Error('Server error');
      (error as any).status = 500;

      mockOctokit.rest.search.repos.mockRejectedValue(error);

      try {
        await service.searchRepositories('typescript', '2023-01-01', 1, 20);
      } catch (e) {
        expect((e as HttpException).getStatus()).toBe(503);
      }
    });

    it('should call Octokit with correct parameters', async () => {
      mockOctokit.rest.search.repos.mockResolvedValue(mockResponse);

      await service.searchRepositories('python', '2024-01-01', 2, 30);

      expect(mockOctokit.rest.search.repos).toHaveBeenCalledWith(
        expect.objectContaining({
          q: 'language:python created:>2024-01-01',
          sort: 'stars',
          order: 'desc',
          per_page: 30,
          page: 2,
        }),
      );
    });
  });
});
