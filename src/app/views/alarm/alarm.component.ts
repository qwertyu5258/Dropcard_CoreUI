import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlarmListService } from '../../services/alarm-list.service'
import { Alarm, InnerAlarm } from 'app/models/alarm';

@Component({
  templateUrl: 'alarm.component.html'
})
export class AlarmComponent implements OnInit {

  alarmList: Alarm[]

  totalPage: number[]
  alarmCount: number
  rowPerPage: number
  currentPage: number
  currentPageAlarms: InnerAlarm[]

  constructor(private alarmListService: AlarmListService) { }

  ngOnInit() {
    this.alarmList = this.alarmListService.getAlarmList()
    // this.alarmList[0].alarms = this.alarmList[0].alarms.reverse()

    this.alarmCount = this.alarmList[0].alarms.length
    this.rowPerPage = 10
    this.currentPage = 1

    this.loadData(1)
    this.loadPage()
  }

  loadData(page:number) {
    this.currentPage = page
    this.currentPageAlarms = this.alarmList[0].alarms.slice((page-1) * this.rowPerPage, (page * this.rowPerPage))
  }
  
  loadPage() {
    this.totalPage = [] 
    let cnt = Math.ceil( this.alarmCount / this.rowPerPage)
    
    for (var i = 1; i <= cnt; i++ ) {
      this.totalPage.push(i)
    }
  }

  prev() {
    if(this.currentPage > 1) {
      this.loadData(this.currentPage - 1)
    }
  }

  next() {
    if(this.currentPage < this.totalPage.length ) {
      this.loadData(this.currentPage + 1)
    }
  }
}
