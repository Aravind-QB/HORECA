import { Module } from '@nestjs/common';
import { envSchema } from './config/env-schema';
import { ConfigModule } from '@nestjs/config';
import { V1RouterModule } from './api/v1/v1.module';

@Module({
  imports: [
    // Load env and env validation
    ConfigModule.forRoot({
      validationSchema: envSchema,
      cache: true,
      isGlobal: true,
    }),
    // Import routes here
    V1RouterModule,
  ],
  controllers: [
    // Define controllers
  ],
  providers: [
    // Define providers
  ],
})
export class AppModule {}
