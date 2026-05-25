import { Injectable } from '@nestjs/common';
import { GithubService } from '../github/github.service';
import { ScoringService } from '../scoring/scoring.service';
import { PaginatedResponse, RankedRepository } from '../common/types';

interface CacheEntry {
  data: RankedRepository[];
  totalCount: number;
  expiresAt: number;
}

@Injectable()
export class RepositoriesService {
  private cache = new Map<string, CacheEntry>();
  private readonly TTL_MS = 300 * 1000;

  constructor(
    private readonly githubService: GithubService,
    private readonly scoringService: ScoringService,
  ) {}

  async getRepositories(
    language: string,
    createdAfter: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<RankedRepository>> {
    const cacheKey = `repos:${language}:${createdAfter}:${page}:${limit}`;
    const cached = this.cache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      const totalPages = Math.ceil(cached.totalCount / limit);
      return {
        items: cached.data,
        pagination: {
          page,
          limit,
          totalCount: cached.totalCount,
          totalPages,
        },
      };
    }

    const repositories = await this.githubService.searchRepositories(
      language,
      createdAfter,
      page,
      limit,
    );

    const rankedRepositories = repositories
      .map((repo) => ({
        ...repo,
        popularityScore: this.scoringService.computeScore({
          stars: repo.stars,
          forks: repo.forks,
          lastUpdated: repo.lastUpdated,
        }),
      }))
      .sort((a, b) => b.popularityScore - a.popularityScore);

    const totalCount = repositories.length;
    const totalPages = Math.ceil(totalCount / limit);

    const cacheEntry: CacheEntry = {
      data: rankedRepositories,
      totalCount,
      expiresAt: Date.now() + this.TTL_MS,
    };

    this.cache.set(cacheKey, cacheEntry);

    return {
      items: rankedRepositories,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    };
  }
}
