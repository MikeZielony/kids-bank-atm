import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { AtmComponent } from './atm/atm/atm.component';
import {FormsModule} from '@angular/forms';
import { AppRoutingModule } from './atm/app-routing.module';
import { StartComponent } from './atm/start/start.component';
import { NumPadComponent } from './atm/num-pad/num-pad.component';


@NgModule({
  declarations: [
    AppComponent,
    AtmComponent,
    StartComponent,
    NumPadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
