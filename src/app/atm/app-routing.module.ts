import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AtmComponent} from './atm.component';
import {StartComponent} from './start/start.component';
import {AuthGuard} from './auth.guard';

const routes: Routes = [
  {path: '', redirectTo: '/start', pathMatch: 'full'},
  {
    path: 'atm/:id',
    component: AtmComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'start',
    component: StartComponent,
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
