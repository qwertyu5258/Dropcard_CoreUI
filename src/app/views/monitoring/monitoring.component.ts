import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Renderer } from '@angular/core';

import { InfluxService } from '../../services/influx.service'
import { CurrentUserService } from '../../services/current-user.service'
import { AlarmListService } from '../../services/alarm-list.service'
import { FavoriteDevicesService } from '../../services/favorite-devices.service'
import { UtilsService } from '../../services/utils.service'
import { FavoriteDevice, InnerDevice, AlarmConfig, ExpandGraph } from 'app/models/favorite-device';
import { Alarm, InnerAlarm } from 'app/models/alarm';

import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component({
  templateUrl: 'monitoring.component.html'
})
export class MonitoringComponent implements OnInit, OnDestroy {
  today

  alarmList: Alarm[]

  favoriteDevices: FavoriteDevice[]
  selectedDevice: InnerDevice
  user_id: string

  public tagModal;
  public alarmModal;

  intervalId

  @ViewChild('tagModalElemRef')
  tagModalElemRef: ElementRef

  @ViewChild('alarmModalElemRef')
  alarmModalElemRef: ElementRef

  @ViewChild('expandChart')
  expandChart: BaseChartDirective;

  @ViewChild('thumbnailChart')
  thumbnailChart: BaseChartDirective;

  constructor(private renderer: Renderer,
    private favoriteDevicesService: FavoriteDevicesService,
    private alarmListService: AlarmListService,
    private elementRef: ElementRef,
    private currentUserService: CurrentUserService,
    private influxService: InfluxService,
    private utilsService: UtilsService) {

    this.today = this.utilsService.dateFormating(new Date(), '#YYYY#년 #MM#월 #DD#일')
    this.selectedDevice = new InnerDevice()
    this.selectedDevice.alarm = new AlarmConfig()
  }

  ngOnInit() {
    this.user_id = this.currentUserService.getId()
    this.favoriteDevices = this.favoriteDevicesService.getFavoriteDevices()

    if (this.favoriteDevices.length == 0) {
      let temp: FavoriteDevice = {
        user_id: this.user_id,
        devices: []
      }
      this.favoriteDevices.push(temp)
    }
    
    this.favoriteDevicesService.setFavoriteDevices(JSON.stringify(this.favoriteDevices[0]))


    this.alarmList = this.alarmListService.getAlarmList()

    if (this.alarmList.length == 0) {
      let temp: Alarm = {
        user_id: this.user_id,
        alarms: []
      }
      this.alarmList.push(temp)
    }

    this.alarmListService.setAlarmList(JSON.stringify(this.alarmList[0]))

    console.log('monitoring ngOnInit')
    // generate random values for mainChart
    // for (let i = 0; i <= this.mainChartElements; i++) {
    //   this.mainChartData1.push(this.random(50, 200));
    //   this.mainChartData2.push(this.random(80, 100));
    //   this.mainChartData3.push(65);
    // }

    
    setTimeout(() => {
      this.realTime(1)
    }, 0)


    // console.log(this.favoriteDevices[0].devices)
  }

  realTime(cmd) {
    
    if (cmd == 1) {
      console.log('realTime(1)')
      this.favoriteDevices[0].devices.forEach( (innerDevice:InnerDevice, index) => {
        // innerDevice.expandGraph = new ExpandGraph()
  
        this.influxService.getTimeInfo(innerDevice.id, 5).subscribe( data => {
          if (innerDevice.isExpanded == true) {
            innerDevice.expandGraph.mainChartLabels = data.label

            innerDevice.expandGraph.mainChartData[0].data = data.total_weight
            innerDevice.expandGraph.mainChartData[0].label = 'ml'

            innerDevice.expandGraph.mainChartData[1].data = data.weight
            innerDevice.expandGraph.mainChartData[1].label = 'ml/h'

          } else {
            innerDevice.thumbnailGraph.lineChartLabels = data.label.slice(-7)
            innerDevice.thumbnailGraph.lineChartData[0].data = data.total_weight.slice(-7)
            innerDevice.thumbnailGraph.lineChartData[0].label = 'ml'
            innerDevice.thumbnailGraph.lineChartData[1].data = data.weight.slice(-7)
            innerDevice.thumbnailGraph.lineChartData[1].label = 'ml/h'
          }

          this.alarmCheck(innerDevice, data)
        })
   
      })
      this.intervalId = setInterval(() => {
        this.realTime(2)
      }, 5000);
    }

    if (cmd == 2) {
      console.log('realTime(2)')
          
      this.favoriteDevices[0].devices.forEach( (innerDevice:InnerDevice, index) => {
  
        this.influxService.getTimeInfo(innerDevice.id, 5).subscribe( data => {
          if (innerDevice.isExpanded == true) {
            innerDevice.expandGraph.mainChartLabels = data.label

            innerDevice.expandGraph.mainChartData[0].data = data.total_weight
            innerDevice.expandGraph.mainChartData[0].label = 'ml'

            innerDevice.expandGraph.mainChartData[1].data = data.weight
            innerDevice.expandGraph.mainChartData[1].label = 'ml/h'

            if(this.expandChart.chart) this.expandChart.chart.update() 
          } else {
            innerDevice.thumbnailGraph.lineChartLabels = data.label.slice(-7)

            innerDevice.thumbnailGraph.lineChartData[0].data = data.total_weight.slice(-7)
            innerDevice.thumbnailGraph.lineChartData[0].label = 'ml'

            innerDevice.thumbnailGraph.lineChartData[1].data = data.weight.slice(-7)
            innerDevice.thumbnailGraph.lineChartData[1].label = 'ml/h'
            
            if(this.thumbnailChart.chart) this.thumbnailChart.chart.update()
          }
          this.alarmCheck(innerDevice, data)
        })
        
   
      })
    }

  }

