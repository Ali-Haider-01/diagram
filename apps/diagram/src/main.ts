import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { SERVICES } from '@diagram/shared';
import { DiagramModule } from './diagram.module';

async function bootstrap() {
     const app = await NestFactory.createMicroservice(DiagramModule,{
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URI],
      queue: process.env[`RMQ_${SERVICES.DIAGRAM}_QUEUE`],
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen();
}

bootstrap();
