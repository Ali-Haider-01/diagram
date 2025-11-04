import { Module } from '@nestjs/common';
import { Diagram, DiagramRepository, DiagramSchema } from '@diagram/shared';
import Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { DiagramController } from './app/controller/diagram.controller';
import { DiagramService } from './app/services/diagram.service';

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
        name: Diagram.name,
        schema: DiagramSchema,
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
  controllers: [DiagramController],
  providers: [DiagramService, DiagramRepository],
})
export class DiagramModule { }