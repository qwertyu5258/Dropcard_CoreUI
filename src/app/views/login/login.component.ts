import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'

import { CurrentUserService } from '../../services/current-user.service'
import { AuthService } from '../../services/auth.service'
import { User } from '../../models/user'

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

  loginInfo = {
    id: "",
    password: ""
  }

  error = {
    title: '로그인 실패',
    message: ''
  }

  public failureModal;

  @ViewChild('failureModalElemRef')
  failureModalElemRef: ElementRef

  constructor(private router:Router, private elementRef: ElementRef, private authService: AuthService, private currentUserService: CurrentUserService) { 

  }

  ngOnInit() {
  }

  login(loginInfo: any) {
    if (this.validation(loginInfo)) return
    this.authService.login(loginInfo).subscribe(data => {
      this.authService.check().subscribe(data => {
        if (data.authority == 'pending') {
          this.authService.logout()

          this.error.message = '승인 대기중인 아이디입니다.'
          this.failureModalElemRef.nativeElement.dispatchEvent(new Event('click'))
        } else {
          // this.router.navigateByUrl('/monitoring')
          this.router.navigate(['/monitoring'], { replaceUrl: true })
        }
      })
    }, e => {
      // console.log(e.result)
      console.log(e)
      if (e.message === 'user does not exist') {
        this.error.message = '존재하지 않는 아이디입니다.'
      } else if (e.message === 'invalid password') {
        this.error.message = '유효하지 않은 비밀번호입니다.'
      }
      this.failureModalElemRef.nativeElement.dispatchEvent(new Event('click'))
    })
  }

  validation(loginInfo: any) {
    let flag = false
    
    if (loginInfo.id == '') {
      flag = true
      this.error.message = '아이디를 입력해주세요.'
    } else if (loginInfo.password == '') {
      flag = true
      this.error.message = '비밀번호를 입력해주세요'  
    }

    if (flag) this.failureModalElemRef.nativeElement.dispatchEvent(new Event('click'))

    return flag
  }

  modalKeydownEnter() {
    this.elementRef.nativeElement.querySelector('#faiureModalCloseBtn').dispatchEvent(new Event('click'))    
  }
}
