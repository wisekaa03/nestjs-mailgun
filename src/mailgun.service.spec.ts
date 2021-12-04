import { Test, TestingModule } from '@nestjs/testing';

import { MAILGUN_CONFIGURATION } from './constants';
import { MailgunService } from './mailgun.service';

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
            key: process.env.MAILGUN_KEY,
            // url: 'api.eu.mailgun.net',
          },
        },
      ],
    }).compile();

    service = module.get<MailgunService>(MailgunService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Send email', () =>
    expect(
      service.createEmail(process.env.MAILGUN_DOMAIN, {
        from: 'package@test.com',
        subject: 'TEST',
        to: 'wisekaa03@gmail.com',
        text: 'Test was successful',
      }),
    ).resolves.toBeDefined());

  // it('Validate email', () => {
  //   return expect(
  //     service.validateEmail('wisekaa03@gmail.com'),
  //   ).resolves.toBeDefined();
  // });
});
