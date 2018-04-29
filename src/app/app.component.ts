import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PlatformLocation, Location } from '@angular/common'

import { CurrentUserService } from './services/current-user.service'
import './rxjs-operators';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(private location: PlatformLocation, private router: Router, private currentUserService: CurrentUserService) {
    /*
    location.onPopState(() => {
      if (this.location.hash === '#/login') {
        this.currentUserService.remove()
        // this.location.forward()
      }
    });
    */

    location.onHashChange( () => {
      if(this.location.hash === '#/login' || this.location.hash === '#/') {
        this.currentUserService.remove()
        // this.location.back()
      }
    })
    
  }
  
  @HostListener("window:unload",["$event"])
  clearLocalStorage(event){
    // localStorage.clear()
    this.currentUserService.remove()
  }
}
