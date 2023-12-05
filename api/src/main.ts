import './internals/runtime/load-environment-variables';
import './internals/runtime/environment-variables';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './internals/runtime/environment-variables';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingService } from './internals/logging/logging.service';
import { LoggerService, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const loggingService = app.get(LoggingService);

  const logger: LoggerService = {
    log(message: string) {
      loggingService.logInfo('nestjs-logger-log', message);
    },
    error(message: string, trace: string) {
      loggingService.logError('nestjs-logger-error', new Error(), {
        message,
        trace,
      });
    },
    warn(message: string) {
      loggingService.logWarning('nestjs-logger-warn', message);
    },
    debug(message: string) {
      loggingService.logDebug('nestjs-logger-debug', message);
    },
    verbose(message: string) {
      loggingService.logInfo('nestjs-logger-verbose', message);
    },
  };

  app.useLogger(logger);

  if (EnvironmentVariables.APP_ENV === 'local') {
    const config = new DocumentBuilder()
      .setTitle('eChat Messaging')
      .setDescription('API for a messaging system')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
        },
        'access-token',
      )
      .addSecurityRequirements('access-token')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.enableShutdownHooks();

  await app.listen(3000);
}
bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
