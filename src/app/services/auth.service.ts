import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions } from '@angular/http'
import { Observable } from 'rxjs/Observable'

import { CurrentUserService } from './current-user.service'
import { User } from '../models/user'

@Injectable()
export class AuthService {
    // host = 'http://192.168.1.4:3002'
    host = 'http://106.10.121.77:3002'
    // host = 'http://dropcare.co.kr:3002'
    

    constructor(private http: Http, private currentUserService: CurrentUserService) {}

    /*
        POST /api/auth/register
        {
            id,
            password,
            authority, // pending, member, admin
            name,
            hospital,
            phone,
            email,
            etc,
            update
        }
    */
    register(user: User): Observable<any> {
        let api = '/api/auth/register'
        let url = this.host + api

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')

        return this.http.post(url, user, {headers: headers})
            .timeout(5000)
            .map(res => res.json())
            .catch( (e) => {
                return Observable.throw(
                    JSON.parse(e._body)
                )
            })
    }

    /*
        POST /api/auth/login
        {
            id,
            password
        }
    */
    login(loginInfo: any): Observable<any> {
        
        let api = '/api/auth/login'
        let url = this.host + api

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        
        return this.http.post(url, loginInfo, {headers: headers})
            .timeout(5000)
            .map(res => {
                this.currentUserService.setCurrentUser(JSON.stringify({token: res.json().token}))
                return res.json()
            })
            .catch( (e) => {
                return Observable.throw(
                    JSON.parse(e._body)
                )
            })
    }
    
    /*
        GET /api/auth/check
    */
    check(): Observable<any> {
        let api = '/api/auth/check'
        let url = this.host + api

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        let token = JSON.parse(localStorage.getItem('currentUser')).token
        headers.append('x-access-token', token)
        return this.http.get(url, {headers: headers})
            .timeout(5000)
            .map(res => {
                this.currentUserService.setCurrentUser(JSON.stringify({id: res.json().id, hospital: res.json().hospital, authority: res.json().authority, token: token}))
                return res.json()
            })
            .catch( (e) => {
                return Observable.throw(
                    JSON.parse(e._body)
                )
            })
    }

    logout() {
        // localStorage.clear()
        this.currentUserService.remove()
    }

    

}