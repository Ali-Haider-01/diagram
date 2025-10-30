import { Injectable } from '@nestjs/common';

@Injectable()
export class DiagramService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
