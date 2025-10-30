import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DiagramModule } from './diagram.module';

async function bootstrap() {
  const app = await NestFactory.create(DiagramModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
