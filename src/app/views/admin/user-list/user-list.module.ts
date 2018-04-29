import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal'

import { UserListRoutingModule } from './user-list-routing.module';
import { UserListComponent } from './user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    UserListRoutingModule,
    ModalModule.forRoot()
  ],
  declarations: [
    UserListComponent,
    UserDetailComponent
  ]
})
export class UserListModule { }
