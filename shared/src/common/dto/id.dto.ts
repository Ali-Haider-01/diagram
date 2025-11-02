import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";

export class IdDto  {
  @ApiProperty({ example: '19b88ebe-dba4-4f68-be6e-b89d71f66eb2' })
  @IsNotEmpty()
  @Matches(/^[0-9a-fA-F-]{36}$/, {
    message: 'Id must be a valid UUID.',
  })
  id!: string;
}