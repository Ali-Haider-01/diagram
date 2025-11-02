import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class IdsDto {
  @ApiProperty({
    description: 'comma seperated ids without space',
    example: '5009b2ab-fef8-46b7-bfc1-488b36e7caed,5049b2ab-fef8-46b7-bfc1-488b36e7caed',
  })
  @IsString()
  @IsNotEmpty()
  ids!: string;
}

export class IdsDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({
    type: [String],
    example: [
      '5009b2ab-fef8-46b7-bfc1-488b36e7caed',
      '5049b2ab-fef8-46b7-bfc1-488b36e7caed',
    ],
    required: true,
  })
  ids!: [];
}

export class DeleteResponseDto {
  @ApiProperty({ example: 200, description: 'HTTP status code' })
  statusCode!: number;

  @ApiProperty({
    example: 'Deleted successfully',
    description: 'Response message',
  })
  message!: string;

  @ApiProperty({
    example: {
      acknowledged: true,
      deletedCount: 1,
    },
    description: 'Response data object',
  })
  data!: {};

  @ApiProperty({ example: null, description: 'Error details (if any)' })
  error!: null | string;
}