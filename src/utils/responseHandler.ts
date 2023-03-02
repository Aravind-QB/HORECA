import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_NUMBER } from '../constant/constant';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Response<T> {
  success: boolean;
  meta?: object;
  data?: object;
  message?: string;
}

@Injectable()
export class SuccessResponseHandler<T> implements NestInterceptor<T> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    return next.handle().pipe(
      map((result) => {
        const {
          message = null,
          data = null,
          count = null,
        }: {
          message: string | null;
          data: object;
          count: number | null;
        } = result;
        let formattedResponse: Response<T> = { success: true };
        if (message) {
          formattedResponse = { ...formattedResponse, message };
        }
        if (data) {
          formattedResponse = { ...formattedResponse, data };
        }
        if (count) {
          const current_page =
            (request.query.current_page as number) ?? DEFAULT_PAGE_NUMBER;
          const per_page =
            (request.query.per_page as number) ?? DEFAULT_PAGE_LIMIT;
          const total_page = Math.ceil(count / per_page);
          const meta = { count, total_page, current_page };
          formattedResponse = { ...formattedResponse, meta };
        }
        return formattedResponse;
      }),
    );
  }
}
