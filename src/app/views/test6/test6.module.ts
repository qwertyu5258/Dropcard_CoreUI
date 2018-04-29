
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Daterangepicker } from 'ng2-daterangepicker';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { IonRangeSliderModule } from "ng2-ion-range-slider";

import { Test6Component } from './test6.component';
import { Test6RoutingModule } from './test6-routing.module';
import { MyCard6Component } from './Card-1/my-card6/my-card6.component'

import { MyCard2Component } from './Card-2/my-card2.component'


import { PipeModule } from '../../services/PipeModule'

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    Test6RoutingModule,
    Daterangepicker,
    ChartsModule,
    ModalModule.forRoot(),
    BsDropdownModule,
    IonRangeSliderModule,
    PipeModule
  ],
  declarations: [
    Test6Component,
    MyCard6Component,
    MyCard2Component,
  ]
})
export class Test6Module { }
  