import {Component, OnInit} from '@angular/core';
import {AccountDataService} from '../services/account-data.service';
import {AccountResultModel} from '../../models/accountResult.model';
import {take} from 'rxjs/operators';
import Speech from 'speak-tts';
import printJS from 'print-js';
import {ActivatedRoute, Router} from '@angular/router';
import {FormTypes} from '../form-types.enum';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-atm',
  templateUrl: './atm.component.html',
  styleUrls: ['./atm.component.css']
})
export class AtmComponent implements OnInit {

  formatter = new Intl.DateTimeFormat('pl',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }
  );
  name = 'KiddyBank';
  utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
  accountResults: AccountResultModel[] = [];
  value: string;
  banknotes = [200, 100, 50, 20, 10];
  withdrawArr: number[];
  prints: string[] = [];
  date = this.formatter.format(new Date());
  pin: string;
  account: AccountResultModel;
  sum: number;
  type: FormTypes = FormTypes.text;
  withdrawSum: number;
  actualBalance: number;
  private errorMessage: 'Error Message';
  pina: number;

  constructor(private accountDataService: AccountDataService, private route: ActivatedRoute, private router: Router,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.loadData();
    this.getAccount(id);
  }

  receiveCash(value): void {
    const totalSum = this.sum || '';
    if (+(totalSum.toString() + value) > 1000) {
      alert('max 1000 pln');
    } else if (+value === 0 && totalSum.toString().length === 0) {
      this.clear();
    } else {
      this.sum = totalSum + value;
    }
  }

  public haveEnoughMoney(): boolean {
    return this.sum <= this.account.balance;
  }

  public isDivideBy10(): boolean {
    return this.sum % 10 === 0;
  }

  getAccount(id: number): void {
    this.accountDataService.getAccountResult().subscribe(result => {
      result.forEach(account => {
        if (account.id === id) {
          this.account = account;
        }
      });
    });
  }

  public isMoreThan(): boolean {
    return this.sum > 1000;
  }

  public prt(): void {
    if (!this.haveEnoughMoney()) {
      alert('masz tylko : ' + this.account.balance);
    } else if (!this.isDivideBy10()) {
      alert('kwota musi byc wielokrotnością 10pln');
    } else if (this.sum.toString().length !== 0) {
      this.withdrawSum = this.sum;
      this.withdraw();
      this.getMoney();
      setTimeout(() => {
        this.router.navigate([`start`]);
      }, 1000);
    }
  }

  public withdraw(): void {
    this.withdrawArr = [0, 0, 0, 0, 0];
    for (let i = 0; i < this.banknotes.length; i++) {
      if (this.sum >= this.banknotes[i]) {
        this.withdrawArr[i] = (this.sum - this.sum % this.banknotes[i]) / this.banknotes[i];
      }
      this.sum %= this.banknotes[i];
    }
  }

  public getMoney(): void {
    for (let i = 0; i < this.withdrawArr.length; i++) {
      for (let j = 0; j < this.withdrawArr[i]; j++) {
        this.prints.push('./assets/pictures/money/' + this.banknotes[i] + '.png');
      }
    }

    printJS({
      printable: this.prints, type: 'image', header: `${this.account.name}  wypłaciła   kwotę  : ${this.withdrawSum} PLN   ${this.date}`,
      imageStyle: 'width:50%;margin-bottom:20px;'
    });
    this.correctBalance();
    this.prints = [];
    this.clear();
  }

  private correctBalance(): void {
    this.actualBalance = this.account.balance - this.withdrawSum;
    this.http.patch<AccountResultModel>('http://localhost:3000/accounts/' + this.account.id + '/', {balance: this.actualBalance})
      .subscribe(data => {
        this.account.balance = this.actualBalance;
      });
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

  public speak1(): void {
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
    this.sum = 0;
  }

}
