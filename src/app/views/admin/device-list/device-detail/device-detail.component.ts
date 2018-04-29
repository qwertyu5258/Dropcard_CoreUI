import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FavoriteDevicesService } from '../../../../services/favorite-devices.service'
import { UtilsService } from '../../../../services/utils.service'
import { DevicesService } from '../../../../services/devices.service'
import { Device } from 'app/models/device';

@Component({
  templateUrl: './device-detail.component.html'
})
export class DeviceDetailComponent implements OnInit {

  id: string
  device: Device
  updateDevice: Device

  types: string[] = ['DropCare_A', 'DropCare_B'];

  constructor(private router: Router,
  private activatedRouter: ActivatedRoute,
  private utilsService: UtilsService,
  private devicesService: DevicesService,
  private favoriteDevicesService: FavoriteDevicesService) {
    this.device = new Device()
    this.updateDevice = new Device()
  }
  
  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      this.id = params['id']
      
      this.devicesService.getDevice(this.id).subscribe(data => {
        data = data.devices[0]
        
        this.device.id = data.id
        this.device.type = data.type
        this.device.hospital = data.hospital
        this.device.manager = data.manager
        this.device.update = this.utilsService.dateFormating(new Date(data.update), '#YYYY#-#MM#-#DD# #hh#:#mm#:#ss#')
      })
    })
  }

  update() {
    this.updateDevice.id = this.device.id
    this.updateDevice.type = this.device.type
    this.devicesService.updateDevice(this.updateDevice, this.device.id).subscribe(data => {
      console.log(data)
      this.favoriteDevicesService.removeFavoriteDeviceForAllUsers(this.updateDevice.id)
      this.router.navigateByUrl('/admin/device-list')
    }, e => {
      console.log(e.result)
    })
  }
}

