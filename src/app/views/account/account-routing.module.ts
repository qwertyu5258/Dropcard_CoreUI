import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/account/profile',
    pathMatch: 'full',
  },
  {
    path: '',
    data: {
      title: '계정'
    },
    children: [
      {
        path: 'profile',
        loadChildren: './profile/profile.module#ProfileModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
