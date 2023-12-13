export declare class LoggingService {
    logDebug(key: string, extraData?: unknown): void;
    logInfo(key: string, extraData?: unknown): void;
    logWarning(key: string, extraData?: unknown): void;
    logError(key: string, caughtValue: unknown, extraData?: unknown): void;
}
