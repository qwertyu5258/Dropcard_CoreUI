import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UtilsService } from '../../../services/utils.service'
import { DevicesService } from '../../../services/devices.service'
import { FavoriteDevicesService } from '../../../services/favorite-devices.service'
import { Device } from 'app/models/device';

@Component({
  templateUrl: './device-list.component.html'
})
export class DeviceListComponent implements OnInit {

  devices: Device[]
  totalPage: number[] = []
  devicesCount: number
  rowPerPage: number = 10
  currentPage: number

  constructor(private router: Router, private utilsService: UtilsService, private devicesService: DevicesService, private favoriteDevicesService: FavoriteDevicesService) { }

  ngOnInit() {
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
        device.hospital = item.hospital
        device.update = this.utilsService.dateFormating(new Date(item.update), '#YYYY#-#MM#-#DD# #hh#:#mm#:#ss#')
        device.manager = item.manager
     
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

  create() {
    this.router.navigateByUrl('/admin/device-list/device-new')
  }
  update(id: string) {
    this.router.navigateByUrl('/admin/device-list/device-detail/' + id)
  }

  delete(id: string) {
    this.devicesService.deleteDevice(id).subscribe(data => {     
      this.devices = this.devices.filter(function(device){
        return device.id !== id;
      })
      this.devicesService.devicesCount.cnt -= 1
      this.loadPage()
      
      this.favoriteDevicesService.removeFavoriteDeviceForAllUsers(id)

    }, e => {
      console.log(e.result)
    })
  }
  
}
