import { IAccountResultDto} from './accountResult.dto';

export class AccountResultModel {
  public id: number;
  public name: string;
  public balance: number;
  public cardId: string;
  public pin: string;

  constructor(input: IAccountResultDto) {
    this.id = input.id;
    this.name = input.name;
    this.balance = input.balance;
    this.cardId = input.cardId;
    this.pin = input.pin;
  }
}
