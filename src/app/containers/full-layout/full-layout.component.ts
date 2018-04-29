import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { CurrentUserService } from '../../services/current-user.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {

  constructor(private router: Router, private currentUserService: CurrentUserService) { }

  ngOnInit() {

  }
  
  mainTouch() {
    console.log('mainTouch')
    document.querySelector('body').classList.remove('sidebar-mobile-show');
    // document.querySelector('body').classList.toggle('sidebar-mobile-show');
  }
}