  alarmCheck(device: InnerDevice, data: any) {
    console.log('* alarmCheck')
    if ( data.weight.slice(-2)[0] != 0 || data.total_weight.slice(-2)[0] != 0) {
      let flag = false

      if (data.total_weight.slice(-2)[0] > device.alarm.total_weight_value ) {
        if (this.alarmList[0].alarms.filter( item => { return item.time == this.today + ' ' + data.label.slice(-2)[0] && item.tag == device.tag && item.code == '01' }).length == 0) {
          this.alarmList[0].alarms.push(new InnerAlarm('Danger', this.today + ' ' + data.label.slice(-2)[0], device.tag, '목표 무게: ' + device.alarm.total_weight_value + '(ml)를 초과하였습니다.', '01'))
          console.log('--> ' + 'Danger, ' + this.today + ' ' + data.label.slice(-2)[0] + ', ' + device.tag + ', 목표 무게: ' + device.alarm.total_weight_value + '(ml)를 초과하였습니다. ' + '01')
          flag = true
        }
      }
  
      if ( data.weight.slice(-2)[0] < device.alarm.weight_value_from ) {
        if (this.alarmList[0].alarms.filter( item => { return item.time == this.today + ' ' + data.label.slice(-2)[0] && item.tag == device.tag && item.code == '02'}).length == 0) {
          this.alarmList[0].alarms.push(new InnerAlarm('Danger', this.today + ' ' + data.label.slice(-2)[0], device.tag, '시간당 무게량이 최저 기준치인 ' + device.alarm.weight_value_from + '(ml/h) 미만입니다.', '02'))
          console.log('--> ' + 'Danger, ' + this.today + ' ' + data.label.slice(-2)[0] + ', ' + device.tag + ', 시간당 무게량이 최저 기준치인 ' + device.alarm.weight_value_from + '(ml/h) 미만입니다. ', '02')
          flag = true
        }
      }
  
      if ( data.weight.slice(-2)[0] > device.alarm.weight_value_to ) {
        if (this.alarmList[0].alarms.filter( item => { return item.time == this.today + ' ' + data.label.slice(-2)[0] && item.tag == device.tag && item.code == '03'}).length == 0) {
          this.alarmList[0].alarms.push(new InnerAlarm('Danger', this.today + ' ' + data.label.slice(-2)[0], device.tag, '시간당 무게량이 최고 기준치인 ' + device.alarm.weight_value_to + '(ml/h)를 초과하였습니다.', '03'))
          console.log('--> ' + 'Danger, ' + this.today + ' ' + data.label.slice(-2)[0] + ', ' + device.tag + ', 시간당 무게량이 최고 기준치인 ' + device.alarm.weight_value_to + '(ml/h)를 초과하였습니다. ' + '03')
          flag = true
        }
        
      }

      if (flag) {
        this.alarmListService.newFlag.state = true
      }

      this.alarmList[0].alarms = this.alarmList[0].alarms.sort( (a, b) => { return a.time.localeCompare(b.time) } ).reverse()
      this.alarmListService.fiveAlarms.list = this.alarmList[0].alarms.slice(0, 5)
      this.alarmListService.setAlarmList(JSON.stringify(this.alarmList[0]))

    }

  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    console.log('monitoring ngOnDestroy')
  }

  tag(innerDevice: InnerDevice) {
    this.selectedDevice.type = innerDevice.type
    this.selectedDevice.id = innerDevice.id
    this.selectedDevice.tag = innerDevice.tag
    // this.selectedDevice.alarm = innerDevice.alarm
    Object.assign(this.selectedDevice.alarm, innerDevice.alarm);

    let tagModalElemRef = this.tagModalElemRef.nativeElement
    tagModalElemRef.dispatchEvent(new Event('click'))
  }

