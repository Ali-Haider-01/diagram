import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import * as csv from 'csv-parse/sync';
  import * as XLSX from 'xlsx';
  
  @Injectable()
  export class ImportFileInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
  
      if (!request.file || !request.file.buffer) {
        throw new BadRequestException('No file uploaded.');
      }
  
      const { originalname, mimetype, buffer } = request.file;
      const extension = originalname.split('.').pop()?.toLowerCase();
  
      let parsedData: any[];
  
      try {
        if (mimetype === 'text/csv' || extension === 'csv') {
          parsedData = csv.parse(buffer.toString('utf8'), {
            columns: true,
            skip_empty_lines: true,
            trim: true,
          });
        } else if (
          mimetype ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          mimetype === 'application/vnd.ms-excel' ||
          extension === 'xls' ||
          extension === 'xlsx'
        ) {
          const workbook = XLSX.read(buffer, { type: 'buffer' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          parsedData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        } else {
          throw new BadRequestException('Unsupported file type.');
        }
  
        if (!Array.isArray(parsedData) || parsedData.length === 0) {
          throw new BadRequestException('No data found in the file.');
        }
  
        request.body.parsedData = parsedData;
      } catch (error: any) {
        throw new BadRequestException(
          `Failed to parse file: ${error.message || error}`,
        );
      }
  
      return next.handle();
    }
  }
  