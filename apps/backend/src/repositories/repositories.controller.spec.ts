import { Test, TestingModule } from '@nestjs/testing';
import { RepositoriesController } from './repositories.controller';
import { RepositoriesService } from './repositories.service';

describe('RepositoriesController', () => {
  let controller: RepositoriesController;
  let service: RepositoriesService;

  const mockRepositoriesService = {
    getRepositories: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepositoriesController],
      providers: [
        {
          provide: RepositoriesService,
          useValue: mockRepositoriesService,
        },
      ],
    }).compile();

    controller = module.get<RepositoriesController>(RepositoriesController);
    service = module.get<RepositoriesService>(RepositoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRepositories', () => {
    it('should return paginated repositories with correct shape', async () => {
      const mockResponse = {
        items: [
          {
            id: 1,
            name: 'test-repo',
            description: 'Test',
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

      mockRepositoriesService.getRepositories.mockResolvedValue(mockResponse);

      const result = await controller.getRepositories({
        language: 'typescript',
        createdAfter: '2023-01-01',
        page: 1,
        limit: 20,
      });

      expect(result).toEqual(mockResponse);
      expect(result.items).toHaveLength(1);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
    });

    it('should call service with correct parameters', async () => {
      const mockResponse = {
        items: [],
        pagination: { page: 2, limit: 30, totalCount: 0, totalPages: 0 },
      };

      mockRepositoriesService.getRepositories.mockResolvedValue(mockResponse);

      await controller.getRepositories({
        language: 'python',
        createdAfter: '2024-01-01',
        page: 2,
        limit: 30,
      });

      expect(mockRepositoriesService.getRepositories).toHaveBeenCalledWith(
        'python',
        '2024-01-01',
        2,
        30,
      );
    });
  });
});
