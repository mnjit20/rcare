import { useState } from 'react';
import type { SearchFilters } from '../../types';

interface SearchFilterProps {
  onSearch: (filters: SearchFilters) => void;
  loading: boolean;
}

export function SearchFilter({ onSearch, loading }: SearchFilterProps) {
  const [language, setLanguage] = useState('');
  const [createdAfter, setCreatedAfter] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (language.trim() && createdAfter) {
      onSearch({
        language: language.trim(),
        createdAfter,
        page: 1,
      });
    }
  };

  return (
    <form className="search-filter" onSubmit={handleSubmit}>
      <h1>RedCare - GitHub Repo Ranker</h1>
      
      <div className="form-group">
        <label htmlFor="language">Programming Language</label>
        <input
          id="language"
          type="text"
          placeholder="e.g., typescript, python, rust"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          required
          disabled={loading}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="created-after">Created After</label>
        <input
          id="created-after"
          type="date"
          value={createdAfter}
          onChange={(e) => setCreatedAfter(e.target.value)}
          required
          disabled={loading}
          className="form-input"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="search-button"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}
