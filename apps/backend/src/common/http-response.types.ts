export interface HttpExceptionResponse {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  retryAfter?: number;
}

export interface BaseExceptionData {
  message: string;
  error?: string;
}
