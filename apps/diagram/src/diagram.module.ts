import { Module } from '@nestjs/common';
import { DiagramController } from './app/diagram.controller';
import { DiagramService } from './app/diagram.service';

@Module({
  imports: [],
  controllers: [DiagramController],
  providers: [DiagramService],
})
export class DiagramModule {}
