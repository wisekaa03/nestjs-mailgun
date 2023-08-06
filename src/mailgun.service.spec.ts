// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { MAILGUN_CONFIGURATION } from './constants';
import { MailgunService } from './mailgun.service';

jest.setTimeout(15000);
const configService = new ConfigService(dotenv.config());

describe('MailgunService', () => {
  let service: MailgunService;
  let domain: string;
  let fromEmail: string;
  const toEmail: string = 'stanislav@wisekaa.dev';

  beforeAll(async () => {
    domain = configService.get('MAILGUN_DOMAIN');
    const key = configService.get('MAILGUN_KEY');
    fromEmail = `postmaster@${domain}`;
    const url = `https://${configService.get<string>(
      'MAILGUN_URL',
      'api.mailgun.net',
    )}`;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailgunService,
        {
          provide: MAILGUN_CONFIGURATION,
          useValue: {
            username: 'api',
            key,
            url,
          },
        },
      ],
    }).compile();

    service = module.get<MailgunService>(MailgunService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Send email', async () => {
    const received = await service.createEmail(domain, {
      from: fromEmail,
      to: toEmail,
      subject: 'TEST',
      text: 'Test was successful',
    });

    expect(received).toBeDefined();
  });
});
