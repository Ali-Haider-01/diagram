import { Controller } from '@nestjs/common';
import { ActivityLogService } from '../services/activity-log.service';
import { ActivityLogDto } from '@diagram/shared';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@diagram/shared';

const {
  CREATE_ACTIVITY_LOG,
  GET_ALL_ACTIVITIES,
  GET_MOST_VISITED_API,
  GET_MOST_VISITED_USER,
} = MESSAGE_PATTERNS.ACTIVITY_LOG;

@Controller()
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @MessagePattern(GET_ALL_ACTIVITIES)
  async getAllActivityLog(@Payload() activityLogDto: ActivityLogDto) {
    return this.activityLogService.getAllActivityLog(activityLogDto);
  }

  @MessagePattern(CREATE_ACTIVITY_LOG)
  async createActivityLog(@Payload() createActivityLogDto: any) {
    return this.activityLogService.createActivityLog(createActivityLogDto);
  }

  @MessagePattern(GET_MOST_VISITED_API)
  async getMostVisitedApi() {
    return this.activityLogService.getMostVisitedApi();
  }

  @MessagePattern(GET_MOST_VISITED_USER)
  async getMostVisitedUser() {
    return this.activityLogService.getMostVisitedUser();
  }
}
