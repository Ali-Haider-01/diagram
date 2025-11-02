import { HttpStatus, Injectable } from '@nestjs/common';
import {
  ImportSlugsDto,
  CreateDiagramDto,
  IdDto,
} from '@diagram/shared';
import { DiagramRepository } from '@diagram/shared';
import {
  errorResponse,
  successResponse,
  ResponseMessage,
} from '@diagram/shared';
import { buildDateRangeFilter } from '@diagram/shared';
import { v4 } from 'uuid';

function getUserLookup() {
  return [
    {
      $unwind: {
        path: '$createdBy',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        diagramName: 1,
        slugs: 1,
        status: 1,
        logoImage: 1,
        createdAt: 1,
        updatedAt: 1,
        shortCode: 1,
        url: 1,
        'createdBy._id': 1,
        'createdBy.firstName': 1,
        'createdBy.lastName': 1,
        'createdBy.email': 1,
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
    diagramName,
    slugs,
    url,
    shortCode,
    excludeDiagramId,
  }: {
    diagramName?: string;
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

    if (diagramName) {
      orConditions.push({ diagramName });
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
    if (excludeDiagramId) {
      query._id = { $ne: excludeDiagramId };
    }

    const existing = await this.diagramRepository.findOne(query, undefined, {
      notFoundThrowError: false,
    });

    if (existing) {
      if (diagramName && existing.diagramName === diagramName) {
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

  /**
   * Create diagram
   * @param createDiagramDto
   * @param chatUser
   * @returns
   */
  async create({
    createDiagramDto,
    chatUser,
  }: {
    createDiagramDto: CreateDiagramDto;
    chatUser: any;
  }) {
    try {
      const { diagramName, slugs, url, shortCode } = createDiagramDto;

      const validationError = await this.validateDiagramInput({
        diagramName,
        slugs,
        url,
        shortCode,
      });

      if (validationError) {
        return errorResponse(validationError.status, validationError.message);
      }
      const diagram = await this.diagramRepository.create({
        ...createDiagramDto,
        createdBy: chatUser.userId,
        _id: v4(),
      });
      return successResponse(HttpStatus.OK, ResponseMessage.SUCCESS, diagram);
    } catch (err: any) {
      return errorResponse(
        err.status,
        err.message,
        err.errors
      );
    }
  }

  /**
   * Get all diagram
   * @param getDiagramDto
   * @returns
   */
  async findAll(getDiagramDto) {
    const { search, offset, limit, startDate, endDate, meta, userId } = getDiagramDto;
    const filterQuery = {};

    if (search) {
      filterQuery['diagramName'] = { $regex: search, $options: 'i' };
    }

    const createdAtRange = buildDateRangeFilter(startDate, endDate);
    if (createdAtRange) filterQuery['createdAt'] = createdAtRange;

    if (userId) {
      filterQuery['createdBy._id'] = userId;
    }

    try {
      const diagrams = await this.diagramRepository.paginate({
        offset,
        limit,
        filterQuery,
        pipelines: getUserLookup(),
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

  /**
   * Get single diagram
   * @param payload
   * @returns
   */
  async findOne(payload) {
    const { id } = payload;
    const pipeline = [{ $match: { _id: id } }, ...getUserLookup()];
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

  /**
   * Update diagram
   * @param payload
   * @param updateDiagramDto
   * @returns
   */
  async update(payload, updateDiagramDto) {
    try {
      const validationError = await this.validateDiagramInput({
        diagramName: updateDiagramDto.diagramName,
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

  /**
   * Remove diagram
   * @param payload
   * @returns
   */
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

  /**
   * Import slugs in diagram
   * @param payload
   * @param fileData
   * @returns
   */
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
