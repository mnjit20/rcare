import type { ApiResponse, ApiError, SearchFilters } from '../types';

const API_BASE = '/api';

export async function fetchRepositories(filters: SearchFilters): Promise<ApiResponse> {
  const params = new URLSearchParams({
    language: filters.language,
    createdAfter: filters.createdAfter,
    page: String(filters.page || 1),
    limit: String(filters.limit || 20),
  });

  const response = await fetch(`${API_BASE}/repositories?${params.toString()}`);

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: `HTTP ${response.status}: ${response.statusText}`,
    };

    try {
      const data = await response.json();
      if (data.message) {
        error.message = data.message;
      }
    } catch {
      // Use default error message if JSON parsing fails
    }

    throw error;
  }

  return response.json();
}
