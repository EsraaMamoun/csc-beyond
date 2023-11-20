import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SetupSwagger } from './configurations/swagger.configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: { exposedHeaders: 'x-total-count' },
  });

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(`api`, {
    exclude: [{ path: 'public/:fileName', method: RequestMethod.GET }],
  });

  SetupSwagger(app);

  await app.listen(configService.get('PORT'));

  Logger.verbose(
    `Server URL http://${configService.get('URL')}${
      (configService.get('ENV') === 'development' &&
        `:${configService.get('PORT')}`) ||
      ''
    }`,
    'NestApplication',
  );

  Logger.verbose(
    `Api Documentation http://${configService.get('URL')}${
      (configService.get('ENV') === 'development' &&
        `:${configService.get('PORT')}`) ||
      ''
    }/api/docs`,
    'NestApplication',
  );
}
bootstrap();
