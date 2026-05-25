import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Repository, Pagination } from '../../types';
import { RepositoryList } from './RepositoryList';

describe('RepositoryList', () => {
  const mockRepositories: Repository[] = [
    {
      id: 1,
      name: 'repo1',
      description: 'Repo 1',
      url: 'https://github.com/user/repo1',
      stars: 100,
      forks: 20,
      language: 'TypeScript',
      lastUpdated: '2024-05-20T00:00:00Z',
      createdAt: '2023-01-01T00:00:00Z',
      popularityScore: 50,
    },
    {
      id: 2,
      name: 'repo2',
      description: 'Repo 2',
      url: 'https://github.com/user/repo2',
      stars: 200,
      forks: 40,
      language: 'Python',
      lastUpdated: '2024-05-20T00:00:00Z',
      createdAt: '2023-01-01T00:00:00Z',
      popularityScore: 60,
    },
  ];

  const mockPagination: Pagination = {
    page: 1,
    limit: 20,
    totalCount: 100,
    totalPages: 5,
  };

  it('should render all repositories', () => {
    const onPageChange = vi.fn();
    render(
      <RepositoryList
        items={mockRepositories}
        pagination={mockPagination}
        onPageChange={onPageChange}
      />,
    );

    expect(screen.getByText('repo1')).toBeInTheDocument();
    expect(screen.getByText('repo2')).toBeInTheDocument();
  });

  it('should show empty state when no repositories', () => {
    const onPageChange = vi.fn();
    render(
      <RepositoryList
        items={[]}
        pagination={mockPagination}
        onPageChange={onPageChange}
      />,
    );

    expect(screen.getByText(/No repositories found/)).toBeInTheDocument();
  });

  it('should call onPageChange when next button is clicked', () => {
    const onPageChange = vi.fn();
    render(
      <RepositoryList
        items={mockRepositories}
        pagination={mockPagination}
        onPageChange={onPageChange}
      />,
    );

    const nextButton = screen.getByText(/Next/);
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when previous button is clicked', () => {
    const onPageChange = vi.fn();
    const pagination = { ...mockPagination, page: 2 };

    render(
      <RepositoryList
        items={mockRepositories}
        pagination={pagination}
        onPageChange={onPageChange}
      />,
    );

    const prevButton = screen.getByText(/Previous/);
    fireEvent.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('should disable previous button on first page', () => {
    const onPageChange = vi.fn();
    render(
      <RepositoryList
        items={mockRepositories}
        pagination={mockPagination}
        onPageChange={onPageChange}
      />,
    );

    const prevButton = screen.getByText(/Previous/) as HTMLButtonElement;
    expect(prevButton.disabled).toBe(true);
  });

  it('should disable next button on last page', () => {
    const onPageChange = vi.fn();
    const pagination = { ...mockPagination, page: 5 };

    render(
      <RepositoryList
        items={mockRepositories}
        pagination={pagination}
        onPageChange={onPageChange}
      />,
    );

    const nextButton = screen.getByText(/Next/) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(true);
  });

  it('should display correct pagination info', () => {
    const onPageChange = vi.fn();
    render(
      <RepositoryList
        items={mockRepositories}
        pagination={mockPagination}
        onPageChange={onPageChange}
      />,
    );

    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
  });
});
