import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AlarmComponent } from './alarm.component';
import { AlarmRoutingModule } from './alarm-routing.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AlarmRoutingModule
  ],
  declarations: [ AlarmComponent ]
})
export class AlarmModule { }
