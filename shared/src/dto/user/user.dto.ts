import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto';
import { Transform, Type } from 'class-transformer';

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
    example: 'address',
    type: String,
  })
  address!: string;
  @IsString()
  @ApiProperty({
    example: 'ACTIVE',
    type: String,
  })
  status!: string;
  @IsNumber()
  @ApiProperty({
    example: 'age',
    type: Number,
  })
  age!: Number;
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

export class UpdateUserDto extends PartialType(UserDto) {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'name',
    type: String,
    required: false,
  })
  override name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '+923123456789',
    type: String,
    required: false,
  })
  override phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: 'email@gmail.com',
    type: String,
    required: false,
  })
  override email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'address',
    type: String,
    required: false,
  })
  override address?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'ACTIVE',
    type: String,
    required: false,
  })
  override status?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 25,
    type: Number,
    required: false,
  })
  override age?: Number;
}

export class GetUserDto extends PaginationDto {
  @IsOptional()
  @IsISO8601()
  @ApiProperty({
    required: false,
    type: String,
    format: 'date',
    example: '2025-07-04',
  })
  startDate!: string;

  @IsOptional()
  @IsISO8601()
  @ApiProperty({
    required: false,
    type: String,
    format: 'date',
    example: '2025-07-04',
  })
  endDate!: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    required: false,
    type: String,
    example: 'email@gmail.com',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    example: 'ACTIVE',
  })
  status?: string;

  @IsOptional() 
  @IsBoolean()
  @Type(() => String)
  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    return undefined;
  })
  @ApiProperty({ required: false, type: Boolean, default: true })
  meta?: boolean;
}
