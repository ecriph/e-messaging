import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const extractor = (request: Expre): string | string[] =>
    [request.headers['custom-versioning-field'] ?? '']
      .flatMap((v) => v.split(','))
      .filter((v) => !!v)
      .sort()
      .reverse();

  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.CUSTOM,
    extractor,
  });

  await app.listen(3000);
}
bootstrap();
