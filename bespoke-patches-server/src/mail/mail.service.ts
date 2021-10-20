import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ActionToken } from 'src/action-token/action-token.model';
import { Patch } from 'src/patches/patch.model';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  async sendActionTokenValidation(mail: string, at: ActionToken) {
    const url = `${this.config.get('URL')}/validation/access-token/${
      at.uuid
    }?token=${at.token}`;

    await this.mailerService.sendMail({
      to: mail,
      subject: 'Validation link',
      template: './sendActionToken',
      context: {
        url,
      },
    });
  }

  async sendSubmittedPatch(patch: Patch) {
    const url = `${this.config.get('URL')}/patches/${patch.uuid}?token=${
      patch._token
    }`;

    await this.mailerService.sendMail({
      to: patch.mail,
      subject: 'Patch submitted',
      template: './uploadPatchUser',
      context: {
        title: patch.title,
      },
    });

    await this.mailerService.sendMail({
      to: this.config.get('ADMIN'),
      subject: 'Patch submitted',
      template: './uploadPatchAdmin',
      context: {
        title: patch.title,
        url,
      },
    });
  }

  async sendModerationResult(patch: Patch, approved: boolean) {
    const url = `${this.config.get('URL')}/patches/${patch.uuid}`;

    await this.mailerService.sendMail({
      to: patch.mail,
      subject: approved
        ? 'Your patch has been approved'
        : 'Your patch has been rejected',
      template: approved ? './uploadPatchApproved' : './uploadPatchRejected',
      context: {
        title: patch.title,
        url,
      },
    });
  }
}
