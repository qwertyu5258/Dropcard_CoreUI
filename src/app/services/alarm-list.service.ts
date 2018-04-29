import { Injectable } from '@angular/core'
import { CurrentUserService } from '../services/current-user.service'
import { Http, Headers, RequestOptions } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import { InnerAlarm } from 'app/models/alarm';


@Injectable()
export class AlarmListService {
    name: string = 'alarmList'
   
    public newFlag = {
        state: false
    }

    public fiveAlarms = {
        list: []
    }

    constructor(private currentUserService: CurrentUserService) {}

    getAlarmList() {
        if(!localStorage.getItem(this.name)) {
            localStorage.setItem(this.name, JSON.stringify([]))
        }

        return JSON.parse(localStorage.getItem(this.name)).filter( obj => {
            return obj.user_id === this.currentUserService.getId()
        })
    }

    setAlarmList(obj: string) {
        let temp = JSON.parse(localStorage.getItem(this.name)).filter( obj => {
            return obj.user_id !== this.currentUserService.getId()
        })
        temp.push(JSON.parse(obj))
        return localStorage.setItem(this.name, JSON.stringify(temp))
    }

}