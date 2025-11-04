import { Module } from '@nestjs/common';
import { SERVICES, User, UserRepository, UserSchema } from '@diagram/shared';
import Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './app/controller/user.controller';
import { UserService } from './app/services/user.service';

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