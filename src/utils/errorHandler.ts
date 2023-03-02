import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import {
  INTERNAL_SERVER_ERROR,
  UNPROCESIBLE_ENTITY_ERROR,
} from '../constant/constant';

@Catch()
export class ErrorHandler implements ExceptionFilter {
  private logger;
  constructor(private configService: ConfigService) {
    this.logger = new Logger(ErrorHandler.name);
  }
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMsg = INTERNAL_SERVER_ERROR;
    let errorDescription = exception;
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      //check if error is from request validation
      errorMsg =
        exception instanceof UnprocessableEntityException
          ? UNPROCESIBLE_ENTITY_ERROR
          : exception.message;
      errorDescription = JSON.stringify(exception);
    }
    if (this.configService.get('ERROR_LOG')) {
      this.logger.error(
        `HTTP ${request.method} ${request.url} ${JSON.stringify(
          request.body,
        )} --- ${statusCode} - ${errorMsg} - ${errorDescription}}`,
      );
    }
    errorMsg =
      statusCode == HttpStatus.INTERNAL_SERVER_ERROR
        ? INTERNAL_SERVER_ERROR
        : errorMsg;
    response.status(statusCode).json({
      success: false,
      message: errorMsg,
    });
  }
}
