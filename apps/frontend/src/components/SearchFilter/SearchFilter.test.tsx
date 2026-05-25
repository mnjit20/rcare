import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchFilter } from './SearchFilter';

describe('SearchFilter', () => {
  it('should render input fields', () => {
    const onSearch = vi.fn();
    render(<SearchFilter onSearch={onSearch} loading={false} />);

    expect(screen.getByLabelText(/Programming Language/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Created After/)).toBeInTheDocument();
  });

  it('should render search button', () => {
    const onSearch = vi.fn();
    render(<SearchFilter onSearch={onSearch} loading={false} />);

    expect(screen.getByRole('button', { name: /Search/ })).toBeInTheDocument();
  });

  it('should call onSearch with correct filters when form is submitted', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchFilter onSearch={onSearch} loading={false} />);

    const languageInput = screen.getByLabelText(/Programming Language/);
    const dateInput = screen.getByLabelText(/Created After/);
    const submitButton = screen.getByRole('button', { name: /Search/ });

    await user.type(languageInput, 'typescript');
    await user.type(dateInput, '2023-01-01');
    await user.click(submitButton);

    expect(onSearch).toHaveBeenCalledWith({
      language: 'typescript',
      createdAfter: '2023-01-01',
      page: 1,
    });
  });

  it('should disable inputs and button when loading', () => {
    const onSearch = vi.fn();
    render(<SearchFilter onSearch={onSearch} loading={true} />);

    const languageInput = screen.getByLabelText(/Programming Language/) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Created After/) as HTMLInputElement;
    const submitButton = screen.getByRole('button') as HTMLButtonElement;

    expect(languageInput.disabled).toBe(true);
    expect(dateInput.disabled).toBe(true);
    expect(submitButton.disabled).toBe(true);
  });

  it('should show "Searching..." text when loading', () => {
    const onSearch = vi.fn();
    render(<SearchFilter onSearch={onSearch} loading={true} />);

    expect(screen.getByRole('button', { name: /Searching/ })).toBeInTheDocument();
  });

  it('should trim language input before submission', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchFilter onSearch={onSearch} loading={false} />);

    const languageInput = screen.getByLabelText(/Programming Language/);
    const dateInput = screen.getByLabelText(/Created After/);
    const submitButton = screen.getByRole('button', { name: /Search/ });

    await user.type(languageInput, '  typescript  ');
    await user.type(dateInput, '2023-01-01');
    await user.click(submitButton);

    expect(onSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        language: 'typescript',
      }),
    );
  });

  it('should not submit if language is empty', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchFilter onSearch={onSearch} loading={false} />);

    const dateInput = screen.getByLabelText(/Created After/);
    const submitButton = screen.getByRole('button', { name: /Search/ });

    await user.type(dateInput, '2023-01-01');
    await user.click(submitButton);

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('should not submit if created-after is empty', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchFilter onSearch={onSearch} loading={false} />);

    const languageInput = screen.getByLabelText(/Programming Language/);
    const submitButton = screen.getByRole('button', { name: /Search/ });

    await user.type(languageInput, 'typescript');
    await user.click(submitButton);

    expect(onSearch).not.toHaveBeenCalled();
  });
});
