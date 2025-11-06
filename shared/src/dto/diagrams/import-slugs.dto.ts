import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportSlugsDto {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    type: [String],
    description: 'Array of slugs to import',
    example: ['diagram-title', 'diagram-title-2'],
  })
  slugs!: string[];
}

export class ImportSlugsRequestResponse {
  @ApiProperty({ example: 200 })
  statusCode!: number;
  message!: string;
  @ApiProperty({
    example: {
      diagram: {
        _id: '690872ecc1c9e63aa21019d9',
        name: 'Diagram Title',
        url: 'https://example.com/diagram',
        slugs: ['diagram-title', 'diagram-title2'],
        shortCode: 'SMD',
        status: 'ACTIVE',
        createdAt: '2025-07-04T06:48:45.877Z',
        updatedAt: '2025-07-04T06:48:45.877Z',
      },
    },
  })
  data!: {
    diagram: {
      _id: string;
      name: string;
      url: string;
      slugs: string[];
      shortCode: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  @ApiProperty({ example: null, type: () => Array, nullable: true })
  errors!: [];
}
