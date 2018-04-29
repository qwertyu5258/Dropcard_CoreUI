import { Component, ViewChild, ElementRef, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { AuthService } from '../../services/auth.service'
import { User } from '../../models/user'

@Component({
  templateUrl: 'register.component.html'
})

export class RegisterComponent implements OnInit {

  public phoneMask = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  
  user: User = new User()
  hospitals: string[] = ['부산센텀병원'];
  repassword: string = ""
  

  error = {
    title: '회원가입 실패',
    message: ''
  }

  public failureModal;
  public successModal;

  @ViewChild('failureModalElemRef')
  failureModalElemRef: ElementRef

  @ViewChild('successModalElemRef')
  successModalElemRef: ElementRef

  constructor(private router: Router, private elementRef: ElementRef, private authService: AuthService) { }

  ngOnInit() {
    this.user.hospital = this.hospitals[0]
  }

  register(user:User) {
    if(this.validation(user)) return

    this.authService.register(user).subscribe(data => {
      this.successModalElemRef.nativeElement.dispatchEvent(new Event('click'))
      console.log(data)
    }, e => {
      console.log(e)
      if (e.message === 'userid exists') {
        this.error.message = '이미 등록된 아이디입니다.'
      }
      this.failureModalElemRef.nativeElement.dispatchEvent(new Event('click'))      
    })
  }

  validation(user: User) {
    let flag = false

    if (!user.id) {
      flag = true
      this.error.message = '아이디를 입력해주세요.'
    } else if (!user.password || this.repassword == "") {
      flag = true
      this.error.message = '비밀번호를 입력해주세요'
    } else if (user.password != this.repassword) {
      flag = true
      this.error.message = '비밀번호가 일치하지 않습니다.'
    } else if (!user.name) {
      flag = true
      this.error.message = '이름을 입력해주세요'
    } else if (!user.phone) {
      flag = true
      this.error.message = '휴대폰 번호를 입력해주세요'
    } else if (!user.email) {
      flag = true
      this.error.message = '이메일을 입력해주세요'
    }
    
    if (flag) this.failureModalElemRef.nativeElement.dispatchEvent(new Event('click'))
    
    return flag
  }

  failureModalKeydownEnter() {
    this.elementRef.nativeElement.querySelector('#faiureModalCloseBtn').dispatchEvent(new Event('click'))
  }

  successModalKeydownEnter() {
    this.elementRef.nativeElement.querySelector('#successModalCloseBtn').dispatchEvent(new Event('click'))
  }

}

