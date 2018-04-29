import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Test3Component } from './test3.component';

const routes: Routes = [
  {
    path: '',
    component: Test3Component,
    data: {
      title: '테스트3'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Test3RoutingModule {}
