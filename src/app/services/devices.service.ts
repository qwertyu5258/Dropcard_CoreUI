import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions } from '@angular/http'
import { Observable } from 'rxjs/Observable'

import { CurrentUserService } from './current-user.service'
import { Device } from '../models/device'

@Injectable()
export class DevicesService {
    // host = 'http://192.168.1.4:3002'
    host = 'http://106.10.121.77:3002'
    // host = 'http://dropcare.co.kr:3002'

    public devicesCount = {
        cnt: 0
    }

    constructor(private http: Http, private currentUserService: CurrentUserService) {}

    /*
        GET /api/devices/count
    */
    getDevicesCount(): Observable<any> {
        let api = '/api/devices/count'
        let url = this.host + api

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        let token = this.currentUserService.getToken()
        headers.append('x-access-token', token)

        return this.http.get(url, {headers: headers})
            .timeout(5000)
            .map(res => res.json())
            .catch( (e) => {
                return Observable.throw(
                    JSON.parse(e._body)
                )
            })
    }

    /*
        GET /api/devices/list/:pageNo/:limit
    */
    getDevices(pageNo: number, limit: number): Observable<any> {
        let api = '/api/devices/list/' + pageNo + '/' + limit
        let url = this.host + api

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        let token = this.currentUserService.getToken()
        headers.append('x-access-token', token)

        return this.http.get(url, {headers: headers})
            .timeout(5000)
            .map(res => res.json())
            .catch( (e) => {
                return Observable.throw(
                    JSON.parse(e._body)
                )
            })
    }

    /*
        GET /api/devices/device/:id
    */
    getDevice(id): Observable<any> {
        let api = '/api/devices/device/' + id
        let url = this.host + api
        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        let token = this.currentUserService.getToken()
        headers.append('x-access-token', token)

        
        return this.http.get(url, {headers: headers})
            .timeout(5000)
            .map(res => res.json())
            .catch( (e) => {
                return Observable.throw(
                    JSON.parse(e._body)
                )
            })
    }

    /*
        POST /api/devices/device
        {
            type,
            id,
            hospital
        }
    */
    create(device: Device): Observable<any> {
        let api = '/api/devices/device'
        let url = this.host + api

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        let token = this.currentUserService.getToken()
        headers.append('x-access-token', token)
        
        return this.http.post(url, device, {headers: headers})
            .timeout(5000)
            .map(res => res.json())
            .catch( (e) => {
                return Observable.throw(
                    JSON.parse(e._body)
                )
            })
    }

    /*
        PUT /api/devices/device/:id
    */
    updateDevice(device: Device, id): Observable<any> {
        
        let api = '/api/devices/device/' + id
        let url = this.host + api

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        let token = this.currentUserService.getToken()
        headers.append('x-access-token', token)
        
        return this.http.put(url, device, {headers: headers})
            .timeout(5000)
            .map(res => {
                return res.json()
            })
            .catch( (e) => {
                return Observable.throw(
                    JSON.parse(e._body)
                )
            })
    }

    /*
        DELETE /api/devices/device/:id
    */
    deleteDevice(id) {
        
        let api = '/api/devices/device/' + id
        let url = this.host + api

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        let token = this.currentUserService.getToken()
        headers.append('x-access-token', token)
        
        return this.http.delete(url, {headers: headers})
            .timeout(5000)
            .map(res => {
                return res.json()
            })
            .catch( (e) => {
                return Observable.throw(
                    JSON.parse(e._body)
                )
            })
    }

}