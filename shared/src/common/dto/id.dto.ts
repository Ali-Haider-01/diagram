import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class IdDto  {
  @ApiProperty({ example: '690872ecc1c9e63aa21019d9' })
  @IsNotEmpty()
  @IsString()
  id!: string;
}