import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { Repository } from '../common/types';

@Injectable()
export class GithubService {
  private octokit: Octokit;

  constructor() {
    console.log('Initializing GithubService', process.env.GITHUB_TOKEN);
    const token = process.env.GITHUB_TOKEN;
    this.octokit = new Octokit({
      auth: token,
    });
  }

  async searchRepositories(
    language: string,
    createdAfter: string,
    page: number,
    limit: number,
  ): Promise<Repository[]> {
    try {
      const query = `language:${language} created:>${createdAfter}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await this.octokit.rest.search.repos({
          q: query,
          sort: 'stars',
          order: 'desc',
          per_page: limit,
          page,
          request: {
            signal: controller.signal as any,
          },
        });

        clearTimeout(timeoutId);

        return response.data.items.map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description || null,
          url: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language || null,
          lastUpdated: repo.updated_at,
          createdAt: repo.created_at,
        }));
      } catch (error: any) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new HttpException(
          'GitHub API request timeout',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      if (error.status === 429 || error.status === 403) {
        const retryAfter = error.headers?.['retry-after'] || 60;
        throw new HttpException(
          {
            message: 'GitHub API rate limit exceeded',
            retryAfter,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      if (error.status && error.status >= 400) {
        throw new HttpException(
          'GitHub API error',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new HttpException(
        'GitHub API error',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
