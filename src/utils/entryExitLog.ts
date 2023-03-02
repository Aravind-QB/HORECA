import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class EntryExitLog<T> implements NestInterceptor<T> {
  private logger;
  constructor(private configService: ConfigService) {
    this.logger = new Logger(EntryExitLog.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    //log requests on entry to contoller
    this.logger.log(`Incoming request to ${request.method}-${request.url}`);

    return next.handle().pipe(
      map((result) => {
        const response = ctx.getResponse();
        //debug log
        if (this.configService.get('DEBUG_LOG')) {
          this.logger.debug(
            `HTTP ${request.method} ${request.url} ${JSON.stringify(
              request.body,
            )} --- ${response.statusCode} - ${JSON.stringify(result)}`,
          );
        }
        return result;
      }),
    );
  }
}
