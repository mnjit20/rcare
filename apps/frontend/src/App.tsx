import { useState } from 'react';
import type { ApiResponse, SearchFilters, ApiError } from './types';
import { SearchFilter } from './components/SearchFilter/SearchFilter';
import { RepositoryList } from './components/RepositoryList/RepositoryList';
import { fetchRepositories } from './services/api.service';

function App() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);

  const handleSearch = async (filters: SearchFilters) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchRepositories(filters);
      setResponse(result);
      setCurrentFilters(filters);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 429) {
        setError('Rate limit exceeded. Please wait a moment and try again.');
      } else if (apiError.status === 400) {
        setError('Invalid search parameters. Please check your input.');
      } else {
        setError(apiError.message || 'An error occurred while searching.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    if (!currentFilters) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchRepositories({
        ...currentFilters,
        page,
      });
      setResponse(result);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'An error occurred while loading.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <SearchFilter onSearch={handleSearch} loading={loading} />

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {loading && !response && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Searching repositories...</p>
        </div>
      )}

      {response && (
        <div className="container">
          <RepositoryList
            items={response.items}
            pagination={response.pagination}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export default App;
