import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from '../../common/dto';
import { Transform, Type } from 'class-transformer';

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

export class GetUserRequestResponse {
  @ApiProperty({ example: 200 })
  statusCode!: number;
  message!: string;
  @ApiProperty({
    example: [
      {
        _id: '690872ecc1c9e63aa21019d9',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+923123456789',
        address: '123 Main St, Anytown, USA',
        status: 'ACTIVE',
        age: 30,
        createdAt: '2025-07-04T06:48:45.877Z',
        updatedAt: '2025-07-04T06:48:45.877Z',
      },
    ],
  })
  data!: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    status: string;
    age: number;
    createdAt: string;
    updatedAt: string;
  }[];
  @ApiProperty({ required: false, example: null })
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    resultCount: number;
    totalResult: number;
  };
  @ApiProperty({ example: null })
  error!: null;
}

export class GetUserProfileRequestResponse {
  @ApiProperty({ example: 200 })
  statusCode!: number;
  message!: string;
  @ApiProperty({
    example: {
      _id: '690872ecc1c9e63aa21019d9',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+923123456789',
      address: '123 Main St, Anytown, USA',
      status: 'ACTIVE',
      age: 30,
      createdAt: '2025-07-04T06:48:45.877Z',
      updatedAt: '2025-07-04T06:48:45.877Z',
    },
  })
  data!: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    status: string;
    age: number;
    createdAt: string;
    updatedAt: string;
  };
  @ApiProperty({ example: null })
  error!: null;
}
