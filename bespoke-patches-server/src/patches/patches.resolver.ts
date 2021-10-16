import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Patch } from './patch.model';
import { PatchesService } from './patches.service';
import { UploadPatchInput } from './upload-patch.input';

@Resolver()
export class PatchesResolver {
  constructor(private service: PatchesService) {}

  @Query(() => Patch)
  async patch(@Args('uuid') uuid: string) {
    return null;
  }

  @Mutation(() => String)
  async uploadPatch(
    @Args('uploadInfo')
    uploadInfo: UploadPatchInput,
  ) {
    console.log(uploadInfo);
    return 'isOK';
  }
}
