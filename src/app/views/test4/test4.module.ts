import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Daterangepicker } from 'ng2-daterangepicker';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { IonRangeSliderModule } from "ng2-ion-range-slider";

import { Test4Component } from './test4.component';
import { Test4RoutingModule } from './test4-routing.module';
import { MyCard4Component } from './my-card4/my-card4.component'

import { PipeModule } from '../../services/PipeModule'

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

export class CustomHammerConfig extends HammerGestureConfig {
  overrides = {
    'rotate': { enable: true }
  }
}

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    Test4RoutingModule,
    Daterangepicker,
    ChartsModule,
    ModalModule.forRoot(),
    BsDropdownModule,
    IonRangeSliderModule,
    PipeModule
  ],
  declarations: [
    Test4Component,
    MyCard4Component
  ],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: CustomHammerConfig
  }
  ]
})
export class Test4Module { }
