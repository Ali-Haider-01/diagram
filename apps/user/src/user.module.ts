import { Module } from '@nestjs/common';
import { UserController } from './app/user.controller';
import { UserService } from './app/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SERVICES, User, UserSchema, UserRepository } from '@diagram/shared';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';

const schemaObject = {
  // RMQ Configuration
  RMQ_URI: Joi.string().required(),
  [`RMQ_${SERVICES.USER}_QUEUE`]: Joi.string().required(),

  // Mongo DB Configuration
  MONGODB_URI: Joi.string().required(),
  MONGODB_NAME: Joi.string().required(),
  
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
       uri: configService.get('MONGODB_URI'),
        dbName: configService.get('MONGODB_NAME'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
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
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}