import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'hammerjs';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { GarageModule } from './garage/garage.module';

@NgModule({
  imports: [
    BrowserModule,
    GarageModule,
    CoreModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
