import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ALL_SERVICE_PROVIDERS, SERVICE_PROVIDERS } from './common/service';
import { ActivityLog, ActivityLogRepository, ActivityLogSchema, JwtStrategy  } from '@diagram/shared';
import Joi from 'joi';
import { UserController } from './common/controllers/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { DiagramController } from './common/controllers/diagram.controllers';
import { ActivityLogInterceptor } from '../interceptors/activity-log.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityLogController } from './common/controllers/activity-log.controllers';
import { EventEmitterModule } from '@nestjs/event-emitter';


const schemaObject = {
  // Mongo DB Configuration
  GATEWAY_PORT: Joi.number().default(8000),
        
  // JWT Configuration
  JWT_KEY: Joi.string().required(), 

  MONGO_URI: Joi.string().required(),
  MONGO_DATABASE: Joi.string().required(),

};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object(schemaObject),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
        dbName: configService.get('MONGO_DATABASE'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: ActivityLog.name,
        schema: ActivityLogSchema,
      },
    ]),
     JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_KEY'),
      }),
    }),
    EventEmitterModule.forRoot()
  ],
  controllers: [
    UserController,
    DiagramController,
    ActivityLogController,
  ],
  providers: [
    ...SERVICE_PROVIDERS,
    ALL_SERVICE_PROVIDERS,
    JwtStrategy,
    ActivityLogRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: ActivityLogInterceptor,
    },
  ],
  exports: [...SERVICE_PROVIDERS],
})
export class CommonModule {}
