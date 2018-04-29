import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Daterangepicker } from 'ng2-daterangepicker';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { IonRangeSliderModule } from "ng2-ion-range-slider";

import { Test2Component } from './test2.component';
import { Test2RoutingModule } from './test2-routing.module';
import { MyCard2Component } from './my-card2/my-card2.component'

import { PipeModule } from '../../services/PipeModule'

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    Test2RoutingModule,
    Daterangepicker,
    ChartsModule,
    ModalModule.forRoot(),
    BsDropdownModule,
    IonRangeSliderModule,
    PipeModule
  ],
  declarations: [
    Test2Component,
    MyCard2Component
  ]
})
export class Test2Module { }
  