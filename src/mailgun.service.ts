import FormData from 'form-data';
import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import Mailgun from 'mailgun.js';
import Client from 'mailgun.js/dist/lib/client';
import Options from 'mailgun.js/dist/lib/interfaces/Options';
import type { ValidationResult } from 'mailgun.js/dist/lib/interfaces/Validate';
import {
  CreateUpdateList,
  DestroyedList,
  MailingList,
} from 'mailgun.js/dist/lib/interfaces/lists';
import {
  CreateUpdateMailListMembers,
  DeletedMember,
  MailListMember,
  MailListMembersQuery,
  MultipleMembersData,
  NewMultipleMembersResponse,
} from 'mailgun.js/dist/lib/interfaces/mailListMembers';
import APIError from 'mailgun.js/dist/lib/error';
import { MAILGUN_CONFIGURATION } from './constants';
import type { EmailOptions } from './interfaces';

@Injectable()
export class MailgunService {
  private readonly mailgun: Client;

  constructor(
    @Inject(MAILGUN_CONFIGURATION) private readonly configuration: Options,
  ) {
    this.mailgun = new Mailgun(FormData).client(configuration);
  }

  public createEmail = async (
    domain: string,
    data: EmailOptions,
  ): Promise<any> => {
    const dataSend = data.templateVariables
      ? {
          ...data,
          'h:X-Mailgun-Variables': JSON.stringify(data.templateVariables),
        }
      : data;
    return this.mailgun.messages
      .create(domain, dataSend)
      .catch((error: APIError) => {
        throw new InternalServerErrorException(error, error?.details);
      });
  };

  public validateEmail = async (email: string): Promise<ValidationResult> =>
    this.mailgun.validate.get(email).catch((error: APIError) => {
      throw new InternalServerErrorException(error, error?.details);
    });

  public createList = async (data: CreateUpdateList): Promise<MailingList> =>
    this.mailgun.lists.create(data).catch((error: APIError) => {
      throw new InternalServerErrorException(error, error?.details);
    });

  public destroyList = async (
    mailListAddress: string,
  ): Promise<DestroyedList> =>
    this.mailgun.lists.destroy(mailListAddress).catch((error: APIError) => {
      throw new InternalServerErrorException(error, error?.details);
    });

  public getList = async (mailListAddress: string): Promise<MailingList> =>
    this.mailgun.lists.get(mailListAddress).catch((error: APIError) => {
      throw new InternalServerErrorException(error, error?.details);
    });

  public updateList = async (
    mailListAddress: string,
    data: CreateUpdateList,
  ): Promise<MailingList> =>
    this.mailgun.lists
      .update(mailListAddress, data)
      .catch((error: APIError) => {
        throw new InternalServerErrorException(error, error?.details);
      });

  public listAddMember = async (
    mailListAddress: string,
    data: CreateUpdateMailListMembers,
  ): Promise<MailListMember> =>
    this.mailgun.lists.members
      .createMember(mailListAddress, data)
      .catch((error: APIError) => {
        throw new InternalServerErrorException(error, error?.details);
      });

  public listGetMembers = async (
    mailListAddress: string,
    query?: MailListMembersQuery,
  ): Promise<MailListMember[]> =>
    this.mailgun.lists.members
      .listMembers(mailListAddress, query)
      .catch((error: APIError) => {
        throw new InternalServerErrorException(error, error?.details);
      });

  public listCreateMembers = async (
    mailListAddress: string,
    data: MultipleMembersData,
  ): Promise<NewMultipleMembersResponse> =>
    this.mailgun.lists.members
      .createMembers(mailListAddress, data)
      .catch((error: APIError) => {
        throw new InternalServerErrorException(error, error?.details);
      });

  public listupdateMember = async (
    address: string,
    memberAddress: string,
    data: CreateUpdateMailListMembers,
  ): Promise<MailListMember> =>
    this.mailgun.lists.members
      .updateMember(address, memberAddress, data)
      .catch((error: APIError) => {
        throw new InternalServerErrorException(error, error?.details);
      });

  public listDestroyMember = async (
    address: string,
    memberAddress: string,
  ): Promise<DeletedMember> =>
    this.mailgun.lists.members
      .destroyMember(address, memberAddress)
      .catch((error: APIError) => {
        throw new InternalServerErrorException(error, error?.details);
      });
}
