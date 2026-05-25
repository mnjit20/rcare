import type { Repository, Pagination } from '../../types';
import { RepositoryCard } from '../RepositoryCard/RepositoryCard';

interface RepositoryListProps {
  items: Repository[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export function RepositoryList({ items, pagination, onPageChange }: RepositoryListProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No repositories found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="repository-list-container">
      <div className="repository-list">
        {items.map((repo) => (
          <RepositoryCard key={repo.id} repository={repo} />
        ))}
      </div>

      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          ← Previous
        </button>

        <span className="pagination-info">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          className="pagination-button"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
