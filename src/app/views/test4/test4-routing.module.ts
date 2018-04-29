import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Test4Component } from './test4.component';

const routes: Routes = [
  {
    path: '',
    component: Test4Component,
    data: {
      title: '테스트4'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Test4RoutingModule {}
