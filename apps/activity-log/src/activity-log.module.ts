import { Module } from '@nestjs/common';
import { ActivityLogController } from './app/controller/activity-log.controller';
import { ActivityLogService } from './app/services/activity-log.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityLog, ActivityLogRepository, ActivityLogSchema } from '@diagram/shared';
import { JwtModule } from '@nestjs/jwt';

const schemaObject = {
  // Mongo DB Configuration
  MONGO_URI: Joi.string().required(),
  MONGO_DATABASE: Joi.string().required(),

  // JWT Configuration
  JWT_KEY: Joi.string().required(),
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
  ],
  controllers: [ActivityLogController],
  providers: [ActivityLogService, ActivityLogRepository],
})
export class ActivityLogModule {}
