import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Test7Component } from './test7.component';

const routes: Routes = [
  {
    path: '',
    component: Test7Component,
    data: {
      title: '테스트7'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Test7RoutingModule {}
