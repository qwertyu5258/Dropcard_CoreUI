import { Component, OnInit } from '@angular/core';
import { FavoriteDevicesService } from '../../services/favorite-devices.service'
import { InnerDevice } from 'app/models/favorite-device';

@Component({
  templateUrl: 'test6.component.html'
})
export class Test6Component implements OnInit {

  innerDevice: InnerDevice[]

  constructor(private favoriteDevicesService: FavoriteDevicesService) { }

  ngOnInit() {
    this.innerDevice = this.favoriteDevicesService.getFavoriteDevices()[0].devices
  }
}
