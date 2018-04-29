import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal'

import { DeviceListRoutingModule } from './device-list-routing.module';
import { DeviceListComponent } from './device-list.component';
import { DeviceDetailComponent } from './device-detail/device-detail.component';
import { DeviceNewComponent } from './device-new/device-new.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DeviceListRoutingModule,
    ModalModule.forRoot()
  ],
  declarations: [
    DeviceListComponent,
    DeviceDetailComponent,
    DeviceNewComponent
  ]
})
export class DeviceListModule { }
