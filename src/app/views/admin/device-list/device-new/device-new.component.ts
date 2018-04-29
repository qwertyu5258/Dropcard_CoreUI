import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { CurrentUserService } from '../../../../services/current-user.service'
import { DevicesService } from '../../../../services/devices.service'
import { Device } from 'app/models/device';

@Component({
  templateUrl: './device-new.component.html'
})
export class DeviceNewComponent {

  device: Device

  types: string[] = ['DropCare_A', 'DropCare_B'];

  error = {
    title: '장비 추가 실패',
    message: ''
  }
  public failureModal;
  
  @ViewChild('failureModalElemRef')
  failureModalElemRef: ElementRef

  constructor(private router: Router,
  private devicesService: DevicesService,
  private currentUserService: CurrentUserService,
  private elementRef: ElementRef) {
    this.device = new Device()
    this.device.type = this.types[0]
    this.device.manager = this.currentUserService.getId()
  }

  create() {
    if (this.validation()) return
    
    this.devicesService.create(this.device).subscribe(data => {
      console.log(data)
      this.devicesService.devicesCount.cnt += 1
      this.router.navigateByUrl('/admin/device-list')
    }, e => {
      console.log(e.result)
    })
  }

  validation() {
    let flag = false
    
    if (!this.device.id) {
      flag = true
      this.error.message = '장비 아이디를 입력하세요.'
    }

    if (flag) this.failureModalElemRef.nativeElement.dispatchEvent(new Event('click'))

    return flag
  }

  modalKeydownEnter() {
    this.elementRef.nativeElement.querySelector('#faiureModalCloseBtn').dispatchEvent(new Event('click'))    
  }

}
