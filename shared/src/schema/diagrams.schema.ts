import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AbstractSchema } from '../common/abstract';
import { STATUS } from '../constant';

export type diagramDocument = HydratedDocument<Diagram>;

@Schema({ timestamps: true, versionKey: false, collection: 'diagrams' })
export class Diagram extends AbstractSchema {

  @Prop({ required: true, type: String, unique: true, trim: true })
  name!: string;

  @Prop({ required: false, type: String, unique: true, trim: true })
  url!: string;

  @Prop({
    type: [String],
    validate: {
      validator: (slugs: string[]) => {
        return slugs.length === new Set(slugs).size;
      },
      message: 'Slugs must be unique within the same diagram',
    },
  })
  slugs!: string[];


  @Prop({ type: String, enum: STATUS, default: STATUS.ACTIVE })
  status!: string;

  @Prop({ type: String, required: false, unique: true })
  shortCode!: string;

  @Prop({ type: String, required: true })
  createdBy!: string;
}
export const DiagramSchema = SchemaFactory.createForClass(Diagram);
