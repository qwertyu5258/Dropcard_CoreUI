import { Component, OnInit, OnDestroy } from '@angular/core';

import { FavoriteDevicesService } from '../../services/favorite-devices.service'
import { FavoriteDevice, InnerDevice, AlarmConfig, ExpandGraph } from 'app/models/favorite-device';

@Component({
  templateUrl: 'test3.component.html'
})
export class Test3Component implements OnInit {

  innerDevice: InnerDevice[]

  constructor(private favoriteDevicesService: FavoriteDevicesService) { }

  ngOnInit() {
    this.innerDevice = this.favoriteDevicesService.getFavoriteDevices()[0].devices

  }

  
}
