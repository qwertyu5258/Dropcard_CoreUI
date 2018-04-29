import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions } from '@angular/http'
import { Observable } from 'rxjs/Observable'

import { CurrentUserService } from './current-user.service'
import { User } from '../models/user'

@Injectable()
export class UsersService {
    // host = 'http://192.168.1.4:3002'
    host = 'http://106.10.121.77:3002'
    // host = 'http://dropcare.co.kr:3002'

    public usersCount = {
        cnt: 0
    }
    
    constructor(private http: Http, private currentUserService: CurrentUserService) {}

    /*
        GET /api/users/count
    */
    getUsersCount(): Observable<any> {
        let api = '/api/users/count'
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
        GET /api/users/list/:pageNo/:limit
    */
    getUsers(pageNo: number, limit: number): Observable<any> {
        let api = '/api/users/list/' + pageNo + '/' + limit
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
        GET /api/users/user/:id
    */
    getUser(id): Observable<any> {
        let api = '/api/users/user/' + id
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
        PUT /api/users/user/:id
    */
    updateUser(user: User, id): Observable<any> {
        
        let api = '/api/users/user/' + id
        let url = this.host + api

        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        let token = this.currentUserService.getToken()
        headers.append('x-access-token', token)
        
        return this.http.put(url, user, {headers: headers})
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
        DELETE /api/users/user/:id
    */
    deleteUser(id) {
        
        let api = '/api/users/user/' + id
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