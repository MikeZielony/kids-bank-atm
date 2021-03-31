import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { AccountDataService} from './account-data.service';
import {AccountResultModel} from './accountResult.model';
import {take} from 'rxjs/operators';
import Speech from 'speak-tts';
import printJS from 'print-js';


@Component({
  selector: 'app-atm',
  templateUrl: './atm.component.html',
  styleUrls: ['./atm.component.css']
})
export class AtmComponent implements OnInit {

  name = 'Kids Banka';
  utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
  isTimeForThisComponent: boolean;
  public kid: string;
  balance: number;
  id: number;
  public accountResults: AccountResultModel [] = [];
  value: string;
  canWithdraw = false;
  banknots = [200, 100, 50, 20, 10];
  withdrawArr: number[];
  prints: string[] = [];
  d = new Date();

  @Output()
  public selectSum: EventEmitter<number> = new EventEmitter<number>();

  sum = '';

  constructor(private accountDataService: AccountDataService) {
    this.isTimeForThisComponent = true;
  }

  public haveEnoughMoney(): boolean {
    return +this.sum <= this.balance;
  }

  public key(value) {
    if ((+this.sum + value) > 1000){
      alert('max 1000 pln');
    }else if (value == 0 && this.sum.length == 0){
      this.sum = '';
    }
    else {
      this.sum = this.sum + value;
    }
  }

  public isdivideBy10() {
    return +this.sum % 10 == 0;
  }

  public clear() {
    this.sum = '';
  }

  public myfunction(message: string) {

    let i: number;

    for (i = 0; i < 2; i++) {     // json length ????
      if (message === this.accountResults[i].name) {
        this.balance = this.accountResults[i].balance;
        this.kid = this.accountResults[i].name;
        this.id = i;
      }
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  public isMoreThan() {
    return +this.sum > 1000;
  }

  public prt() {
    if (!this.haveEnoughMoney()) {
      alert('masz tylko : ' + this.balance);
    }else if (!this.isdivideBy10()){
      alert('kwota musi byc wielokrotnością 10pln');
    } else {
      this.canWithdraw = true;
      this.withdraw();
      this.getMoney();
      console.log('tutaj');
    }
  }

  public withdraw() {
    this.withdrawArr = [0, 0, 0, 0, 0];

    let aaa = +this.sum;
    for (let i = 0; i < this.banknots.length; i++) {
      if (aaa >= this.banknots[i]){
        this.withdrawArr[i] = (aaa - aaa % this.banknots[i]) / this.banknots[i];

      }
      aaa = aaa % this.banknots[i];

    }console.log(this.withdrawArr);
    // this.sum = '';
  }

  public getMoney() {
    for (let i = 0; i < this.withdrawArr.length; i++ ) {
      for (let j = 0; j < this.withdrawArr[i]; j++) {
        console.log('druk');
        console.log(this.banknots[i]);
        this.prints.push('./assets/pictures/money/' + this.banknots[i] + '.png');

      }}
    printJS({printable: this.prints, type: 'image', header: 'Wypłata : ' + this.sum + '  ' + this.d,
      imageStyle: 'width:50%;margin-bottom:20px;'});
    console.log(this.prints);
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


  private _init() {
    const speech = new Speech();
    console.log('speak');
    speech.init({
      volume: 0.5,
      lang: 'pl-PL',
      rate: 1,
      pitch: 1,
    });
  }

  private speak1() {
    const speech = new Speech();
    speech.init({
      volume: 0.5,
      lang: 'pl-PL',
      rate: 1,
      pitch: 1.4,
    });

    speech.speak({
      text: this.kid + 'ma na koncie' + this.balance + 'złotych',
    } as SpeechSynthesisUtterance).then(() => {
      console.log('Success !');
    }).catch(e => {
      console.error('An error occurred :', e);
    });
  }

}
