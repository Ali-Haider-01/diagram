import { HttpException } from '@nestjs/common';

export const ResponseMessage = {
  SUCCESS: 'Success',
  BAD_REQUEST: 'Bad Request',
  CREATED: 'Created',
  NOT_FOUND: 'Record Not Found',
  INTERNAL_SERVER_ERROR: 'Something Went Wrong',
  INVALID_FILE: 'Invalid file provided',
  ALREADY_EXISTS: 'Record already exists',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
};

export const INTERNAL_SERVER_RESPONSE = {
  statusCode: 500,
  message: 'Internal server error',
};

export const errorResponse = (
  statusCode: number = 500,
  message: string = 'Internal Server Error',
  error: any = []
) => {
  throw new HttpException(
    {
      statusCode,
      message,
      errors: error,
      data: null,
    },
    statusCode
  );
};

export const successResponse = (
  statusCode: number = 200,
  message: string = 'Success',
  data: any = {},
  pagination?: {
    count: number;
    page: number;
    limit: number;
  }
) => {
  if (pagination) {
    const { count, page, limit } = pagination;
    return {
      statusCode,
      message,
      data,
      count: count,
      pagination:
        Array.isArray(data) && count && limit
          ? {
              page,
              limit,
              totalPages: Math.ceil(count / limit),
              resultCount: data.length,
              totalResult: count,
            }
          : null,
      error: null,
    };
  } else {
    return {
      statusCode,
      message,
      data,
      error: null,
    };
  }
};
