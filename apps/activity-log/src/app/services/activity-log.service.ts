import {
  ActivityLogDto,
  ActivityLogRepository,
  buildDateRangeFilter,
  errorResponse,
  ResponseMessage,
  successResponse,
} from '@diagram/shared';
import { HttpStatus, Injectable } from '@nestjs/common';

function getActivityLogLookup() {
  return [
    {
      $project: {
        _id: 1,
        method: 1,
        url: 1,
        statusCode: 1,
        userId: 1,
        userEmail: 1,
        ipAddress: 1,
        requestBody: 1,
        queryParams: 1,
        responseTime: 1,
        errorMessage: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ];
}

@Injectable()
export class ActivityLogService {
  constructor(private readonly activityLogRepository: ActivityLogRepository) {}

  async getAllActivityLog(activityLogDto: ActivityLogDto): Promise<any> {
    const {
      method,
      statusCode,
      search,
      offset,
      limit,
      startDate,
      endDate,
      meta,
      url,
    } = activityLogDto;
    const filterQuery = {};

    if (search) {
      filterQuery['$or'] = [
        { method: { $regex: search, $options: 'i' } },
        { statusCode: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } },
      ];
    }

    const createdAtRange = buildDateRangeFilter(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
    if (createdAtRange) filterQuery['createdAt'] = createdAtRange;
    if (method) {
      filterQuery['method'] = method;
    }
    if (statusCode) {
      filterQuery['statusCode'] = statusCode;
    }
    if (url) {
      filterQuery['url'] = url;
    }
    try {
      const Logs = await this.activityLogRepository.paginate({
        offset,
        limit,
        filterQuery,
        pipelines: getActivityLogLookup(),
        all: !meta,
      });
      return successResponse(HttpStatus.OK, ResponseMessage.SUCCESS, Logs);
    } catch (err: any) {
      return errorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseMessage.INTERNAL_SERVER_ERROR,
        err.message
      );
    }
  }
}
