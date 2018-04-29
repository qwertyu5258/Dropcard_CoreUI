import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { CurrentUserService } from './current-user.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private currentUserService: CurrentUserService) {}

  canActivate() {
    return (this.currentUserService.getAuthority() == 'admin')? true: false
  }
}