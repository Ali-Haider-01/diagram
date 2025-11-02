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
    example: '8285d600-9048-403d-b3c2-8b327995ddb2',
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
        _id: 'fe96e7cd-9d0f-4868-87a1-1532af1a14f3',
        diagramName: 'Diagram Title',
        url: 'https://example.com/diagram',
        shortCode: 'SMD',
        status: 'ACTIVE',
        slugs: ['diagram-title', 'diagram-title2'],
        logoImage: 'https://example.com/image.png',
        createdBy: {
          _id: '7978b940-da9c-4d5d-8b96-d66ed1ce2529',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
        createdAt: '2025-07-04T06:48:45.877Z',
        updatedAt: '2025-07-04T06:48:45.877Z',
      },
    ],
  })
  data!: {};
  @ApiProperty({ example: null })
  errors!: [];
}

export class GetDiagramByIdRequestResponse {
  @ApiProperty({ example: 200 })
  statusCode!: number;
  message!: string;
  @ApiProperty({
    example: {
      _id: 'fe96e7cd-9d0f-4868-87a1-1532af1a14f3',
      diagramName: 'Diagram Title',
      url: 'https://example.com/diagram',
      shortCode: 'SMD',
      status: 'ACTIVE',
      slugs: ['diagram-title', 'diagram-title2'],
      logoImage: 'https://example.com/image.png',
      createdBy: {
        _id: '7978b940-da9c-4d5d-8b96-d66ed1ce2529',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
      createdAt: '2025-07-04T06:48:45.877Z',
      updatedAt: '2025-07-04T06:48:45.877Z',
    },
  })
  data!: {};
  @ApiProperty({ example: null })
  errors!: [];
}
