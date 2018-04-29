import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Daterangepicker } from 'ng2-daterangepicker';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { IonRangeSliderModule } from "ng2-ion-range-slider";

import { Test3Component } from './test3.component';
import { Test3RoutingModule } from './test3-routing.module';
import { MyCard3Component } from './my-card3/my-card3.component'

import { PipeModule } from '../../services/PipeModule'

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    Test3RoutingModule,
    Daterangepicker,
    ChartsModule,
    ModalModule.forRoot(),
    BsDropdownModule,
    IonRangeSliderModule,
    PipeModule
  ],
  declarations: [
    Test3Component,
    MyCard3Component
  ]
})
export class Test3Module { }
  