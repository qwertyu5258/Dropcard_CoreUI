import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeviceListComponent } from './device-list.component';
import { DeviceDetailComponent } from './device-detail/device-detail.component';
import { DeviceNewComponent } from './device-new/device-new.component';

const routes: Routes = [
  {
    path: '',
    component: DeviceListComponent,
    data: {
      title: '장비 목록'
    }
  },
  {
    path: 'device-detail/:id',
    component: DeviceDetailComponent,
    data: {
      title: '장비 수정'
    }
  },
  {
    path: 'device-new',
    component: DeviceNewComponent,
    data: {
      title: '장비 추가'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceListRoutingModule {}
