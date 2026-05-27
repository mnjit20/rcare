import { Test, TestingModule } from '@nestjs/testing';
import { RepositoriesService } from './repositories.service';
import { GithubService } from '../github/github.service';
import { ScoringService } from '../scoring/scoring.service';
import { Repository } from '../common/types';

describe('RepositoriesService', () => {
  let service: RepositoriesService;
  let githubService: GithubService;
  let scoringService: ScoringService;

  const mockGithubService = {
    searchRepositories: jest.fn(),
  };

  const mockScoringService = {
    computeScore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepositoriesService,
        {
          provide: GithubService,
          useValue: mockGithubService,
        },
        {
          provide: ScoringService,
          useValue: mockScoringService,
        },
      ],
    }).compile();

    service = module.get<RepositoriesService>(RepositoriesService);
    githubService = module.get<GithubService>(GithubService);
    scoringService = module.get<ScoringService>(ScoringService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRepositories', () => {
    const mockRepos: Repository[] = [
      {
        id: 1,
        name: 'repo1',
        description: 'Desc1',
        url: 'https://github.com/user/repo1',
        stars: 100,
        forks: 20,
        language: 'TypeScript',
        lastUpdated: '2024-05-20T00:00:00Z',
        createdAt: '2023-01-01T00:00:00Z',
      },
      {
        id: 2,
        name: 'repo2',
        description: 'Desc2',
        url: 'https://github.com/user/repo2',
        stars: 50,
        forks: 10,
        language: 'TypeScript',
        lastUpdated: '2024-05-20T00:00:00Z',
        createdAt: '2023-01-01T00:00:00Z',
      },
    ];

    it('should return paginated repositories with scores on cache miss', async () => {
      mockGithubService.searchRepositories.mockResolvedValue(mockRepos);
      mockScoringService.computeScore
        .mockReturnValueOnce(75)
        .mockReturnValueOnce(50);

      const result = await service.getRepositories(
        'typescript',
        '2023-01-01',
        1,
        20,
      );

      expect(result.items).toHaveLength(2);
      expect(result.items[0].popularityScore).toBe(75);
      expect(result.items[1].popularityScore).toBe(50);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
      expect(result.pagination.totalCount).toBe(2);
      expect(result.pagination.totalPages).toBe(1);
      expect(mockGithubService.searchRepositories).toHaveBeenCalledWith(
        'typescript',
        '2023-01-01',
        1,
        20,
      );
    });

    it('should return cached data on cache hit', async () => {
      mockGithubService.searchRepositories.mockResolvedValue(mockRepos);
      mockScoringService.computeScore
        .mockReturnValueOnce(75)
        .mockReturnValueOnce(50);

      const result1 = await service.getRepositories(
        'typescript',
        '2023-01-01',
        1,
        20,
      );

      mockGithubService.searchRepositories.mockClear();

      const result2 = await service.getRepositories(
        'typescript',
        '2023-01-01',
        1,
        20,
      );

      expect(result2).toEqual(result1);
      expect(mockGithubService.searchRepositories).not.toHaveBeenCalled();
    });

    it('should use different cache entries for different queries', async () => {
      mockGithubService.searchRepositories
        .mockResolvedValueOnce([mockRepos[0]])
        .mockResolvedValueOnce([mockRepos[1]]);
      mockScoringService.computeScore
        .mockReturnValueOnce(75)
        .mockReturnValueOnce(50);

      const result1 = await service.getRepositories(
        'typescript',
        '2023-01-01',
        1,
        20,
      );
      const result2 = await service.getRepositories(
        'python',
        '2024-01-01',
        1,
        20,
      );

      expect(result1.items[0].id).toBe(1);
      expect(result2.items[0].id).toBe(2);
      expect(mockGithubService.searchRepositories).toHaveBeenCalledTimes(2);
    });

    it('should sort repositories by popularity score descending', async () => {
      mockGithubService.searchRepositories.mockResolvedValue(mockRepos);
      mockScoringService.computeScore
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(75);

      const result = await service.getRepositories(
        'typescript',
        '2023-01-01',
        1,
        20,
      );

      expect(result.items[0].popularityScore).toBe(75);
      expect(result.items[1].popularityScore).toBe(50);
    });

    it('should calculate correct totalPages', async () => {
      const manyRepos = Array.from({ length: 45 }, (_, i) => ({
        ...mockRepos[0],
        id: i,
      }));

      mockGithubService.searchRepositories.mockResolvedValue(manyRepos);
      mockScoringService.computeScore.mockReturnValue(50);

      const result = await service.getRepositories(
        'typescript',
        '2023-01-01',
        1,
        20,
      );

      expect(result.pagination.totalCount).toBe(45);
      expect(result.pagination.totalPages).toBe(3);
    });

    it('should propagate GitHub service errors', async () => {
      const error = new Error('GitHub API error');
      mockGithubService.searchRepositories.mockRejectedValue(error);

      await expect(
        service.getRepositories('typescript', '2023-01-01', 1, 20),
      ).rejects.toThrow('GitHub API error');
    });
  });
});
