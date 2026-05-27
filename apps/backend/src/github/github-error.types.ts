export interface GithubApiError extends Error {
  status?: number;
  headers?: Record<string, string | string[]>;
  name: string;
}

export interface AbortError extends Error {
  name: 'AbortError';
}

export type GithubError = GithubApiError | AbortError;

export function isAbortError(error: unknown): error is AbortError {
  return error instanceof Error && error.name === 'AbortError';
}

export function isGithubApiError(error: unknown): error is GithubApiError {
  return error instanceof Error && 'status' in error;
}

export function getRetryAfter(error: GithubApiError): number {
  if (!error.headers) return 60;
  const retryAfter = error.headers['retry-after'];
  if (typeof retryAfter === 'string') {
    return parseInt(retryAfter, 10) || 60;
  }
  return 60;
}
