import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from './schema';
import Joi = require('joi');
import { UserRepository } from './repository';

const schemaObject = {
  GATEWAY_PORT: Joi.number().default(8000),

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
  providers: [UserRepository],
  exports: [JwtModule, UserRepository],
})
export class SharedModule {}
