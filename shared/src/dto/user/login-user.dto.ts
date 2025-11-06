import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

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

export class GenerateOTPRequestResponse {
  @ApiProperty({ example: 200 })
  statusCode!: number;
  message!: string;
  @ApiProperty({
    example: 'OTP Generated',
  })
  data!: string;
  @ApiProperty({ example: null, type: () => Object, nullable: true })
  error!: null;
}

export class LoginUserRequestResponse {
  @ApiProperty({ example: 200 })
  statusCode!: number;
  message!: string;
  @ApiProperty({
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  })
  data!: {
    access_token: string;
    refresh_token: string;
  };
  @ApiProperty({ example: null, type: () => Object, nullable: true })
  error!: null;
}
