import FormData from 'form-data';
import { Injectable, Inject } from '@nestjs/common';
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
    return this.mailgun.messages.create(domain, dataSend);
  };

  public validateEmail = async (email: string): Promise<ValidationResult> =>
    this.mailgun.validate.get(email);

  public createList = async (data: CreateUpdateList): Promise<MailingList> =>
    this.mailgun.lists.create(data);

  public destroyList = async (
    mailListAddress: string,
  ): Promise<DestroyedList> => this.mailgun.lists.destroy(mailListAddress);

  public getList = async (mailListAddress: string): Promise<MailingList> =>
    this.mailgun.lists.get(mailListAddress);

  public updateList = async (
    mailListAddress: string,
    data: CreateUpdateList,
  ): Promise<MailingList> => this.mailgun.lists.update(mailListAddress, data);

  public listAddMember = async (
    mailListAddress: string,
    data: CreateUpdateMailListMembers,
  ): Promise<MailListMember> =>
    this.mailgun.lists.members.createMember(mailListAddress, data);

  public listGetMembers = async (
    mailListAddress: string,
    query?: MailListMembersQuery,
  ): Promise<MailListMember[]> =>
    this.mailgun.lists.members.listMembers(mailListAddress, query);

  public listCreateMembers = async (
    mailListAddress: string,
    data: MultipleMembersData,
  ): Promise<NewMultipleMembersResponse> =>
    this.mailgun.lists.members.createMembers(mailListAddress, data);

  public listupdateMember = async (
    address: string,
    memberAddress: string,
    data: CreateUpdateMailListMembers,
  ): Promise<MailListMember> =>
    this.mailgun.lists.members.updateMember(address, memberAddress, data);

  public listDestroyMember = async (
    address: string,
    memberAddress: string,
  ): Promise<DeletedMember> =>
    this.mailgun.lists.members.destroyMember(address, memberAddress);
}
