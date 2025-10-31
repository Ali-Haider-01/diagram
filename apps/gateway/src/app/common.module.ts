import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ALL_SERVICE_PROVIDERS, SERVICE_PROVIDERS } from './common/service';
import { JwtStrategy } from '@diagram/shared';
import Joi from 'joi';
import { SERVICES } from '@diagram/shared';
import { UserController } from './common/controllers/user.controller';




@Module({
  imports: [],
  controllers: [
    UserController,
  ],
  providers: [...SERVICE_PROVIDERS, ALL_SERVICE_PROVIDERS, JwtStrategy],
  exports: [...SERVICE_PROVIDERS],
})
export class CommonModule {}
