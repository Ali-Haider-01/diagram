import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @ApiProperty({
    example: 'name',
    type: String,
  })
  name!: string;
  @IsString()
  @ApiProperty({
    example: '+923123456789',
    type: String,
  })
  phoneNumber!: string;
  @IsEmail()
  @ApiProperty({
    example: 'email@gmail.com',
    type: String,
  })
  email!: string;
  @IsString()
  @ApiProperty({
    example: 'password',
    type: String,
  })
  password!: string;
}

export class LogInDto {
  @IsEmail()
  @ApiProperty({
    example: 'email@gmail.com',
    type: String,
  })
  email!: string;
  @IsString()
  @ApiProperty({
    example: 'password',
    type: String,
  })
  password!: string;
}

export class EmailDto {
  @IsEmail()
  @ApiProperty({
    example: 'email@gmail.com',
    type: String,
  })
  email!: string;
}

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
