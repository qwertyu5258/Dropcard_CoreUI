import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Test2Component } from './test2.component';

const routes: Routes = [
  {
    path: '',
    component: Test2Component,
    data: {
      title: '테스트2'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Test2RoutingModule {}
