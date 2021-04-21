import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AccountResultModel} from '../../models/accountResult.model';
import {AccountDataService} from '../services/account-data.service';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})

export class StartComponent implements OnInit, OnDestroy {

  buffer = [];
  accountResults: AccountResultModel[] = [];
  withdrawArr: number[];
  prints: string[] = [];
  d = new Date();
  account: AccountResultModel;
  pin = '';

  constructor(public accountDataService: AccountDataService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loadData();
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown, true);
  }

  receivePin(value: string): void {
    if (this.accountDataService.entryPin.length < 4) {
      this.accountDataService.entryPin += value;
    }
    if (this.accountDataService.entryPin.length === 4) {
      this.pin = this.accountDataService.entryPin;
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    const enteredKey = event.key.toLowerCase();
    const acceptedCharMatrix = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'f'];
    this.buffer = acceptedCharMatrix.includes(enteredKey) ? [...this.buffer, enteredKey] : this.buffer;
    if (enteredKey === 'enter') {
      this.checkCard(this.buffer.join(''));
    }
  }

  checkCard(cardNumber: string): void {
    this.buffer = [];
    this.account = this.accountResults.filter((account: AccountResultModel) => {
      if (cardNumber === account.cardId) {
        return account;
      }
    }).shift();
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

  public checkPin(): void {
    if (this.pin === this.account.pin) {
      this.accountDataService.isUserLogged = true;
      this.router.navigate([`atm/${this.account.id}`]);
      this.accountDataService.entryPin = '';
    } else {
      this.accountDataService.isUserLogged = false;
      this.accountDataService.isPinFalse = true;
      this.accountDataService.entryPin = '';
    }
  }

  public clearPin(): void {
    this.accountDataService.entryPin = '';
    this.accountDataService.isPinFalse = false;
  }
}
