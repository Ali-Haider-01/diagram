import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Diagram } from '../schema';
import { AbstractRepository } from '../common/abstract';

@Injectable()
export class DiagramRepository extends AbstractRepository<Diagram> {
  protected readonly logger = new Logger(DiagramRepository.name);
  constructor(
    @InjectModel(Diagram.name) DiagramsModule: Model<Diagram>,
    @InjectConnection() connection: Connection,
  ) {
    super(DiagramsModule, connection);
  }
}