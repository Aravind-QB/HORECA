import { HttpException } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsOptions = (configService) => {
  const whitelist = configService.get('WHITELIST_SERVER');
  const corsOptions: CorsOptions = {
    origin: (origin, cb) => {
      if (configService.get('NODE_ENV') == 'dev') {
        cb(null, true);
      } else if (whitelist.indexOf(origin as string) !== -1) {
        cb(null, true);
      } else {
        cb(new HttpException('Not allowed by CORS', 403));
      }
    },
  };
  return corsOptions;
};
