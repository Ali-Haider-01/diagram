import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsISO8601, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'shared/src/common/dto';

export class GetDiagramDto extends PaginationDto {
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
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    example: '690872ecc1c9e63aa21019d9',
  })
  userId?: string;

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

export class GetDiagramRequestResponse {
  @ApiProperty({ example: 200 })
  statusCode!: number;
  message!: string;
  @ApiProperty({
    example: [
      {
        _id: '690872ecc1c9e63aa21019d9',
        name: 'Diagram Title',
        url: 'https://example.com/diagram',
        shortCode: 'SMD',
        status: 'ACTIVE',
        slugs: ['diagram-title', 'diagram-title2'],
        logoImage: 'https://example.com/image.png',
        createdBy: {
          _id: '690872ecc1c9e63aa21019d9',
          name: 'John',
          email: 'john.doe@example.com',
        },
        createdAt: '2025-07-04T06:48:45.877Z',
        updatedAt: '2025-07-04T06:48:45.877Z',
      },
    ],
  })
  data!: {};
  @ApiProperty({ example: null, type: () => Array, nullable: true })
  errors!: [];
}

export class GetDiagramByIdRequestResponse {
  @ApiProperty({ example: 200 })
  statusCode!: number;
  message!: string;
  @ApiProperty({
    example: {
      _id: '690872ecc1c9e63aa21019d9',
      name: 'Diagram Title',
      url: 'https://example.com/diagram',
      shortCode: 'SMD',
      status: 'ACTIVE',
      slugs: ['diagram-title', 'diagram-title2'],
      logoImage: 'https://example.com/image.png',
      createdBy: {
        _id: '690872ecc1c9e63aa21019d9',
        name: 'John',
        email: 'john.doe@example.com',
      },
      createdAt: '2025-07-04T06:48:45.877Z',
      updatedAt: '2025-07-04T06:48:45.877Z',
    },
  })
  data!: {};
  @ApiProperty({ example: null, type: () => Array, nullable: true })
  errors!: [];
}
