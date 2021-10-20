import { ConfigService } from '@nestjs/config';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ActionTokenService } from 'src/action-token/action-token.service';
import { MailService } from 'src/mail/mail.service';
import { Patch, PatchOutput } from './patch.model';
import { PatchesService } from './patches.service';
import { UploadPatchInput } from './upload-patch.input';

@Resolver()
export class PatchesResolver {
  constructor(
    private service: PatchesService,
    private actionTokenService: ActionTokenService,
    private mailService: MailService,
    private config: ConfigService,
  ) {}

  @Query(() => PatchOutput)
  async patch(
    @Args('uuid') uuid: string,
    @Args('token', { nullable: true }) token: string | null,
  ) {
    return this.service.get(uuid, token);
  }

  @Mutation(() => PatchOutput)
  async moderatePatch(
    @Args('uuid') uuid: string,
    @Args('token', { nullable: true }) token: string | null,
    @Args('approved') approved: boolean,
  ) {
    const patch = await this.service.moderate(uuid, token, approved);

    this.mailService.sendModerationResult(patch, approved);

    return patch;
  }

  @Query(() => [PatchOutput])
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
    if (
      !this.config.get<boolean>('DISABLE_ACTION_TOKEN_CHECK') &&
      !(await this.actionTokenService.get(tokenUuid)).enabled
    ) {
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

    if (!this.config.get<boolean>('DISABLE_ACTION_TOKEN_CHECK')) {
      await this.actionTokenService.deleteToken(tokenUuid);
    }
    await this.mailService.sendSubmittedPatch(patch);

    return patch.uuid;
  }
}
