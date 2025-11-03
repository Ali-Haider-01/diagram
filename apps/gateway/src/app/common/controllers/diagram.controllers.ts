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
  ImportFileInterceptor,
  UpdateDiagramDto,
  UpdateDiagramRequestResponse,
} from '@diagram/shared';
import {
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
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

  /**
   * Create diagram
   * @param createDiagramDto
   * @param req
   * @returns
   */

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

  /**
   * Get all diagrams
   * @param getDiagramDto
   * @returns
   */
  @Get()
  @ApiCreatedResponse({ type: GetDiagramRequestResponse })
  async findAll(@Query() getDiagramDto: GetDiagramDto) {
    return await firstValueFrom(
      this.diagramsServiceClient.send(GET_DIAGRAM, getDiagramDto)
    );
  }

  /**
   * Get diagrams by id
   * @param payload
   * @returns
   */
  @Get('/:id')
  @ApiCreatedResponse({ type: GetDiagramByIdRequestResponse })
  async findSingleDiagram(@Param() payload: IdDto) {
    return await firstValueFrom(
      this.diagramsServiceClient.send(GET_BY_ID_DIAGRAM, payload)
    );
  }

  /**
   * Update diagram by id
   * @param payload
   * @param updateDiagramDto
   * @returns
   */
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

  /**
   * Delete diagram by id
   * @param payload
   * @returns
   */
  @Delete('/:id')
  @ApiCreatedResponse({ type: DeleteResponseDto })
  async deleteDiagram(@Param() payload: IdDto) {

    // Then delete the diagram
    const result = await firstValueFrom(
      this.diagramsServiceClient.send(DELETE_DIAGRAM, payload)
    );
    return result;
  }

  /**
   * Import slugs in diagram
   * @param payload
   * @param body
   * @returns
   */
  @Patch('/import-slugs/:id')
  @UseInterceptors(FileInterceptor('file'), ImportFileInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async importSlugsInDiagram(@Param() payload: IdDto, @Body() body) {
    return await lastValueFrom(
      this.diagramsServiceClient.send(IMPORT_SLUGS_DIAGRAM, {
        payload,
        body: body.parsedData,
      })
    );
  }
}
