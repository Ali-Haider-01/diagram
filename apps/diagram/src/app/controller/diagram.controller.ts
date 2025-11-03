import { Controller } from '@nestjs/common';
import { DiagramService } from '../services/diagram.service';
import {
  CreateDiagramDto,
  GetDiagramDto,
  IdDto,
  MESSAGE_PATTERNS,
  UpdateDiagramDto,
} from '@diagram/shared';
import { MessagePattern, Payload } from '@nestjs/microservices';

const {
  CREATE_DIAGRAM,
  GET_DIAGRAM,
  GET_BY_ID_DIAGRAM,
  UPDATE_DIAGRAM,
  DELETE_DIAGRAM,
  IMPORT_SLUGS_DIAGRAM,
} = MESSAGE_PATTERNS.DIAGRAMS;

@Controller()
export class DiagramController {
   constructor(private readonly diagramsService: DiagramService) {}

 @MessagePattern(CREATE_DIAGRAM)
  createDiagram(
    @Payload() payload: { createDiagramDto: CreateDiagramDto; activeUser: any }
  ) {
    return this.diagramsService.create({
      createDiagramDto: payload.createDiagramDto,
      activeUser: payload.activeUser,
    });
  }

  @MessagePattern(GET_DIAGRAM)
  getDiagrams(@Payload() getDiagramsDto: GetDiagramDto) {
    return this.diagramsService.findAll(getDiagramsDto);
  }

  @MessagePattern(GET_BY_ID_DIAGRAM)
  getDiagramById(@Payload() payload: IdDto) {
    return this.diagramsService.findOne(payload);
  }

  @MessagePattern(UPDATE_DIAGRAM)
  updateDiagram(
    @Payload() data: { payload: IdDto; updateDiagramDto: UpdateDiagramDto }
  ) {
    return this.diagramsService.update(data.payload, data.updateDiagramDto);
  }

  @MessagePattern(DELETE_DIAGRAM)
  deleteDiagram(@Payload() payload: any) {
    return this.diagramsService.remove(payload);
  }

  @MessagePattern(IMPORT_SLUGS_DIAGRAM)
  importSlugsInDiagram(@Payload() data: { payload: IdDto; body: any }) {
    return this.diagramsService.importSlugs(data.payload, data.body);
  }
}
