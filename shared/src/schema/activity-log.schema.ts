import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractSchema } from '../common/abstract';

@Schema({ timestamps: true, versionKey: false, collection: 'activity_logs' })
export class ActivityLog extends AbstractSchema {
  @Prop({ required: true })
  method!: string;

  @Prop({ required: true })
  url!: string;

  @Prop({ required: true })
  statusCode!: number;

  @Prop({ required: false })
  userId?: string;

  @Prop({ required: false })
  userEmail?: string;

  @Prop({ required: false })
  ipAddress?: string;

  @Prop({ required: false, type: Object })
  requestBody?: Record<string, any>;

  @Prop({ required: false, type: Object })
  queryParams?: Record<string, any>;

  @Prop({ required: false })
  responseTime?: number;

  @Prop({ required: false })
  errorMessage?: string;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

