import { Module } from '@nestjs/common';
import { DefaultModule } from './default/default.module';

@Module({
  imports: [DefaultModule],
})
export class V1RouterModule {}
