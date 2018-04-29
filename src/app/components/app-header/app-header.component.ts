import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { CurrentUserService } from '../../services/current-user.service'
import { UsersService } from '../../services/users.service'
import { DevicesService } from '../../services/devices.service'
import { AuthService } from '../../services/auth.service'

import { AlarmListService } from '../../services/alarm-list.service'

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent implements OnInit  { 
  
  id: string
  authority: string

  usersCount
  devicesCount 

  newFlag
  alarms

  constructor(private router: Router, 
    private currentUserService: CurrentUserService, 
    private authService: AuthService, 
    private usersService: UsersService,
    private devicesService: DevicesService,
    private alarmListService: AlarmListService){ 
  }

  ngOnInit() {
    this.id = this.currentUserService.getId()
    this.authority = this.currentUserService.getAuthority()
     
    this.usersService.getUsersCount().subscribe(data => {
      this.usersService.usersCount.cnt = data.count
      this.usersCount = this.usersService.usersCount
    }, e => {
      console.log(e.result)
    })
    this.devicesService.getDevicesCount().subscribe(data => {
      this.devicesService.devicesCount.cnt = data.count
      this.devicesCount = this.devicesService.devicesCount
    }, e => {
      console.log(e.result)
    })
    
    this.newFlag = this.alarmListService.newFlag
    this.alarms = this.alarmListService.fiveAlarms
  }

  alarm() {
    console.log(this.alarmListService.newFlag.state)
    this.alarmListService.newFlag.state = false
  }

  logout() {
    this.authService.logout()
    this.router.navigateByUrl('/')
  }
}
