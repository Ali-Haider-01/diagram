import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ActivityLogRepository } from '@diagram/shared';

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ActivityLogInterceptor.name);

  constructor(
    private readonly activityLogRepository: ActivityLogRepository
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    const { method, url, body, query, user, ip, headers } = request;

    // Extract IP address (considering proxy headers)
    const ipAddress =
      headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      headers['x-real-ip'] ||
      ip ||
      request.connection?.remoteAddress ||
      '';

    // Sanitize request body to avoid logging sensitive data
    const sanitizedBody = this.sanitizeRequestBody(body);

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - startTime;
        this.logActivity(
          {
            method,
            url,
            statusCode: response.statusCode,
            userId: user?.userId,
            userEmail: user?.email,
            ipAddress,
            requestBody: sanitizedBody,
            queryParams: query,
            responseTime,
          },
          null
        );
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        this.logActivity(
          {
            method,
            url,
            statusCode: error.status || response.statusCode || 500,
            userId: user?.userId,
            userEmail: user?.email,
            ipAddress,
            requestBody: sanitizedBody,
            queryParams: query,
            responseTime,
            errorMessage: error.message,
          },
          error
        );
        return throwError(() => error);
      })
    );
  }

  private async logActivity(activityData: any, error: any): Promise<void> {
    try {
      await this.activityLogRepository.create(activityData);
    } catch (err) {
      // Log error but don't fail the request
      this.logger.error(
        `Failed to log activity: ${err.message}`,
        err.stack
      );
    }
  }

  private sanitizeRequestBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = ['password', 'oldPassword', 'newPassword', 'token', 'refreshToken', 'accessToken'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }
}

