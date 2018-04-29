import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { AlarmComponent } from './alarm.component';

const routes: Routes = [
  {
    path: '',
    component: AlarmComponent,
    data: {
      title: '알람'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlarmRoutingModule {}
