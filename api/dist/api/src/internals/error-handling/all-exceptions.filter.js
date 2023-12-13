"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const logging_service_1 = require("../logging/logging.service");
const resource_not_found_exception_1 = require("../server/resource-not-found.exception");
let AllExceptionsFilter = class AllExceptionsFilter {
    constructor(loggingService) {
        this.loggingService = loggingService;
    }
    logError(exception, request) {
        this.loggingService.logError('on-exception-request-logging', exception, {
            path: request.path,
            method: request.method,
            statusCode: exception instanceof common_1.HttpException ? exception.getStatus() : undefined,
            body: request.body,
        });
    }
    catch(exception, host) {
        if (host.getType() !== 'http') {
            this.loggingService.logError('all-exceptions-filter:unknown-execution-context', new Error());
            return;
        }
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        if (exception instanceof common_1.HttpException) {
            const statusCode = exception.getStatus();
            if (statusCode >= 500) {
                this.logError(exception, request);
            }
            else {
                this.loggingService.logDebug('request-exception', {
                    exception,
                    request: {
                        path: request.path,
                        method: request.method,
                        statusCode: statusCode,
                        body: request.body,
                    },
                });
                if (exception instanceof resource_not_found_exception_1.ResourceNotFoundException) {
                    response.set('X-Resource-Not-Found', 'true');
                }
            }
            response.status(statusCode).json(exception.getResponse());
        }
        else {
            this.logError(exception, request);
            const internalErrorException = new common_1.InternalServerErrorException();
            response
                .status(internalErrorException.getStatus())
                .json(internalErrorException.getResponse());
        }
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [logging_service_1.LoggingService])
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map