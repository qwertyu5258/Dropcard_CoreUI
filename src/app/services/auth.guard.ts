import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CurrentUserService } from './current-user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private currentUserService: CurrentUserService, private router: Router) {}

  canActivate() {

    if (this.currentUserService.getCurrentUser()) {
      return true
    } else {
      this.router.navigateByUrl('/login')
      return false
    }
  }
}