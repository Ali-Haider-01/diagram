import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDiagramDto } from './create-diagram.dto';
import { IsArray, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { DIAGRAM_STATUS } from 'shared/src/constant';

export class UpdateDiagramDto extends PartialType(CreateDiagramDto) {
  @ApiProperty({
    type: String,
    example: 'Diagram Title',
    required: false,
  })
  override name!: string;

  @ApiProperty({
    type: String,
    example: 'https://example.com/diagram',
    required: false,
  })
  override url!: string;

  @ApiProperty({
    type: String,
    enum: DIAGRAM_STATUS,
    required: false,
  })
  override status!: string;

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
    description: 'Array of slug values for the diagram',
    required: false,
  })
  override slugs!: string[];

  @IsString()
  @ApiProperty({
    type: String,
    example: 'SMD',
    description: 'Short code for the diagram',
    required: false,
  })
  override shortCode!: string;
}

export class UpdateDiagramRequestResponse {
  @ApiProperty({ example: 200 })
  statusCode!: number;
  message!: string;
  @ApiProperty({
    example: {
      _id: '690872ecc1c9e63aa21019d9',
      name: 'Updated Diagram Title',
      url: 'https://example.com/updated-diagram',
      status: 'ACTIVE',
      slugs: ['updated-diagram-title', 'updated-diagram-title2'],
      createdBy: '690872ecc1c9e63aa21019d9',
      createdAt: '2025-07-04T06:48:45.877Z',
      updatedAt: '2025-07-04T06:48:45.877Z',
    },
  })
  data: any;
  @ApiProperty({ example: null })
  errors!: [];
}
