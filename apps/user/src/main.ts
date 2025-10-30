import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { Transport } from '@nestjs/microservices';
import { SERVICES } from '@diagram/shared';

async function bootstrap() {
     const app = await NestFactory.createMicroservice(UserModule,{
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URI],
      queue: process.env[`RMQ_${SERVICES.USER}_QUEUE`],
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen();
}

bootstrap();
