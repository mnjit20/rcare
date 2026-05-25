import type { Repository } from '../../types';

interface RepositoryCardProps {
  repository: Repository;
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="repository-card">
      <div className="repository-header">
        <a href={repository.url} target="_blank" rel="noopener noreferrer" className="repository-name">
          {repository.name}
        </a>
        <span className="popularity-badge">{repository.popularityScore}</span>
      </div>

      {repository.description && (
        <p className="repository-description">{repository.description}</p>
      )}

      <div className="repository-meta">
        <span className="meta-item">
          <span className="meta-label">Stars:</span> {repository.stars.toLocaleString()}
        </span>
        <span className="meta-item">
          <span className="meta-label">Forks:</span> {repository.forks.toLocaleString()}
        </span>
        {repository.language && (
          <span className="meta-item">
            <span className="meta-label">Language:</span> {repository.language}
          </span>
        )}
        <span className="meta-item">
          <span className="meta-label">Updated:</span> {formatDate(repository.lastUpdated)}
        </span>
      </div>
    </div>
  );
}
