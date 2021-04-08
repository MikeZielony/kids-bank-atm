import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {StartComponent} from './start/start.component';
import {AccountDataService} from './services/account-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountService: AccountDataService,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

     if (this.accountService.isUserLogged) {
       console.log('garda true');
       return true;
     } else {
       console.log('garda false');
       this.router.navigate(['start']);
     }
  }
}
