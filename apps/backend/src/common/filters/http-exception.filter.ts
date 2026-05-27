import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  BaseExceptionData,
  HttpExceptionResponse,
} from '../http-response.types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const error: BaseExceptionData =
      typeof exceptionResponse === 'object'
        ? (exceptionResponse as BaseExceptionData)
        : { message: exceptionResponse };

    const jsonResponse: HttpExceptionResponse = {
      statusCode: status,
      message: error.message || exception.message,
      error: error.error,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(jsonResponse);
  }
}
