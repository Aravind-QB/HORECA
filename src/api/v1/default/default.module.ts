import { Module } from '@nestjs/common';
import { DefaultController } from './default.controller';
import { DefaultService } from './default.service';

@Module({
  controllers: [DefaultController],
  providers: [DefaultService],
  exports: [DefaultService],
})
export class DefaultModule {}
