import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @ApiProperty({
    example: 'email@gmail.com',
    type: String,
  })
  email!: string;
  @IsString()
  @ApiProperty({
    example: 'new password',
    type: String,
  })
  newPassword!: string;
  @IsString()
  @ApiProperty({
    example: 'otp',
    type: String,
  })
  otp!: string;
}

export class ChangePasswordDto {
  @IsString()
  @ApiProperty({
    example: 'old password',
    type: String,
  })
  oldPassword!: string;
  @IsString()
  @ApiProperty({
    example: 'new password',
    type: String,
  })
  newPassword!: string;
  @IsString()
  @ApiProperty({
    example: 'confirm password',
    type: String,
  })
  confirmPassword!: string;
}

export class ForgotPasswordRequestResponse {
  @ApiProperty({ example: 200 })
  statusCode!: number;
  message!: string;
  @ApiProperty({
    example: 'New password generated successfully',
  })
  data!: string;
  @ApiProperty({ example: null, type: () => Object, nullable: true })
  error!: null;
}

export class ChangePasswordRequestResponse {
  @ApiProperty({ example: 200 })
  statusCode!: number;
  message!: string;
  @ApiProperty({
    example: 'Password updated successfully',
  })
  data!: string;
  @ApiProperty({ example: null, type: () => Object, nullable: true })
  error!: null;
}

export class LogOutRequestResponse {
  @ApiProperty({ example: 200 })
  statusCode!: number;
  message!: string;
  @ApiProperty({
    example: 'Logged out successfully',
  })
  data!: string;
  @ApiProperty({ example: null, type: () => Object, nullable: true })
  error!: null;
}
