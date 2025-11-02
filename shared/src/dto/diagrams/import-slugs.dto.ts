import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class SlugItemDto {
  @IsString()
  @ApiProperty({ example: 'diagram-title' })
  @IsArray()
  slugs!: string[];
}

export class ImportSlugsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SlugItemDto)
  @ApiProperty({
    type: [SlugItemDto],
    description: 'Array of slug objects',
    example: [{ slugs: 'diagram-title' }, { slugs: 'diagram-title-2' }],
  })
  parsedData!: SlugItemDto[];
}