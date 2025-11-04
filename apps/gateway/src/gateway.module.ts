import { Module } from '@nestjs/common';
import { CommonModule } from './app/modules/common.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    CommonModule,
    PassportModule,
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
