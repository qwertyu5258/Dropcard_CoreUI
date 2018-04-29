import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../../services/auth.service'
import { UtilsService } from '../../../../services/utils.service'
import { CurrentUserService } from '../../../../services/current-user.service'
import { UsersService } from '../../../../services/users.service'
import { User } from 'app/models/user';

@Component({
  templateUrl: './user-detail.component.html'
})

export class UserDetailComponent implements OnInit {

  id: string
  user:User
  updateUser:User
  password: string = ''
  re_password: string = ''

  authorities: string[] = ['admin', 'member', 'pending'];

  error = {
    title: '사용자 수정 실패',
    message: ''
  }
  public failureModal;
  
  @ViewChild('failureModalElemRef')
  failureModalElemRef: ElementRef

  constructor(private router: Router, 
    private activatedRouter: ActivatedRoute, 
    private usersService: UsersService, 
    private utilsService: UtilsService,
    private elementRef: ElementRef) {
    this.user = new User()
    this.updateUser = new User()
  }

  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      this.id = params['id']
      
      this.usersService.getUser(this.id).subscribe(data => {
        data = data.users[0]
     
        this.user.name = data.name
        this.user.id = data.id
        
        this.user.hospital = data.hospital
        this.user.phone = data.phone
        this.user.email = data.email
        this.user.etc = data.etc
        
        this.user.update = this.utilsService.dateFormating(new Date(data.update), '#YYYY#-#MM#-#DD# #hh#:#mm#:#ss#')
        this.user.authority = data.authority
        
        
      }, e => {
        console.log(e.result)
      })
      
   })

  }

  update() {
    if (this.validation()) return

    if (this.password != '') this.updateUser.password = this.password
    this.updateUser.authority = this.user.authority

    this.usersService.updateUser(this.updateUser, this.user.id).subscribe(data => {
      console.log(data)
      this.router.navigateByUrl('/admin/user-list')
    }, e => {
      console.log(e.result)
    })
  }

  validation() {
    let flag = false
    
    if (this.password != '' || this.re_password != '') {
      if(this.password != this.re_password) {
        flag = true
        this.error.message = '비밀번호가 일치하지 않습니다.'
      }
    }

    if (flag) this.failureModalElemRef.nativeElement.dispatchEvent(new Event('click'))

    return flag
  }

  modalKeydownEnter() {
    this.elementRef.nativeElement.querySelector('#faiureModalCloseBtn').dispatchEvent(new Event('click'))    
  }
}
