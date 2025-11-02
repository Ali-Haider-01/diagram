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
  diagramName!: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'https://example.com/diagram',
    required: true,
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

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  logoImage?: string;
}

export class CreateDiagramRequestResponse {
  @ApiProperty({ example: 201 })
  statusCode!: number;
  message!: string;
  @ApiProperty({
    example: {
      _id: 'fe96e7cd-9d0f-4868-87a1-1532af1a14f3',
      diagramName: 'Diagram Title',
      url: 'https://example.com/diagram',
      status: 'ACTIVE',
      slugs: ['diagram-title', 'diagram-title2'],
      logoImage: 'https://example.com/image.png',
      createdBy: '7e717689-51f7-4010-8fd6-f842721a4dc8',
      createdAt: '2025-07-04T06:48:45.877Z',
      updatedAt: '2025-07-04T06:48:45.877Z',
    },
  })
  data!: {};
  @ApiProperty({ example: null })
  errors!: [];
}
