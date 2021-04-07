import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AccountResultModel} from '../accountResult.model';
import {AccountDataService} from '../account-data.service';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  buffer = [];
  kid: string;
  balance: number;
  id: number;
  accountResults: AccountResultModel[] = [];
  value: string;
  canWithdraw = false;
  banknots = [200, 100, 50, 20, 10];
  withdrawArr: number[];
  prints: string[] = [];
  d = new Date();
  cardId: string;
  pin: string;
  public isUserLogged: boolean;


  @Output()
  public subEntryPin: EventEmitter<string> = new EventEmitter<string>();
  EntryPin = '';

  constructor(private accountDataService: AccountDataService,
              private router: Router) { }

  ngOnInit(): void {
    this.loadData();
    window.addEventListener('keydown', this.handleKeyDown.bind(this));

  }

  handleKeyDown(event: KeyboardEvent) {
    const enteredKey = event.key.toLowerCase();
    const acceptedCharMatrix = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'f'];
    this.buffer = acceptedCharMatrix.includes(enteredKey) ? [...this.buffer, enteredKey] : this.buffer;
    if (enteredKey === 'enter') {
      console.log(this.buffer);
      this.checkCard(this.buffer.join(''));
    }
  }

  checkCard(cardNumber: string) {
    console.log(cardNumber);
    for (let i = 0; i < 6; i++) {     // json length ????
      if (cardNumber === this.accountResults[i].cardId) {
        this.balance = this.accountResults[i].balance;
        this.kid = this.accountResults[i].name;
        this.id = i;
        this.kid = this.accountResults[i].name;
        this.pin = this.accountResults[i].pin;
      }

      this.buffer = [];
    }
  }

  public myfunction(message: string) {
    let i: number;
    for (i = 0; i < 2; i++) {     // json length ????
      if (message === this.accountResults[i].name) {
        this.balance = this.accountResults[i].balance;
        this.kid = this.accountResults[i].name;
        this.id = i;
        this.cardId = this.accountResults[i].cardId;
        this.pin = this.accountResults[i].pin;
      }
    }
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

 /* public checkPin() {
    if (this.EntryPin === this.pin ){
      this.accountDataService.isUserLogged = true;
      console.log(this.isUserLogged);
      console.log('ok');
      this.router.navigate(['atm']);
    }else{
      console.log('not ok');
      console.log(this.EntryPin);
      console.log(this.pin);
      console.log(this.isUserLogged);
      this.accountDataService.isUserLogged = false;
    }
  }*/



}
