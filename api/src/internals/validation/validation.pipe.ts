import { PipeTransform, BadRequestException } from '@nestjs/common';
import { z } from 'zod';

export class ValidationPipe implements PipeTransform<unknown> {
  constructor(private schema: z.ZodType<unknown>) {}

  transform(incomingValue: unknown): unknown {
    const result = this.schema.safeParse(incomingValue);

    if (result.success) {
      return result.data;
    } else {
      throw new BadRequestException(result);
    }
  }
}
