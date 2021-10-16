import { Injectable } from '@nestjs/common';
import { Patch } from 'src/graphql';

@Injectable()
export class PatchesService {
  public findByUuid(uuid: string): Patch | null {
    return null;
  }
}
