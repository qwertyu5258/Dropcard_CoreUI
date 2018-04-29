import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserListComponent } from './user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    data: {
      title: '사용자 목록'
    }
  },
  {
    path: 'user-detail/:id',
    component: UserDetailComponent,
    data: {
      title: '사용자 수정'
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserListRoutingModule {}
