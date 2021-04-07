import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { StartComponent} from './start/start.component';
import {map} from 'rxjs/operators';
import {AccountResultModel} from './accountResult.model';
import {IAccountResultDto} from './accountResult.dto';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountDataService {

  constructor(
    private http: HttpClient, private start: StartComponent, private router: Router
  ) {
  }

  public isUserLogged = false;

  public getAccountResult(): Observable<AccountResultModel[]> {
    return this.http.get<IAccountResultDto[]>('./assets/jsons/accounts.json')
      .pipe(
        map(results => results.map(result => new AccountResultModel(result)))
      );
  }

  public checkPin() {
    if (this.start.EntryPin === this.start.pin ){
      this.isUserLogged = true;
      this.router.navigate(['atm']);
    }else{
      this.isUserLogged = false;
    }
  }

  public key(value) {
    this.start.EntryPin = this.start.EntryPin + this.start.value;
  }

  public clear() {
    this.start.EntryPin = '';
  }

}

