import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractSchema } from '../common/abstract';
import { DIAGRAM_STATUS } from '../constant';

@Schema({ versionKey: false })
export class User extends AbstractSchema {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  phoneNumber!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: false })
  refreshToken?: string;

  @Prop({ required: false })
  accessToken?: string;

   @Prop({ required: false })
  otp?: string;

  @Prop({ required: false, type: Number })
  otpGenerateTime?: number;

  @Prop({ type: String, enum: DIAGRAM_STATUS, default: DIAGRAM_STATUS.ACTIVE })
    status!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

