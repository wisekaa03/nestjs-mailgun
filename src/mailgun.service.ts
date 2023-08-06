import FormData from 'form-data';
import { Injectable, Inject } from '@nestjs/common';
import Mailgun, {
  Interfaces,
  MailgunClientOptions,
  CreateUpdateList,
  DestroyedList,
  MailingList,
  MailgunMessageData,
  MessagesSendResult,
  CreateUpdateMailListMembers,
  DeletedMember,
  MailListMember,
  MailListMembersQuery,
  MailListMembersResult,
  MultipleMembersData,
  NewMultipleMembersResponse,
  ValidationResult,
  APIErrorType,
} from 'mailgun.js';
import { MAILGUN_CONFIGURATION } from './constants';

export type MailgunError = APIErrorType;

@Injectable()
export class MailgunService {
  private readonly mailgun: Interfaces.IMailgunClient;

  constructor(
    @Inject(MAILGUN_CONFIGURATION)
    private readonly configuration: MailgunClientOptions,
  ) {
    this.mailgun = new Mailgun(FormData).client(configuration);
  }

  public createEmail = async (
    domain: string,
    data: MailgunMessageData,
  ): Promise<MessagesSendResult> => this.mailgun.messages.create(domain, data);

  public validateEmail = async (email: string): Promise<ValidationResult> => {
    try {
      return await this.mailgun.validate.get(email);
    } catch (e: unknown) {
      throw new Error(e as string);
    }
  };

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
  ): Promise<MailListMembersResult> =>
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
