import { Module } from '@nestjs/common';
import { CommonModule } from './app/common.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CommonModule,
    PassportModule,
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
