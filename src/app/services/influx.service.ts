import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions } from '@angular/http'
import { Observable } from 'rxjs/Observable'

import { CurrentUserService } from './current-user.service'

@Injectable()
export class InfluxService {
    // host = 'http://192.168.1.4:3002'
    host = 'http://106.10.121.77:3002'
    // host = 'http://dropcare.co.kr:3002'

    constructor(private http: Http, private currentUserService: CurrentUserService) { }

    getTimeInfo(id:string, time: number) {
        let api = '/api/influxdb/time/' + id + '/' + time
        let url = this.host + api

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        let token = this.currentUserService.getToken()
        headers.append('x-access-token', token)

        return this.http.get(url, {headers: headers})
            // .timeout(5000)
            // .timeout(10000)
            .map(res => res.json())
            .catch( (e) => {
                return Observable.throw(
                    JSON.parse(e._body)
                )
            })          
    }

    getDayInfo(id:string, startDate:string, endDate:string) {
        let api = '/api/influxdb/day/' + id + '/' + startDate + '/' + endDate
        let url = this.host + api

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        let token = this.currentUserService.getToken()
        headers.append('x-access-token', token)

        return this.http.get(url, {headers: headers})
            .map(res => res.json())
            .catch( (e) => {
                return Observable.throw(
                    JSON.parse(e._body)
                )
            })
    }

    
}