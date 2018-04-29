import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

import { ModalModule } from 'ngx-bootstrap/modal'
import { TextMaskModule } from 'angular2-text-mask'

import { RegisterRoutingModule } from './register-routing.module'
import { RegisterComponent } from './register.component'

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ModalModule.forRoot(),
    TextMaskModule,
    RegisterRoutingModule
  ],
  declarations: [
    RegisterComponent
  ]
})
export class RegisterModule { }
