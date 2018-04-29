import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Test6Component } from './test6.component';

const routes: Routes = [
  {
    path: '',
    component: Test6Component,
    data: {
      title: '테스트6'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Test6RoutingModule {}
