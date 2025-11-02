import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
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
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SERVICES, MESSAGE_PATTERNS } from '@diagram/shared';
import { AppRequest, DeleteResponseDto, IdDto } from '@diagram/shared';

const {
  CREATE_DIAGRAM,
  GET_DIAGRAM,
  GET_BY_ID_DIAGRAM,
  UPDATE_DIAGRAM,
  DELETE_DIAGRAM,
  IMPORT_SLUGS_DIAGRAM,
} = MESSAGE_PATTERNS.DIAGRAMS;

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
   * @returns
   */
  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiCreatedResponse({ type: CreateDiagramRequestResponse })
  async create(
    @Body() createDiagramDto: CreateDiagramDto,
    @Req() req: AppRequest,
    @UploadedFile() logoImage?: any
  ) {
    createDiagramDto.logoImage = logoImage;
    const result = await firstValueFrom(
      this.diagramsServiceClient.send(CREATE_DIAGRAM, {
        createDiagramDto,
        chatUser: req?.chatUser,
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
    @UploadedFile() logoImage?: any,
    @Req() req?: AppRequest
  ) {
    updateDiagramDto.logoImage = logoImage;
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
  async deleteDiagram(@Param() payload: IdDto, @Req() req: AppRequest) {
    // First, get the diagram data before deleting it
    const diagramData = await firstValueFrom(
      this.diagramsServiceClient.send(GET_BY_ID_DIAGRAM, payload)
    );

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
