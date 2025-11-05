import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto';
import { Transform, Type } from 'class-transformer';

export class ActivityLogDto extends PaginationDto {
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
  @IsNumber()
  @ApiProperty({
    required: false,
    type: Number,
    example: 200,
  })
  statusCode?: Number;

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


export class GetActivityLogByIdRequestResponse {
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