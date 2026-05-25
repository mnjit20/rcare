import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { RepositoriesService } from './repositories.service';
import { GetRepositoriesDto } from './dto/get-repositories.dto';
import { PaginatedResponse, RankedRepository } from '../common/types';

@ApiTags('repositories')
@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Get()
  @ApiQuery({
    name: 'language',
    required: true,
    description: 'Programming language filter (e.g., typescript)',
  })
  @ApiQuery({
    name: 'createdAfter',
    required: true,
    description: 'Earliest creation date in ISO 8601 format (e.g., 2023-01-01)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Results per page, max 100 (default: 20)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of ranked repositories',
    schema: {
      properties: {
        items: {
          type: 'array',
          items: {
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              description: { type: 'string' },
              url: { type: 'string' },
              stars: { type: 'number' },
              forks: { type: 'number' },
              language: { type: 'string' },
              lastUpdated: { type: 'string' },
              createdAt: { type: 'string' },
              popularityScore: { type: 'number' },
            },
          },
        },
        pagination: {
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            totalCount: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async getRepositories(
    @Query() query: GetRepositoriesDto,
  ): Promise<PaginatedResponse<RankedRepository>> {
    return this.repositoriesService.getRepositories(
      query.language,
      query.createdAfter,
      query.page,
      query.limit,
    );
  }
}
