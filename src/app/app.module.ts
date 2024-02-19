import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { OrderFormComponent } from './conponents/order-form/order-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { serviceBackend } from './conponents/order-form/service-backend';


@NgModule({
  declarations: [
    AppComponent,
    OrderFormComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [serviceBackend],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