  tagSave() {
    let i = this.favoriteDevices[0].devices.map((innerDevice, index) => { return innerDevice.type + '#' + innerDevice.id }).indexOf(this.selectedDevice.type + '#' + this.selectedDevice.id)

    this.favoriteDevices[0].devices[i].tag = this.selectedDevice.tag

    this.favoriteDevicesService.setFavoriteDevices(JSON.stringify(this.favoriteDevices[0]))

    // let tagModalElemRef =  this.tagModalElemRef.nativeElement.parentNode
    // tagModalElemRef.querySelector('#modalClose').dispatchEvent(new Event('click'))
    this.elementRef.nativeElement.querySelector('#tagClose').dispatchEvent(new Event('click'))
  }

  alarm(innerDevice: InnerDevice) {
    this.selectedDevice.type = innerDevice.type
    this.selectedDevice.id = innerDevice.id
    this.selectedDevice.tag = innerDevice.tag
    Object.assign(this.selectedDevice.alarm, innerDevice.alarm);
    let alarmModalElemRef = this.alarmModalElemRef.nativeElement
    alarmModalElemRef.dispatchEvent(new Event('click'))
  }

  sliderFinish(type, e) {
    if (type === 'total_weight') {
      this.selectedDevice.alarm.total_weight_value = e.from
    }

    if (type === 'weight') {
      this.selectedDevice.alarm.weight_value_from = e.from
      this.selectedDevice.alarm.weight_value_to = e.to
    }
  }

  alarmSave() {
    let i = this.favoriteDevices[0].devices.map((innerDevice, index) => { return innerDevice.type + '#' + innerDevice.id }).indexOf(this.selectedDevice.type + '#' + this.selectedDevice.id)
    console.log(this.selectedDevice.alarm)
    Object.assign(this.favoriteDevices[0].devices[i].alarm, this.selectedDevice.alarm);
    // this.favoriteDevices[0].devices[i].alarm = this.selectedDevice.alarm

    this.favoriteDevicesService.setFavoriteDevices(JSON.stringify(this.favoriteDevices[0]))

    this.elementRef.nativeElement.querySelector('#alarmClose').dispatchEvent(new Event('click'))
  }

  toExpand(innerDevice:InnerDevice, i: number, event: any) {
    let thumbnail = this.elementRef.nativeElement.querySelectorAll('.thumbnail')[i]
    this.renderer.setElementStyle(thumbnail, 'display', 'none')

    let expand = this.elementRef.nativeElement.querySelectorAll('.expand')[i]
    this.renderer.setElementStyle(expand, 'display', 'inline-block')
    this.renderer.setElementClass(expand, 'animated', true)
    this.renderer.setElementClass(expand, 'fadeIn', true)
  }

  toThumbnail(innerDevice:InnerDevice, i: number, event: any) {
    let expand = this.elementRef.nativeElement.querySelectorAll('.expand')[i]
    this.renderer.setElementStyle(expand, 'display', 'none')

    let thumbnail = this.elementRef.nativeElement.querySelectorAll('.thumbnail')[i]
    this.renderer.setElementStyle(thumbnail, 'display', 'inline-block')
    this.renderer.setElementClass(thumbnail, 'animated', true)
    this.renderer.setElementClass(thumbnail, 'fadeIn', true)
  }

  toExpand2(innerDevice:InnerDevice, i: number, event: any) {
    innerDevice.isExpanded = true
    let index = this.favoriteDevices[0].devices.map((innerDevice, index) => { return innerDevice.type + '#' + innerDevice.id }).indexOf(innerDevice.type + '#' + innerDevice.id)
    Object.assign(this.favoriteDevices[0].devices[index], innerDevice)
    let temp: InnerDevice[] = []
    Object.assign(temp, this.favoriteDevices[0].devices)
    
    this.favoriteDevices[0].devices = []
    Object.assign(this.favoriteDevices[0].devices, temp)

    this.favoriteDevicesService.setFavoriteDevices(JSON.stringify(this.favoriteDevices[0]))
  }

  toThumbnail2(innerDevice:InnerDevice, i: number, event: any) {
    innerDevice.isExpanded = false
    let index = this.favoriteDevices[0].devices.map((innerDevice, index) => { return innerDevice.type + '#' + innerDevice.id }).indexOf(innerDevice.type + '#' + innerDevice.id)
    Object.assign(this.favoriteDevices[0].devices[index], innerDevice)
    let temp: InnerDevice[] = []
    Object.assign(temp, this.favoriteDevices[0].devices)
    
    this.favoriteDevices[0].devices = []
    Object.assign(this.favoriteDevices[0].devices, temp)

    this.favoriteDevicesService.setFavoriteDevices(JSON.stringify(this.favoriteDevices[0]))
  }

  

  mousemove(e) {
    console.log(e)
  }



}
