import { Module } from '@nestjs/common';
import { CommonModule } from './app/common.module';
import { PassportModule } from '@nestjs/passport';
import { SharedModule } from '@diagram/shared';

@Module({
  imports: [
    CommonModule,
    PassportModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
