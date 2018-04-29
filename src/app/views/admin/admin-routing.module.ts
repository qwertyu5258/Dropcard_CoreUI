import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminGuard } from '../../services/admin.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin/user-list',
    pathMatch: 'full',
  },
  {
    path: '',
    data: {
      title: '관리자'
    },
    canActivate: [AdminGuard],
    children: [
      {
        path: 'user-list',
        loadChildren: './user-list/user-list.module#UserListModule'
      },
      {
        path: 'device-list',
        loadChildren: './device-list/device-list.module#DeviceListModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
