import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ActionTokenService } from 'src/action-token/action-token.service';
import { Patch } from './patch.model';
import { PatchesService } from './patches.service';
import { UploadPatchInput } from './upload-patch.input';

@Resolver()
export class PatchesResolver {
  constructor(
    private service: PatchesService,
    private actionTokenService: ActionTokenService,
  ) {}

  @Query(() => Patch)
  async patch(@Args('uuid') uuid: string) {
    return null;
  }

  @Query(() => [Patch])
  async patches(
    @Args('tags', { defaultValue: [], type: () => [String] }) tags: string[],
    @Args('search', { defaultValue: null, type: () => String })
    search: string | null,
  ) {
    return this.service.find(tags, search);
  }

  @Mutation(() => String)
  async uploadPatch(
    @Args('uploadInfo')
    uploadInfo: UploadPatchInput,
    @Args('tokenUuid')
    tokenUuid: string,
  ) {
    if (!(await this.actionTokenService.get(tokenUuid)).enabled) {
      throw new Error('Token not enabled');
    }

    const patchToSave = new Patch();
    patchToSave.title = uploadInfo.title;
    patchToSave.author = uploadInfo.author;
    patchToSave.mail = uploadInfo.mail;
    patchToSave.tags = uploadInfo.tags;
    patchToSave.summary = uploadInfo.summary;
    patchToSave.description = uploadInfo.description;

    // TODO File Uploads
    patchToSave.bskFile = 'BSK';
    patchToSave.coverImage = 'COV';
    patchToSave.audioSamples = [];

    const patch = await this.service.save(patchToSave);

    this.actionTokenService.deleteToken(tokenUuid);
    return patch.uuid;
  }
}
