import { Injectable } from '@angular/core'
import { CurrentUserService } from '../services/current-user.service'
import { FavoriteDevice, InnerDevice, AlarmConfig } from 'app/models/favorite-device';

@Injectable()
export class FavoriteDevicesService {
    name: string = 'favoriteDevices'
    
    zIndex = 0

    constructor(private currentUserService: CurrentUserService) {
    }

    getFavoriteDevicesAll() {
        return JSON.parse(localStorage.getItem(this.name))
    }
    getFavoriteDevices() {
        if(!localStorage.getItem(this.name)) {
            localStorage.setItem(this.name, JSON.stringify([]))
        }

        return JSON.parse(localStorage.getItem(this.name)).filter( device => {
            return device.user_id === this.currentUserService.getId()
        })
    }

    setFavoriteDevices(obj: string) {
        let temp = JSON.parse(localStorage.getItem(this.name)).filter( device => {
            return device.user_id !== this.currentUserService.getId()
        })
        temp.push(JSON.parse(obj))
        return localStorage.setItem(this.name, JSON.stringify(temp))
    }

    removeFavoriteDeviceForAllUsers(id: string) {
        let temp: FavoriteDevice[] = []
        JSON.parse(localStorage.getItem(this.name)).forEach( (user, index) => {
            user.devices = user.devices.filter( innerDevice => {
                return innerDevice.id !== id
            })
            temp.push(user)
        })
        localStorage.setItem(this.name, JSON.stringify(temp))
    }

}