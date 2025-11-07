import {
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import {
  ActivityLogDto,
  GetActivityLogByIdRequestResponse,
  GetMostVisitedApiDto,
  GetMostVisitedUserDto,
  MESSAGE_PATTERNS,
  SERVICES,
} from '@diagram/shared';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const { GET_ALL_ACTIVITIES,GET_MOST_VISITED_API,GET_MOST_VISITED_USER } = MESSAGE_PATTERNS.ACTIVITY_LOG;

@ApiTags('activity-log')
@Controller()
export class ActivityLogController {
  constructor(
    @Inject(SERVICES.ACTIVITY_LOG) private readonly activityLogClient: ClientRMQ
  ) {}

  @Get('/get-all-activity-log')
  @ApiCreatedResponse({ type: GetActivityLogByIdRequestResponse })
  async getAllActivityLog(@Query() activityLogDto: ActivityLogDto) {
    try {
      return await firstValueFrom(
        this.activityLogClient.send(GET_ALL_ACTIVITIES, activityLogDto)
      );
    } catch (error) {
      console.error('Gateway getAllActivityLog error:', error);
      throw error;
    }
  }
  @Get('/get-most-visited-api')
  async getMostVisitedApi() {
    try {
      return await firstValueFrom(
        this.activityLogClient.send(GET_MOST_VISITED_API, {})
      );
    } catch (error) {
      console.error('Gateway getMostVisitedApi error:', error);
      throw error;
    }
  }
  @Get('/get-most-visited-user')
  async getMostVisitedUser() {
    try {
      return await firstValueFrom(
        this.activityLogClient.send(GET_MOST_VISITED_USER, {})
      );
    } catch (error) {
      console.error('Gateway getMostVisitedUser error:', error);
      throw error;
    }
  }
}
