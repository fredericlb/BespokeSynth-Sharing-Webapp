import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Action } from 'rxjs/internal/scheduler/Action';
import { MailService } from 'src/mail/mail.service';
import { ActionToken, ActionTokenOutput } from './action-token.model';
import { ActionTokenService } from './action-token.service';
const pubSub = new PubSub();

@Resolver()
export class ActionTokenResolver {
  constructor(
    private actionTokenService: ActionTokenService,
    private mailService: MailService,
  ) {}

  @Mutation(() => ActionTokenOutput, {
    description: 'Create a new action token and send validation mail',
  })
  public async createActionToken(
    @Args('mail') mail: string,
  ): Promise<ActionTokenOutput> {
    const at = await this.actionTokenService.create();

    this.mailService.sendActionTokenValidation(mail, at);

    return at;
  }

  @Query(() => ActionTokenOutput, {
    description: 'Check if an action token has been activated through its uuid',
  })
  public async checkActionToken(
    @Args('uuid') uuid: string,
  ): Promise<ActionTokenOutput> {
    return this.actionTokenService.get(uuid);
  }

  @Mutation(() => ActionTokenOutput, {
    description: 'Enables an action token',
  })
  public async enableToken(
    @Args('uuid') uuid: string,
    @Args('token') token: string,
  ): Promise<ActionTokenOutput> {
    const at = await this.actionTokenService.enableToken(uuid, token);
    pubSub.publish('actionTokenEnabled', { actionTokenEnabled: at });

    return at;
  }
}
