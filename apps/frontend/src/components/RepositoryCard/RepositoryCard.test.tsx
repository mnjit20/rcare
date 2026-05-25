import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Repository } from '../../types';
import { RepositoryCard } from './RepositoryCard';

describe('RepositoryCard', () => {
  const mockRepository: Repository = {
    id: 1,
    name: 'awesome-project',
    description: 'An awesome project',
    url: 'https://github.com/user/awesome-project',
    stars: 1500,
    forks: 300,
    language: 'TypeScript',
    lastUpdated: '2024-05-20T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    popularityScore: 75,
  };

  it('should render repository name as a link', () => {
    render(<RepositoryCard repository={mockRepository} />);
    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('awesome-project');
    expect(link).toHaveAttribute('href', 'https://github.com/user/awesome-project');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('should display popularity score', () => {
    render(<RepositoryCard repository={mockRepository} />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(<RepositoryCard repository={mockRepository} />);
    expect(screen.getByText('An awesome project')).toBeInTheDocument();
  });

  it('should not render description when null', () => {
    const repoWithoutDesc = { ...mockRepository, description: null };
    render(<RepositoryCard repository={repoWithoutDesc} />);
    expect(screen.queryByText(/An awesome/)).not.toBeInTheDocument();
  });

  it('should display stars count', () => {
    render(<RepositoryCard repository={mockRepository} />);
    expect(screen.getByText('1,500')).toBeInTheDocument();
  });

  it('should display forks count', () => {
    render(<RepositoryCard repository={mockRepository} />);
    expect(screen.getByText('300')).toBeInTheDocument();
  });

  it('should display language when provided', () => {
    render(<RepositoryCard repository={mockRepository} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('should not display language when null', () => {
    const repoWithoutLang = { ...mockRepository, language: null };
    render(<RepositoryCard repository={repoWithoutLang} />);
    expect(screen.queryByText(/Language:/)).not.toBeInTheDocument();
  });

  it('should format and display last updated date', () => {
    render(<RepositoryCard repository={mockRepository} />);
    expect(screen.getByText(/May 20, 2024/)).toBeInTheDocument();
  });
});
