import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { LoggingService } from '../logging/logging.service';
export declare class AllExceptionsFilter implements ExceptionFilter<unknown> {
    private loggingService;
    constructor(loggingService: LoggingService);
    private logError;
    catch(exception: unknown, host: ArgumentsHost): void;
}
