import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AtmComponent} from './atm.component';

const routes: Routes = [
  {path: '', redirectTo: '/atm', pathMatch: 'full'},
  {path: 'atm', component: AtmComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
