import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { SERVICES } from '@diagram/shared';
import { ActivityLogModule } from './activity-log.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ActivityLogModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URI],
      queue: process.env[`RMQ_${SERVICES.ACTIVITY_LOG}_QUEUE`],
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen();
}

bootstrap();
