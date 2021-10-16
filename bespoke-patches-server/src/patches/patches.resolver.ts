import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UploadPatchInput } from 'src/graphql';
import { PatchesService } from './patches.service';

@Resolver()
export class PatchesResolver {
  constructor(private service: PatchesService) {}

  @Query()
  async patch(@Args('uuid') uuid: number) {
    return null;
  }

  @Mutation()
  async uploadPatch(@Args('patch') uploadInfo: UploadPatchInput) {
    console.log(uploadInfo);
  }
}
