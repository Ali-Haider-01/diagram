import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ImportSlugsDto,
  CreateDiagramDto,
  IdDto,
  toMongoObjectId,
} from '@diagram/shared';
import { DiagramRepository } from '@diagram/shared';
import {
  errorResponse,
  successResponse,
  ResponseMessage,
} from '@diagram/shared';
import { buildDateRangeFilter } from '@diagram/shared';

function getDiagramLookup() {
  return [
    {
      $lookup: {
        from: 'users',
        let: { createdByStr: '$createdBy' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$_id', '$$createdByStr'] },
                  { $eq: [{ $toString: '$_id' }, '$$createdByStr'] },
                ],
              },
            },
          },
        ],
        as: 'createdBy',
      },
    },
    {
      $unwind: {
        path: '$createdBy',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        slugs: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        shortCode: 1,
        url: 1,
        'createdBy._id': 1,
        'createdBy.name': 1,
        'createdBy.email': 1,
        'createdBy.phoneNumber': 1,
      },
    },
  ];
}

@Injectable()
export class DiagramService {
  constructor(
    private diagramRepository: DiagramRepository,
  ) {}

  private async validateDiagramInput({
    name,
    slugs,
    url,
    shortCode,
  }: {
    name?: string;
    slugs?: string[];
    url?: string;
    shortCode?: string;
    excludeDiagramId?: string;
  }): Promise<null | { status: number; message: string }> {
    if (slugs && new Set(slugs).size !== slugs.length) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Slugs must be unique within the diagram.',
      };
    }

    const orConditions: any[] = [];

    if (name) {
      orConditions.push({ name });
    }
    if (url) {
      orConditions.push({ url });
    }
    if (shortCode) {
      orConditions.push({ shortCode });
    }
    if (orConditions.length === 0) {
      return null;
    }
    const query: any = { $or: orConditions };

    const existing = await this.diagramRepository.findOne(query, undefined, {
      notFoundThrowError: false,
    });

    if (existing) {
      if (name && existing.name === name) {
        return {
          status: HttpStatus.FORBIDDEN,
          message: 'Diagram name already exists.',
        };
      }
      if (url && existing.url === url) {
        return {
          status: HttpStatus.FORBIDDEN,
          message: 'URL already exists.',
        };
      }
      if (shortCode && existing.shortCode === shortCode) {
        return {
          status: HttpStatus.FORBIDDEN,
          message: 'Short code already exists.',
        };
      }
    }

    return null;
  }

  async create({
    createDiagramDto,
    activeUser,
  }: {
    createDiagramDto: CreateDiagramDto;
    activeUser: any;
  }) {
    try {
      if (!activeUser || !activeUser.userId) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'User authentication required',
          errors: null,
          data: null,
        };
      }

      const { name, slugs, url, shortCode } = createDiagramDto;

      const validationError = await this.validateDiagramInput({
        name,
        slugs,
        url,
        shortCode,
      });

      if (validationError) {
        return {
          statusCode: validationError.status,
          message: validationError.message,
          errors: null,
          data: null,
        };
      }
      const diagram = await this.diagramRepository.create({
        ...createDiagramDto,
        createdBy: activeUser.userId,
      });
      return successResponse(HttpStatus.OK, ResponseMessage.SUCCESS, diagram);
    } catch (err: any) {
      // Log the error for debugging
      console.error('Error creating diagram:', err);
      
      const statusCode = err.status || err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err.message || ResponseMessage.INTERNAL_SERVER_ERROR;
      const errors = err.errors || err.response?.errors || null;
      
      // For microservices, return error object instead of throwing
      return {
        statusCode,
        message,
        errors,
        data: null,
      };
    }
  }

  async findAll(getDiagramDto) {
    const { search, offset, limit, startDate, endDate, meta, userId } = getDiagramDto;
    const filterQuery = {};

    if (search) {
      filterQuery['name'] = { $regex: search, $options: 'i' };
    }

    const createdAtRange = buildDateRangeFilter(startDate, endDate);
    if (createdAtRange) filterQuery['createdAt'] = createdAtRange;

    if (userId) {
      filterQuery['createdBy'] = userId;
    }

    try {
      const diagrams = await this.diagramRepository.paginate({
        offset,
        limit,
        filterQuery,
        pipelines: getDiagramLookup(),
        all: !meta,
      });
      return successResponse(HttpStatus.OK, ResponseMessage.SUCCESS, diagrams);
    } catch (err: any) {
      return errorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseMessage.INTERNAL_SERVER_ERROR,
        err.message
      );
    }
  }

  async findOne(payload) {
    const mongoId = toMongoObjectId({ value: payload.id, key: 'id' });
    if (!mongoId) {
      throw new BadRequestException('Invalid Diagram ID format');
    }
    const pipeline = [{ $match: { _id: mongoId } }, ...getDiagramLookup()];
    try {
      const [res] = await this.diagramRepository.aggregate(pipeline);
      return successResponse(HttpStatus.OK, ResponseMessage.SUCCESS, res);
    } catch (err: any) {
      return errorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseMessage.INTERNAL_SERVER_ERROR,
        err.message
      );
    }
  }

  async update(payload, updateDiagramDto) {
    try {
      const validationError = await this.validateDiagramInput({
        name: updateDiagramDto.name,
        slugs: updateDiagramDto.slugs,
        url: updateDiagramDto.url,
        shortCode: updateDiagramDto.shortCode,
        excludeDiagramId: payload.id,
      });

      if (validationError) {
        return errorResponse(validationError.status, validationError.message);
      }
      const updatedDiagram = await this.diagramRepository.findOneAndUpdate(
        { _id: payload.id },
        updateDiagramDto
      );
      return successResponse(
        HttpStatus.OK,
        ResponseMessage.SUCCESS,
        updatedDiagram
      );
    } catch (err: any) {
      return errorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseMessage.INTERNAL_SERVER_ERROR,
        err.message
      );
    }
  }

  async remove(payload) {
    try {
      const res = await this.diagramRepository.delete({ _id: payload.id });
      return successResponse(HttpStatus.OK, ResponseMessage.SUCCESS, res);
    } catch (err: any) {
      return errorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseMessage.INTERNAL_SERVER_ERROR,
        err.message
      );
    }
  }

  async importSlugs(payload: IdDto, fileData: ImportSlugsDto[]) {
    try {
      if (!fileData || !fileData.length) {
        return errorResponse(
          HttpStatus.BAD_REQUEST,
          ResponseMessage.BAD_REQUEST,
          'No data to import'
        );
      }
      const slugs = fileData.map((item: any) => item.slugs).filter(Boolean);
      if (slugs.length === 0) {
        return errorResponse(
          HttpStatus.BAD_REQUEST,
          ResponseMessage.BAD_REQUEST,
          'No valid slugs found'
        );
      }
      if (new Set(slugs).size !== slugs.length) {
        return errorResponse(
          HttpStatus.BAD_REQUEST,
          'Imported slugs must be unique within the diagram.'
        );
      }

      const diagram = await this.diagramRepository.findOneAndUpdate(
        { _id: payload.id },
        { slugs }
      );

      if (!diagram) {
        return errorResponse(
          HttpStatus.NOT_FOUND,
          ResponseMessage.NOT_FOUND,
          'Diagram not found'
        );
      }

      return successResponse(HttpStatus.OK, ResponseMessage.SUCCESS, {
        diagram,
      });
    } catch (err: any) {
      return errorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseMessage.INTERNAL_SERVER_ERROR,
        err.message
      );
    }
  }
}
