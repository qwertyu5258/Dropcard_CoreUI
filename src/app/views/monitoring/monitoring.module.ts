import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { IonRangeSliderModule } from "ng2-ion-range-slider";

import { MonitoringComponent } from './monitoring.component';
import { MonitoringRoutingModule } from './monitoring-routing.module';

import { PipeModule } from '../../services/PipeModule'

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MonitoringRoutingModule,
    ModalModule.forRoot(),
    ChartsModule,
    BsDropdownModule,
    IonRangeSliderModule,
    PipeModule
  ],
  declarations: [
    MonitoringComponent,
  ]
})
export class MonitoringModule { }
