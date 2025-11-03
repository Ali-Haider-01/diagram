import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { DIAGRAM_STATUS } from 'shared/src/constant';

export class CreateDiagramDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'Diagram Title',
    required: true,
  })
  name!: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'https://example.com/diagram',
    required: false,
  })
  url!: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    enum: DIAGRAM_STATUS,
    required: true,
  })
  status!: string;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((v) => v.trim());
    }
    return value;
  })
  @ApiProperty({
    type: [String],
    example: ['diagram-title', 'diagram-title2'],
    required: true,
  })
  slugs!: string[];

  @IsString()
  @ApiProperty({
    type: String,
    example: 'SMD',
    description: 'Short code for the diagram',
    required: true,
  })
  shortCode!: string;
}

export class CreateDiagramRequestResponse {
  @ApiProperty({ example: 201 })
  statusCode!: number;
  message!: string;
  @ApiProperty({
    example: {
      _id: '690872ecc1c9e63aa21019d9',
      name: 'Diagram Title',
      url: 'https://example.com/diagram',
      status: 'ACTIVE',
      slugs: ['diagram-title', 'diagram-title2'],
      createdBy: '690872ecc1c9e63aa21019d9',
      createdAt: '2025-07-04T06:48:45.877Z',
      updatedAt: '2025-07-04T06:48:45.877Z',
    },
  })
  data!: {};
  @ApiProperty({ example: null })
  errors!: [];
}
