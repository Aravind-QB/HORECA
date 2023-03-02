import { Controller, Get } from '@nestjs/common';

@Controller('default')
export class DefaultController {
  @Get()
  findAll(): any {
    return { message: 'Default API worked..!' };
  }
}
