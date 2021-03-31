import { IAccountResultDto} from './accountResult.dto';

export class AccountResultModel {
  public id: number;
  public name: string;
  public balance: number;

  constructor(input: IAccountResultDto) {
    this.id = input.id;
    this.name = input.name;
    this.balance = input.balance;
  }
}
