import { Injectable } from '@angular/core'

@Injectable()
export class CurrentUserService {
    name: string = 'currentUser'

    setCurrentUser(obj: string) {
        return localStorage.setItem(this.name, obj)
    }

    getCurrentUser() {
        return localStorage.getItem(this.name)
    }

    getId() {
        return JSON.parse(localStorage.getItem(this.name)).id
    }

    getHospital() {
        return JSON.parse(localStorage.getItem(this.name)).hospital
    }

    getAuthority() {
        return JSON.parse(localStorage.getItem(this.name)).authority
    }

    getToken() {
        return JSON.parse(localStorage.getItem(this.name)).token
    }

    remove() {
        localStorage.removeItem(this.name)
    }
}