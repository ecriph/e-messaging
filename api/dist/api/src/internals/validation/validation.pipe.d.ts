import { PipeTransform } from '@nestjs/common';
import { z } from 'zod';
export declare class ValidationPipe implements PipeTransform<unknown> {
    private schema;
    constructor(schema: z.ZodType<unknown>);
    transform(incomingValue: unknown): unknown;
}
