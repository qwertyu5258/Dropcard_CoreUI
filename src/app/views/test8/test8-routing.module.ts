import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Test8Component } from './test8.component';

const routes: Routes = [
  {
    path: '',
    component: Test8Component,
    data: {
      title: '테스트8'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Test8RoutingModule {}
