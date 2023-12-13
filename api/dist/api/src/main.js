"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./internals/runtime/load-environment-variables");
require("./internals/runtime/environment-variables");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const environment_variables_1 = require("./internals/runtime/environment-variables");
const swagger_1 = require("@nestjs/swagger");
const logging_service_1 = require("./internals/logging/logging.service");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    const loggingService = app.get(logging_service_1.LoggingService);
    const logger = {
        log(message) {
            loggingService.logInfo('nestjs-logger-log', message);
        },
        error(message, trace) {
            loggingService.logError('nestjs-logger-error', new Error(), {
                message,
                trace,
            });
        },
        warn(message) {
            loggingService.logWarning('nestjs-logger-warn', message);
        },
        debug(message) {
            loggingService.logDebug('nestjs-logger-debug', message);
        },
        verbose(message) {
            loggingService.logInfo('nestjs-logger-verbose', message);
        },
    };
    app.useLogger(logger);
    if (environment_variables_1.EnvironmentVariables.APP_ENV === 'local') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('eChat Messaging')
            .setDescription('API for a messaging system')
            .setVersion('1.0')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
        }, 'access-token')
            .addSecurityRequirements('access-token')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api', app, document);
    }
    app.enableShutdownHooks();
    await app.listen(process.env.PORT || 3000);
}
bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map