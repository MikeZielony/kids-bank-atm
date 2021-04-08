import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AccountDataService} from '../services/account-data.service';
import {AccountResultModel} from '../../models/accountResult.model';
import {take} from 'rxjs/operators';
import Speech from 'speak-tts';
import printJS from 'print-js';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-atm',
  templateUrl: './atm.component.html',
  styleUrls: ['./atm.component.css']
})
export class AtmComponent implements OnInit {

  buffer = [];
  name = 'Kids Banka';
  utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
  isTimeForThisComponent: boolean;
  sumNumber: number;
  accountResults: AccountResultModel[] = [];
  value: string;
  canWithdraw = false;
  banknotes = [200, 100, 50, 20, 10];
  withdrawArr: number[];
  prints: string[] = [];
  d = new Date();
  pin: string;
  account: AccountResultModel;
  sum = '';

  @Output()
  public selectSum: EventEmitter<number> = new EventEmitter<number>();


  constructor(private accountDataService: AccountDataService, private route: ActivatedRoute) {
    this.isTimeForThisComponent = true;
    console.log('construktor');
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.loadData();
    this.getAccount(id);
  }

  public haveEnoughMoney(): boolean {
    return +this.sum <= this.account.balance;
  }

  public key(value): void {
    if ((+this.sum + value) > 1000) {
      alert('max 1000 pln');
    } else if (+value === 0 && this.sum.length === 0) {
      this.clear();
    } else {
      this.sum = this.sum + value;
    }
  }

  public isDivideBy10(): boolean {
    return +this.sum % 10 === 0;
  }

  getAccount(id: number): void {
    this.accountDataService.getAccountResult().subscribe(result => {
      result.forEach(account => {
        if (account.id === id) {
          this.account = account;
          console.log(account);
        }
      });
      console.log(result);
    });
  }

  handleKeyDown(event: KeyboardEvent): void {
    const enteredKey = event.key.toLowerCase();
    const acceptedCharMatrix = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'f'];
    this.buffer = acceptedCharMatrix.includes(enteredKey) ? [...this.buffer, enteredKey] : this.buffer;
    if (enteredKey === 'enter') {
      console.log(this.buffer);
      this.checkCard(this.buffer.join(''));
    }
  }

  checkCard(cardNumber: string): void {
    console.log(cardNumber);
    this.account = this.accountResults.filter((account: AccountResultModel) => {
      if (cardNumber === account.cardId) {
        return account;
      }
    }).shift();
    this.buffer = [];
  }

  public isMoreThan(): boolean {
    return +this.sum > 1000;
  }

  public prt(): void {
    if (!this.haveEnoughMoney()) {
      alert('masz tylko : ' + this.account.balance);
    } else if (!this.isDivideBy10()) {
      alert('kwota musi byc wielokrotnością 10pln');
    } else if (this.sum.length !== 0){
      this.canWithdraw = true;
      this.withdraw();
      this.getMoney();
      this.sum = '';
    }
  }

  public withdraw(): void {
    this.withdrawArr = [0, 0, 0, 0, 0];
    this.sumNumber = +this.sum;  // sumNuber ??
    for (let i = 0; i < this.banknotes.length; i++) {
      if (this.sumNumber >= this.banknotes[i]) {
        this.withdrawArr[i] = (this.sumNumber - this.sumNumber % this.banknotes[i]) / this.banknotes[i];
      }
      this.sumNumber %= this.banknotes[i];
    }
  }

  public getMoney(): void {
    for (let i = 0; i < this.withdrawArr.length; i++) {
      for (let j = 0; j < this.withdrawArr[i]; j++) {
        this.prints.push('./assets/pictures/money/' + this.banknotes[i] + '.png');
      }
    }

    printJS({
      printable: this.prints, type: 'image', header: 'Wypłata : ' + this.sum + '  ' + this.d,
      imageStyle: 'width:50%;margin-bottom:20px;'
    });
    this.prints = [];
  }

  private loadData(): void {
    this.accountDataService.getAccountResult()
      .pipe(
        take(1)
      )
      .subscribe(results => {
        this.accountResults = results;
      });
  }

  private speak1(): void {
    const speech = new Speech();
    speech.init({
      volume: 0.5,
      lang: 'pl-PL',
      rate: 1,
      pitch: 1.4,
    });

    speech.speak({
      text: this.account.name + 'ma na koncie' + this.account.balance + 'złotych',
    } as SpeechSynthesisUtterance).then(() => {
      console.log('Success !');
    }).catch(e => {
      console.error('An error occurred :', e);
    });
  }

  public clear(): void {
    this.sum = '';
  }

}
