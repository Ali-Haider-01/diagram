import { Controller, Get } from '@nestjs/common';
import { DiagramService } from './diagram.service';

@Controller()
export class DiagramController {
  constructor(private readonly diagramService: DiagramService) {}

  @Get()
  getData() {
    return this.diagramService.getData();
  }
}
