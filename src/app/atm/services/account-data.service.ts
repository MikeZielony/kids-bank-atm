import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StartComponent} from '../start/start.component';
import {filter, map} from 'rxjs/operators';
import {AccountResultModel} from '../../models/accountResult.model';
import {IAccountResultDto} from '../../models/accountResult.dto';

@Injectable({
  providedIn: 'root'
})
export class AccountDataService {

  constructor(
    private http: HttpClient
  ) {
  }

  public isUserLogged = false;

  public getAccountResult(): Observable<AccountResultModel[]> {
    return this.http.get<IAccountResultDto[]>('http://localhost:3000/accounts/')
      .pipe(
        map(results => results.map(result => new AccountResultModel(result)))
      );
  }
}

