import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CurrentUserService } from '../../services/current-user.service'
import { FavoriteDevicesService } from '../../services/favorite-devices.service'
import { DevicesService } from '../../services/devices.service'

import { FavoriteDevice, InnerDevice, AlarmConfig } from 'app/models/favorite-device';
import { Device } from 'app/models/device';
import { AlarmComponent } from 'app/views/alarm/alarm.component';

@Component({
  templateUrl: 'favorite.component.html'
})
export class FavoriteComponent implements OnInit {

  devices: Device[]
  totalPage: number[] = []
  devicesCount: number
  rowPerPage: number = 10
  currentPage: number

  favoriteDevices: FavoriteDevice[]
  // user_id: string
  hospital: string

  constructor(private devicesService: DevicesService,
    private favoriteDevicesService: FavoriteDevicesService,
    private currentUserService: CurrentUserService) { }

  ngOnInit() {
    // this.user_id = this.currentUserService.getId()
    this.hospital = this.currentUserService.getHospital()
    this.favoriteDevices = this.favoriteDevicesService.getFavoriteDevices()
    // if (this.favoriteDevices.length == 0) {
    //   let temp:FavoriteDevice = {
    //     user_id: this.user_id,
    //     devices: []
    //   }
    //   this.favoriteDevices.push(temp)
    // }

    this.loadData(1)
    this.loadPage()
  }

  loadData(page:number) {
    this.currentPage = page
    this.devices = []
    this.devicesService.getDevices(page, 10).subscribe(data => {
      data.devices.forEach( (item, index) => {
        let device = new Device()

        device.id = item.id
        device.type = item.type

        if (this.favoriteDevices[0].devices.map( innerDevice => { return innerDevice.id }).indexOf(item.id) !== -1) {
          device.used = true
        } else {
          device.used = false
        }

        this.devices.push(device)
      })

    }, e => {
      console.log(e.result)
    })

  }

  loadPage() {
    this.totalPage = []
    this.devicesCount = this.devicesService.devicesCount.cnt
    let cnt = Math.ceil( this.devicesCount / this.rowPerPage)
    
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


  switch(device: Device, e) {
    if(e.target.checked) {
      let innerDevice: InnerDevice = new InnerDevice()
      innerDevice.type = device.type
      innerDevice.id = device.id
      innerDevice.tag = this.hospital + '#' + device.type + '#' + device.id
      innerDevice.isExpanded = false
      innerDevice.alarm = new AlarmConfig()
      
      this.favoriteDevices[0].devices.push(innerDevice)
    } else {
      this.favoriteDevices[0].devices = this.favoriteDevices[0].devices.filter( innerDevice => {
        return innerDevice.id !== device.id
      })
    }
    this.favoriteDevicesService.setFavoriteDevices(JSON.stringify(this.favoriteDevices[0]))

    console.log(this.favoriteDevicesService.getFavoriteDevicesAll())
  }

}
 