import { Module } from '@nestjs/common';
import { UserController } from './app/user.controller';
import { UserService } from './app/user.service';
import { SharedModule } from '@diagram/shared';
@Module({
  imports: [
    SharedModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}