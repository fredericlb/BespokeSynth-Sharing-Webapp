import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ActionToken } from './action-token.model';
import { ActionTokenService } from './action-token.service';

@Resolver()
export class ActionTokenResolver {
  constructor(private actionTokenService: ActionTokenService) {}

  @Mutation(() => String)
  public async createActionToken(): Promise<ActionToken> {
    return this.actionTokenService.createAndSendMail();
  }

  @Query(() => ActionToken)
  public async checkActionToken(
    @Args('uuid') uuid: string,
  ): Promise<ActionToken> {
    return this.actionTokenService.get(uuid);
  }

  @Query(() => ActionToken)
  public async enableToken(
    @Args('uuid') uuid: string,
    @Args('uuid') token: string,
  ): Promise<ActionToken> {
    return this.actionTokenService.enableToken(uuid, token);
  }
}
