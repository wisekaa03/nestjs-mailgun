import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { MAILGUN_CONFIGURATION } from './constants';
import { MailgunService } from './mailgun.service';

const configService = new ConfigService();

describe('MailgunService', () => {
  let service: MailgunService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailgunService,
        {
          provide: MAILGUN_CONFIGURATION,
          useValue: {
            username: 'Nuno',
            key: configService.get('MAILGUN_KEY'),
            url: `https://${configService.get<string>(
              'MAILGUN_URL',
              'api.mailgun.net',
            )}`,
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
    const received = await service.createEmail(
      configService.get('MAILGUN_DOMAIN'),
      {
        from: 'package@test.com',
        subject: 'TEST',
        to: 'wisekaa03@gmail.com',
        text: 'Test was successful',
      },
    );

    expect(received).toBeDefined();
  });

  // it('Validate email', () => {
  //   return expect(
  //     service.validateEmail('wisekaa03@gmail.com'),
  //   ).resolves.toBeDefined();
  // });
});
