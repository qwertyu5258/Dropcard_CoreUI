import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Daterangepicker } from 'ng2-daterangepicker';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { IonRangeSliderModule } from "ng2-ion-range-slider";

import { Test7Component } from './test7.component';
import { Test7RoutingModule } from './test7-routing.module';
import { MyCard7Component } from './my-card7/my-card7.component'

import { PipeModule } from '../../services/PipeModule'

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    Test7RoutingModule,
    Daterangepicker,
    ChartsModule,
    ModalModule.forRoot(),
    BsDropdownModule,
    IonRangeSliderModule,
    PipeModule
  ],
  declarations: [
    Test7Component,
    MyCard7Component
  ]
})
export class Test7Module { }
  