import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { ActivityLog } from '../schema';
import { AbstractRepository } from '../common/abstract';

@Injectable()
export class ActivityLogRepository extends AbstractRepository<ActivityLog> {
  protected readonly logger = new Logger(ActivityLogRepository.name);

  constructor(
    @InjectModel(ActivityLog.name) activityLogModel: Model<ActivityLog>,
    @InjectConnection() connection: Connection
  ) {
    super(activityLogModel, connection);
  }
}

