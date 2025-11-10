import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto';

export class CreateActivityLogDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    example: 'GET',
  })
  method?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    example: '/sign-up',
  })
  url?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: Number,
    example: 200,
  })
  statusCode?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    example: '690872ecc1c9e63aa21019d9',
  })
  userId?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    required: false,
    type: String,
    example: 'email@gmail.com',
  })
  userEmail?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    example: '::46',
  })
  ipAddress?: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    required: false,
    type: String,
    example: {},
  })
  requestBody?: any;  

  @IsOptional()
  @IsObject()
  @ApiProperty({
    required: false,
    type: String,
    example: {},
  })
  queryParams?: any;  

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: Number,
    example: 12,
  })
  responseTime?: number;  

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    example: 'Bad Request Exception',
  })
  errorMessage?: string;
}


export class CreateActivityLogByRequestResponse {
  @ApiProperty({ example: 200 })
  statusCode!: number;
  message!: string;
  @ApiProperty({
    example: [
      {
        _id: '690872ecc1c9e63aa21019d9',
        method: 'GET',
        url: '/sign-up',
        statusCode: 200,
        userId: '690872ecc1c9e63aa21019d9',
        userEmail: 'john.doe@example.com',
        ipAddress: '127.0.0.1',
        requestBody: { name: 'John Doe' },
        queryParams: { page: 1, limit: 10 },
        responseTime: 100,
        errorMessage: null,
        createdAt: '2025-07-04T06:48:45.877Z',
        updatedAt: '2025-07-04T06:48:45.877Z',
      },
    ],
  })
  data!: {
    _id: string;
    method: string;
    url: string;
    statusCode: number;
    userId: string;
    userEmail: string;
    ipAddress: string;
    requestBody: Record<string, any>;
    queryParams: Record<string, any>;
    responseTime: number;
    errorMessage: string | null;
    createdAt: string;
    updatedAt: string;
  }[];
  @ApiProperty({ example: null })
  errors!: [];
}