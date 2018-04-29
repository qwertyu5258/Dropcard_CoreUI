import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TextMaskModule } from 'angular2-text-mask'
import { ModalModule } from 'ngx-bootstrap/modal'

import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    TextMaskModule,
    ProfileRoutingModule,
    ModalModule.forRoot()
  ],
  declarations: [
    ProfileComponent
  ]
})
export class ProfileModule { }
