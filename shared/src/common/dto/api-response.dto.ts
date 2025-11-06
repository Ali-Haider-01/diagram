import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto {

  @ApiProperty({
    nullable: true,
    default: null,
  })
  data: any;

  @ApiProperty({
    nullable: true,
    example: 'Success',
  })
  message!: string;

  @ApiProperty({
    nullable: true,
    default: null,
    type: () => Object,
    description: 'Error details (string, object, or null)',
  })
  errors!: string | object | null;
}
