import {
  ActivityLogDto,
  ActivityLogRepository,
  buildDateRangeFilter,
  errorResponse,
  ResponseMessage,
  successResponse,
  GetMostVisitedApiDto,
  GetMostVisitedUserDto,
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

  async getMostVisitedApi(dto: GetMostVisitedApiDto): Promise<any> {
    const { startDate, endDate, limit = 10 } = dto;
    
    try {
      const filterQuery: any = {};
      
      // Apply date range filter if provided
      const createdAtRange = buildDateRangeFilter(
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      );
      if (createdAtRange) {
        filterQuery['createdAt'] = createdAtRange;
      }

      const pipeline: any[] = [
        // Match documents based on filter
        { $match: filterQuery },
        // Group by URL and method, count occurrences
        {
          $group: {
            _id: {
              url: '$url',
              method: '$method',
            },
            count: { $sum: 1 },
            // Get additional info from the first occurrence
            statusCode: { $first: '$statusCode' },
          },
        },
        // Sort by count descending
        { $sort: { count: -1 } },
        // Limit results
        { $limit: limit },
        // Reshape the output
        {
          $project: {
            _id: 0,
            url: '$_id.url',
            method: '$_id.method',
            count: 1,
            statusCode: 1,
          },
        },
      ];

      const results = await this.activityLogRepository.aggregate(pipeline);
      
      return successResponse(
        HttpStatus.OK,
        ResponseMessage.SUCCESS,
        results
      );
    } catch (err: any) {
      return errorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseMessage.INTERNAL_SERVER_ERROR,
        err.message
      );
    }
  }

  async getMostVisitedUser(dto: GetMostVisitedUserDto): Promise<any> {
    const { startDate, endDate, limit = 10 } = dto;
    
    try {
      const filterQuery: any = {};
      
      // Apply date range filter if provided
      const createdAtRange = buildDateRangeFilter(
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      );
      if (createdAtRange) {
        filterQuery['createdAt'] = createdAtRange;
      }

      // Only include documents with userId or userEmail
      filterQuery['$or'] = [
        { userId: { $exists: true, $ne: null } },
        { userEmail: { $exists: true, $ne: null } },
      ];

      const pipeline: any[] = [
        // Match documents based on filter
        { $match: filterQuery },
        // Add a computed field to identify user (prefer userId, fallback to userEmail)
        {
          $addFields: {
            userIdentifier: {
              $cond: {
                if: { $and: [{ $ne: ['$userId', null] }, { $ne: ['$userId', ''] }] },
                then: '$userId',
                else: '$userEmail',
              },
            },
          },
        },
        // Group by user identifier
        {
          $group: {
            _id: '$userIdentifier',
            count: { $sum: 1 },
            // Get additional info from the first occurrence
            userId: { $first: '$userId' },
            userEmail: { $first: '$userEmail' },
            ipAddress: { $first: '$ipAddress' },
          },
        },
        // Sort by count descending
        { $sort: { count: -1 } },
        // Limit results
        { $limit: limit },
        // Reshape the output
        {
          $project: {
            _id: 0,
            userId: 1,
            userEmail: 1,
            count: 1,
            ipAddress: 1,
          },
        },
      ];

      const results = await this.activityLogRepository.aggregate(pipeline);
      
      return successResponse(
        HttpStatus.OK,
        ResponseMessage.SUCCESS,
        results
      );
    } catch (err: any) {
      return errorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseMessage.INTERNAL_SERVER_ERROR,
        err.message
      );
    }
  }
}
