import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      title: exception instanceof HttpException ? exception.getResponse()['title'] : 'Internal Server Error',
      status: status,

      detail: exception instanceof HttpException ? exception.getResponse()['detail'] : 'An unexpected error occurred',
      errors: exception instanceof HttpException ? exception.getResponse()['errors'] : [{ message: 'Internal server error' }],
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}