import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ALL_SERVICE_PROVIDERS, SERVICE_PROVIDERS } from './common/service';
import { JwtStrategy } from '@diagram/shared';
import Joi from 'joi';
import { SERVICES } from '@diagram/shared';
import { UserController } from './common/controllers/user.controller';


const schemaObject = {
  // RMQ Configuration
  RMQ_URI: Joi.string().required(),
  [`RMQ_${SERVICES.GATEWAY}_QUEUE`]: Joi.string().required(),

  // Mongo DB Configuration
  GATEWAY_PORT: Joi.number().default(8000),
        
  // JWT Configuration
  JWT_KEY: Joi.string().required(),
  
  RMQ_USER_QUEUE: Joi.string().required(),
  //RMQ_DIAGRAM_QUEUE: Joi.string().required(),
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object(schemaObject),
    })],
  controllers: [
    UserController,
  ],
  providers: [...SERVICE_PROVIDERS, ALL_SERVICE_PROVIDERS, JwtStrategy],
  exports: [...SERVICE_PROVIDERS],
})
export class CommonModule {}
