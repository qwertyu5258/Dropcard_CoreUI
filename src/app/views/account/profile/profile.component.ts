import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service'
import { UtilsService } from '../../../services/utils.service'
import { CurrentUserService } from '../../../services/current-user.service'
import { UsersService } from '../../../services/users.service'
import { User } from 'app/models/user';

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  user:User
  updateUser: User

  password: string = ''
  re_password: string = ''

  error = {
    title: '프로필 수정 실패',
    message: ''
  }
  public failureModal;
  
  @ViewChild('failureModalElemRef')
  failureModalElemRef: ElementRef

  public phoneMask = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(private router: Router,
    private usersService: UsersService,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private utilsService: UtilsService,
    private elementRef: ElementRef) {
    this.user = new User()
    this.updateUser = new User();
  }

  ngOnInit() {
    let id = this.currentUserService.getId()
    this.usersService.getUser(id).subscribe(data => {
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
  }

  update() {
    if (this.validation()) return

    if (this.password != '') this.updateUser.password = this.password
    this.updateUser.phone = this.user.phone
    this.updateUser.email = this.user.email
    this.updateUser.etc = this.user.etc

    this.usersService.updateUser(this.updateUser, this.user.id).subscribe(data => {
      console.log(data)
      this.router.navigateByUrl('/monitoring')
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
    } else if (this.user.phone == '') {
      flag = true
      this.error.message = '휴대폰 번호를 입력해주세요.'
    } else if (this.user.email == '') {
      flag = true
      this.error.message = '이메일을 입력해주세요.'
    }

    if (flag) this.failureModalElemRef.nativeElement.dispatchEvent(new Event('click'))

    return flag
  }

  retire() {
    this.usersService.deleteUser(this.user.id).subscribe(data => {
      console.log(data)
      this.authService.logout()
      this.router.navigateByUrl('/')
    }, e => {
      console.log(e.result)
    })
    
  }

  modalKeydownEnter() {
    this.elementRef.nativeElement.querySelector('#faiureModalCloseBtn').dispatchEvent(new Event('click'))    
  }

}
