import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { FavoriteComponent } from './favorite.component';

const routes: Routes = [
  {
    path: '',
    component: FavoriteComponent,
    data: {
      title: '즐겨찾기'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FavoriteRoutingModule {}
