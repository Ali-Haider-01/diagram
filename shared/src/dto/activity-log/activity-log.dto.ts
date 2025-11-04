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
