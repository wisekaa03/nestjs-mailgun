import { ModuleMetadata } from '@nestjs/common/interfaces';
import Options from 'mailgun.js/dist/lib/interfaces/Options';

export interface OptionsAsync extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Options | Promise<Options>;
  inject?: any[];
}

export interface EmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  templateVariables?: Record<string, any>;
  attachment?: any;
  cc?: string | string[];
  bcc?: string | string[];
  'o:testmode'?: 'yes' | 'no';
  'h:X-Mailgun-Variables'?: string;
}
