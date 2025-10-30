import {
  BadRequestException,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
  SaveOptions,
  Connection,
  ProjectionType,
  PipelineStage,
  AggregateOptions,
  QueryOptions,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import * as pluralize from 'pluralize';
import { AbstractSchema } from '../schema';


export function toSentenceCase(input: string): string {
  const result = input?.replace(/([A-Z])/g, ' $1');
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

export type NestedKeys<T> = {
  [K in keyof T]?: T[K] extends Record<string, any> ? NestedKeys<T[K]> : 1 | 0;
};

export abstract class AbstractRepository<TDocument extends AbstractSchema> {
  protected abstract readonly logger: Logger;
  private friendlyName: string;
  private singleName: string;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection
  ) {
    this.friendlyName = this.model.collection.name.replace(
      /[^a-zA-Z0-9]+(.)/g,
      (_, chr) => chr.toUpperCase()
    );
    this.singleName = pluralize.singular(
      toSentenceCase(
        this.friendlyName.replace(/([A-Z]+)*([A-Z][a-z])/g, '$1 $2')
      )
    );
  }

  async create(document: TDocument, options?: SaveOptions): Promise<TDocument> {
    try {
      const createdDocument = new this.model({
        ...(!document._id && { _id: new Types.ObjectId() }),
        ...document,
      });
      return (
        await createdDocument.save(options)
      ).toJSON() as unknown as TDocument;
    } catch (err: any) {
      if (err.message.includes('duplicate')) {
        throw new ConflictException(`${this.singleName} already exists.`);
      }
      throw new BadRequestException(
        `Invalid ${this.singleName.toLowerCase()} data entered, ${err.message}`
      );
    }
  }

  async createMany(
    documents: Omit<TDocument, '_id'>[],
    options?: any
  ): Promise<TDocument[]> {
    try {
      const insertedDocuments = await this.model.insertMany(documents, options);
      return insertedDocuments as unknown as TDocument[];
    } catch (err: any) {
      throw new BadRequestException(
        `Invalid ${this.singleName.toLowerCase()} data entered, ${err.message}`
      );
    }
  }

  async delete(filterQuery?: FilterQuery<TDocument>): Promise<TDocument[]> {
    try {
      const deletedDocument = await Promise.resolve(
        this.model.deleteOne(filterQuery || {})
      );
      if (deletedDocument.deletedCount === 0) {
        throw new NotFoundException(`${this.singleName} not found.`);
      }
      return deletedDocument as any;
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException(
        `Invalid ${this.singleName.toLowerCase()} data entered.`
      );
    }
  }

  async deleteMany(
    filterQuery: FilterQuery<TDocument>,
    ids?: string[],
    column: string = '_id'
  ): Promise<any> {
    try {
      filterQuery = filterQuery || {};
      const query = {
        ...filterQuery,
        ...(ids && column && { [column]: { $in: ids } }),
      };
      const deletedDocument = await Promise.resolve(
        this.model.deleteMany(query)
      );
      if (deletedDocument.deletedCount === 0) {
        this.logger.warn(
          `${this.singleName} not found with filterQuery`,
          filterQuery
        );
        throw new NotFoundException(`${this.singleName} not found.`);
      }
      return deletedDocument as any;
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException(
        `Error ${this.friendlyName.toLowerCase()}, ${err.message}.`
      );
    }
  }

  async deleteManyWithoutException(
    filterQuery: FilterQuery<TDocument>,
    ids?: string[],
    column: string = '_id'
  ): Promise<any> {
    try {
      filterQuery = filterQuery || {};
      const query = {
        ...filterQuery,
        ...(ids && column && { [column]: { $in: ids } }),
      };
      const deletedDocument = await Promise.resolve(
        this.model.deleteMany(query)
      );
      return deletedDocument as any;
    } catch (err: any) {
      throw new BadRequestException(
        `Error ${this.friendlyName.toLowerCase()}, ${err.message}.`
      );
    }
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>
  ): Promise<TDocument> {
    const document = await Promise.resolve(
      this.model.findOneAndDelete(filterQuery, {})
    );
    if (!document) {
      this.logger.warn(
        `${this.singleName} not found with filterQuery`,
        filterQuery
      );
      throw new NotFoundException(`${this.singleName} not found.`);
    }
    return document as unknown as TDocument;
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
    projection?: ProjectionType<TDocument>,
    options:
      | QueryOptions<TDocument>
      | { notFoundThrowError: string | boolean } = {
      notFoundThrowError: true,
    }
  ): Promise<TDocument> {
    const { notFoundThrowError, ...remainingOptions } = options;
    const document = await Promise.resolve(
      this.model.findOne(
        filterQuery,
        projection || {},
        remainingOptions || { lean: true }
      )
    );

    if (!document && notFoundThrowError) {
      this.logger.warn(
        `${this.singleName} not found with filterQuery`,
        filterQuery
      );
      throw new NotFoundException(
        typeof options?.notFoundThrowError == 'string'
          ? options?.notFoundThrowError
          : `${this.singleName} not found.`
      );
    }

    return document?.toObject() as unknown as TDocument;
  }

  async findOneWithoutException(
    filterQuery: FilterQuery<TDocument>,
    projection?: ProjectionType<TDocument>,
    options?: {}
  ): Promise<TDocument> {
    const document = await Promise.resolve(
      this.model.findOne(
        filterQuery,
        projection || {},
        options || { lean: true }
      )
    );

    if (!document) {
      this.logger.warn(
        `${this.singleName} not found with filterQuery`,
        filterQuery
      );
      return null as unknown as TDocument;
    }

    return document;
  }

  async updateMany(
    filterQuery: FilterQuery<TDocument>,
    updates?: UpdateQuery<TDocument> | UpdateWithAggregationPipeline,
    options?: {}
  ): Promise<any> {
    try {
      return await Promise.resolve(
        this.model.updateMany(filterQuery, updates || {}, options || {})
      );
    } catch (err: any) {
      if (err.message.includes('duplicate')) {
        throw new ConflictException(`${this.singleName} already exists.`);
      }
    }
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    options:
      | QueryOptions<TDocument>
      | { notFoundThrowError: string | boolean } = {
      notFoundThrowError: true,
    }
  ) {
    try {
      const document = await Promise.resolve(
        this.model.findOneAndUpdate(filterQuery, update, {
          lean: true,
          new: true,
          ...options,
        })
      );

      if (!document && options.notFoundThrowError) {
        this.logger.warn(
          `${this.singleName} not found with filterQuery`,
          filterQuery
        );
        throw new NotFoundException(
          typeof options?.notFoundThrowError == 'string'
            ? options?.notFoundThrowError
            : `${this.singleName} not found.`
        );
      }
      return document;
    } catch (err: any) {
      console.log(err);
      if (err.message.includes('duplicate')) {
        throw new ConflictException(`${this.singleName} already exists.`);
      }
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException(
        `Invalid ${this.singleName.toLowerCase()} data entered.`
      );
    }
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>
  ): Promise<any> {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });
  }

  async findOneAndUpdateToday(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    options: QueryOptions<TDocument> = {}
  ): Promise<any> {
    try {
      // First, find the existing document
      const existingDocument = await this.model.findOne(
        filterQuery,
        {},
        { lean: true }
      );

      if (!existingDocument) {
        // If no document exists, create a new one
        return this.model.findOneAndUpdate(filterQuery, update, {
          lean: true,
          upsert: true,
          new: true,
          ...options,
        });
      }

      // Check if the document was created within the last 24 hours
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Check if createdAt is within 24 hours
      const createdAt = (existingDocument as any).createdAt;
      const isWithin24Hours =
        createdAt && new Date(createdAt) > twentyFourHoursAgo;

      if (isWithin24Hours) {
        // Update existing document if it's within 24 hours
        return this.model.findOneAndUpdate(filterQuery, update, {
          lean: true,
          new: true,
          ...options,
        });
      } else {
        // Create new document if it's older than 24 hours
        const newDocument = {
          ...update,
          _id: new Types.ObjectId(),
          createdAt: now,
          updatedAt: now,
        };

        return this.model.findOneAndUpdate(
          { _id: new Types.ObjectId() }, // Use a new ObjectId to ensure new document
          newDocument,
          {
            lean: true,
            upsert: true,
            new: true,
            ...options,
          }
        );
      }
    } catch (err: any) {
      if (err.message.includes('duplicate')) {
        throw new ConflictException(`${this.singleName} already exists.`);
      }
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException(
        `Invalid ${this.singleName.toLowerCase()} data entered.`
      );
    }
  }

  async find(
    filterQuery?: FilterQuery<TDocument>,
    projection?: ProjectionType<TDocument>,
    options?: QueryOptions<TDocument>
  ) {
    return this.model.find(
      filterQuery || {},
      projection || {},
      options || { lean: true }
    );
  }

  async distinct(field: string, filterQuery?: FilterQuery<TDocument>) {
    return this.model.distinct(field, filterQuery || {});
  }

  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }

  async aggregate(pipeline?: PipelineStage[], options?: AggregateOptions) {
    return await Promise.resolve(this.model.aggregate(pipeline, options));
  }

  async count(filterQuery?: FilterQuery<TDocument>) {
    return await Promise.resolve(this.model.countDocuments(filterQuery));
  }

  async getDetails() {
    return await this.model.db.asPromise();
  }

  async paginate({
    filterQuery = {},
    search = '',
    searchMethod = 'or',
    searchBy,
    limit = 10,
    offset = 0,
    returnKey,
    sort,
    pipelines = [],
    bottomPipelines = [],
    projection,
    all = true,
    searchByCustom,
  }: {
    filterQuery?: FilterQuery<TDocument>;
    search?: string;
    searchMethod?: 'or' | 'and';
    searchBy?: NestedKeys<Omit<TDocument, '_id'>>;
    limit?: number;
    offset?: number;
    returnKey?: string;
    sort?: Object;
    projection?: ProjectionType<TDocument>;
    pipelines?: any[];
    bottomPipelines?: PipelineStage[];
    all?: boolean;
    searchByCustom?: Record<string, 1>;
  }): Promise<{
    [x: string]: any;
    meta?: { page: any; pages: any; limit: number; total: any };
  }> {
    try {
      let searchFilter: any[] | undefined;
      let searchByArray: string[];

      if (search.length) {
        searchFilter = [];
        const { _id, ...fieldsObject } = this.model.schema.paths;
        searchByArray = this.getKeysWithValue(
          searchBy || searchByCustom
            ? { ...searchBy, ...searchByCustom }
            : fieldsObject,
          1
        );
        searchByArray.forEach((field) => {
          searchFilter!.push({
            [field]: {
              $regex: `.*${search.toLowerCase().split(' ').join('|')}.*`,
              $options: 'i',
            },
          });
        });
      }

      offset = +offset;
      limit = +limit;

      const query = [
        ...pipelines,
        {
          $match: {
            ...filterQuery,
            ...(searchFilter &&
              Object.keys(searchFilter).length &&
              (searchMethod == 'or'
                ? {
                    $and: [
                      {
                        $or: searchFilter,
                      },
                    ],
                  }
                : searchFilter.reduce(function (andFilter, singleFilter) {
                    andFilter = { ...andFilter, ...singleFilter };
                    return andFilter;
                  }, {}))),
          },
        },
        ...bottomPipelines,
        {
          $sort: {
            ...sort,
            createdAt: -1,
          },
        },
        {
          $facet: {
            total: [
              {
                $sortByCount: '$tag',
              },
            ],
            data: [
              ...(!all
                ? [
                    {
                      $skip: offset,
                    },
                    {
                      $limit: limit ?? '$total.count',
                    },
                  ]
                : []),
              {
                $addFields: {
                  _id: '$_id',
                },
              },
              ...(projection
                ? [
                    {
                      $project: projection,
                    },
                  ]
                : []),
            ],
          },
        },
        {
          $unwind: '$total',
        },
        {
          $project: {
            collections: '$data',
            total: '$total.count',
            ...(!all && {
              page: {
                $ceil: { $literal: offset / limit + 1 },
              },
              pages: {
                $ceil: {
                  $divide: ['$total.count', limit],
                },
              },
            }),
          },
        },
      ];

      const [data] = await this.model.aggregate<any>(query);

      const response: any = {
        [!returnKey
          ? `${this.friendlyName[0].toLowerCase() + this.friendlyName.slice(1)}`
          : returnKey]: data?.collections || [],
      };

      // only attach meta if not "all"
      if (!all) {
        response.meta = {
          page: data?.page,
          pages: data?.pages,
          limit,
          total: data?.total ?? 0,
        };
      }

      return response;
    } catch (err: any) {
      this.logger.error(`Pipeline Failure - ${err.message}`);
      const response: any = {
        [!returnKey
          ? `${this.friendlyName[0].toLowerCase() + this.friendlyName.slice(1)}`
          : returnKey]: [],
      };

      if (!all) {
        response.meta = {
          page: 0,
          pages: 0,
          limit,
          total: 0,
        };
      }

      return response;
    }
  }

  private getKeysWithValue(obj: object, value: number): string[] {
    const keys: string[] = [];

    function traverse(o: Record<string, any>, path?: string) {
      for (const key in o) {
        const currentPath = path ? `${path}.${key}` : key;
        if (o[key] === value && ['number', 'string'].includes(typeof o[key])) {
          keys.push(currentPath);
        }
        if (typeof o[key] === 'object') {
          traverse(o[key], currentPath);
        }
      }
    }

    traverse(obj);
    return keys;
  }

  async bulkWrite(operations: any[], options?: any): Promise<any> {
    try {
      return await this.model.bulkWrite(operations, options);
    } catch (err: any) {
      throw new BadRequestException(
        `Bulk write operation failed for ${this.singleName.toLowerCase()}, ${
          err.message
        }`
      );
    }
  }
}
