import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { STATUS } from 'shared/src/constant';

export class UserDto {
  @IsString()
  @ApiProperty({
    example: 'name',
    type: String,
  })
  name!: string;
  @IsString()
  @ApiProperty({
    example: '+923123456789',
    type: String,
  })
  phoneNumber!: string;
  @IsEmail()
  @ApiProperty({
    example: 'email@gmail.com',
    type: String,
  })
  email!: string;
  @IsString()
  @ApiProperty({
    example: 'address',
    type: String,
  })
  address!: string;
  @IsString()
  @ApiProperty({
    example: STATUS.ACTIVE,
    enum: STATUS,
    type: String,
  })
  status!: string;
  @IsNumber()
  @ApiProperty({
    example: 'age',
    type: Number,
  })
  age!: Number;
  @IsString()
  @ApiProperty({
    example: 'password',
    type: String,
  })
  password!: string;
}

export class CreateUserRequestResponse {
  @ApiProperty({ example: 200 })
  statusCode!: number;
  message!: string;
  @ApiProperty({
    example: {
      _id: '690872ecc1c9e63aa21019d9',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+923123456789',
      address: '123 Main St, Anytown, USA',
      status: 'ACTIVE',
      age: 30,
      createdAt: '2025-07-04T06:48:45.877Z',
      updatedAt: '2025-07-04T06:48:45.877Z',
    },
  })
  data!: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    status: string;
    age: number;
    createdAt: string;
    updatedAt: string;
  };
  @ApiProperty({ example: null, type: () => Object, nullable: true })
  error!: null;
}
