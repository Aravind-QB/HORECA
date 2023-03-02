import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { Logger, VersioningType } from '@nestjs/common';
import { corsOptions } from './config/cors.config';
import { GLOBAL_PREFIX } from './constant/constant';
import { CustomValidationPipe } from './utils/validation';
import { ErrorHandler } from './utils/errorHandler';
import { SuccessResponseHandler } from './utils/responseHandler';
import { EntryExitLog } from './utils/entryExitLog';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //load env
  const configService = app.get<ConfigService>(ConfigService);

  //enable CORS
  app.enableCors(corsOptions(configService));

  //set security headers using helmet
  app.use(helmet());

  //compress request response
  app.use(compression());

  //set prefix
  app.setGlobalPrefix(GLOBAL_PREFIX);

  //api versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  //use validation pipe
  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );

  //error handler
  app.useGlobalFilters(new ErrorHandler(configService));

  //success response handler
  app.useGlobalInterceptors(new SuccessResponseHandler());

  //entry-exit log
  app.useGlobalInterceptors(new EntryExitLog(configService));

  //logger
  const logger = new Logger();

  await app.listen(configService.get('PORT'), () => {
    logger.log(`Successfully connected to port ${configService.get('PORT')}`);
  });
}
bootstrap();
