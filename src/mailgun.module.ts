import { Module, Provider } from '@nestjs/common';
import { MailgunClientOptions } from 'mailgun.js';

import type { OptionsAsync } from './interfaces';
import { MAILGUN_CONFIGURATION } from './constants';
import { MailgunService } from './mailgun.service';

@Module({})
export class MailgunModule {
  public static forRoot(config: MailgunClientOptions) {
    return {
      module: MailgunModule,
      //   controllers: [
      //     ...controllers,
      //   ],
      providers: [
        { provide: MAILGUN_CONFIGURATION, useValue: config },
        MailgunService,
      ],
      exports: [MailgunService],
    };
  }

  public static forAsyncRoot(config: OptionsAsync) {
    return {
      module: MailgunModule,
      //   controllers: [
      //     ...controllers,
      //   ],
      imports: config.imports || [],
      providers: [this.createAsyncProviders(config), MailgunService],
      exports: [MailgunService],
    };
  }

  private static createAsyncProviders(options: OptionsAsync): Provider {
    return {
      provide: MAILGUN_CONFIGURATION,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
}
