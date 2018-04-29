import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Daterangepicker } from 'ng2-daterangepicker';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { IonRangeSliderModule } from "ng2-ion-range-slider";

import { TestComponent } from './test.component';
import { TestRoutingModule } from './test-routing.module';
import { MyCardComponent } from './my-card/my-card.component'

import { PipeModule } from '../../services/PipeModule'

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    TestRoutingModule,
    Daterangepicker,
    ChartsModule,
    ModalModule.forRoot(),
    BsDropdownModule,
    IonRangeSliderModule,
    PipeModule
  ],
  declarations: [
    TestComponent,
    MyCardComponent
  ]
})
export class TestModule { }
  