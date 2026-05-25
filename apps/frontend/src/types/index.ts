export interface Repository {
  id: number;
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  lastUpdated: string;
  createdAt: string;
  popularityScore: number;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface SearchFilters {
  language: string;
  createdAfter: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse {
  items: Repository[];
  pagination: Pagination;
}

export interface ApiError {
  status: number;
  message: string;
}
