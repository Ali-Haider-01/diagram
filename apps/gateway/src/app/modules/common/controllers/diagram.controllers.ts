import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import {
  CreateDiagramDto,
  CreateDiagramRequestResponse,
  GetDiagramByIdRequestResponse,
  GetDiagramDto,
  GetDiagramRequestResponse,
  ImportSlugsDto,
  ImportSlugsRequestResponse,
  UpdateDiagramDto,
  UpdateDiagramRequestResponse,
} from '@diagram/shared';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SERVICES, MESSAGE_PATTERNS, Auth } from '@diagram/shared';
import { DeleteResponseDto, IdDto } from '@diagram/shared';

const {
  CREATE_DIAGRAM,
  GET_DIAGRAM,
  GET_BY_ID_DIAGRAM,
  UPDATE_DIAGRAM,
  DELETE_DIAGRAM,
  IMPORT_SLUGS_DIAGRAM,
} = MESSAGE_PATTERNS.DIAGRAMS;

@ApiBearerAuth()
@Auth()
@Controller('diagrams')
@ApiTags('Diagrams')
export class DiagramController {
  constructor(
    @Inject(SERVICES.DIAGRAM)
    private diagramsServiceClient: ClientRMQ,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: CreateDiagramRequestResponse })
  async create(
    @Body() createDiagramDto: CreateDiagramDto,
    @Req() req,
  ) {
    const result = await firstValueFrom(
      this.diagramsServiceClient.send(CREATE_DIAGRAM, {
        createDiagramDto,
        activeUser: req.user,
      })
    );

    return result;
  }

  @Get()
  @ApiCreatedResponse({ type: GetDiagramRequestResponse })
  async findAll(@Query() getDiagramDto: GetDiagramDto) {
    return await firstValueFrom(
      this.diagramsServiceClient.send(GET_DIAGRAM, getDiagramDto)
    );
  }

  @Get('/:id')
  @ApiCreatedResponse({ type: GetDiagramByIdRequestResponse })
  async findSingleDiagram(@Param() payload: IdDto) {
    return await firstValueFrom(
      this.diagramsServiceClient.send(GET_BY_ID_DIAGRAM, payload)
    );
  }

  @Patch('/:id')
  @ApiCreatedResponse({ type: UpdateDiagramRequestResponse })
  async updateDiagram(
    @Param() payload: IdDto,
    @Body() updateDiagramDto: UpdateDiagramDto,
  ) {
    const result = await lastValueFrom(
      this.diagramsServiceClient.send(UPDATE_DIAGRAM, {
        payload,
        updateDiagramDto,
      })
    );

    return result;
  }

  @Delete('/:id')
  @ApiCreatedResponse({ type: DeleteResponseDto })
  async deleteDiagram(@Param() payload: IdDto) {

    // Then delete the diagram
    const result = await firstValueFrom(
      this.diagramsServiceClient.send(DELETE_DIAGRAM, payload)
    );
    return result;
  }

  @Patch('/import-slugs/:id')
  @ApiCreatedResponse({ type: ImportSlugsRequestResponse })
  async importSlugsInDiagram(@Param() payload: IdDto, @Body() body: ImportSlugsDto) {
    return await lastValueFrom(
      this.diagramsServiceClient.send(IMPORT_SLUGS_DIAGRAM, {
        payload,
        body,
      })
    );
  }
}
