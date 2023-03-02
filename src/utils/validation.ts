import {
  ArgumentMetadata,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      throw new UnprocessableEntityException(e.response.message.toString());
    }
  }
}
