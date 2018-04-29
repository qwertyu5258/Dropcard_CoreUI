import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, Input } from '@angular/core'
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { Daterangepicker, DaterangepickerConfig } from 'ng2-daterangepicker'
import * as moment from 'moment'

import { InfluxService } from '../../../services/influx.service'
import { FavoriteDevicesService } from '../../../services/favorite-devices.service'
import { FavoriteDevice, InnerDevice, AlarmConfig, ExpandGraph } from 'app/models/favorite-device';

@Component({
  selector: 'my-card8',
  templateUrl: './my-card8.component.html',
  styleUrls: ['./my-card8.component.scss']
})

export class MyCard8Component implements OnInit, OnDestroy {

  currentTime = '1 day'

  isValid = true
  favoriteDevices: FavoriteDevice[]

  // drag
  isDrag = false
  top = 0
  left = 0

  // resize
  width
  height
  oldX = 0;
  oldY = 0;

  grabber = false;

  selectedTime
  times: string[] = ['1 hour', '1 day']


  @Input()
  device: InnerDevice

  @ViewChild('card')
  cardElemRef: ElementRef

  @ViewChild('frontChart')
  frontChart: BaseChartDirective;

  @ViewChild('frontRectangle')
  frontRectangle: ElementRef;

  thumbnail = false
  thumbnail_expand = false

  state
  tempX

  ml_value
  mlh_value

  frontMagnifier
  frontIntervalId
  frontState
  frontX1
  frontX2
  frontSelectedIndex = []
  frontSelectedData = []
  frontInitColor = []

  public frontChartType = 'line';
  public frontChartLegend = true;

  public frontChartOptions: any
  public frontChartOption1: any = {
    legend: {
      labels: {
        // boxWidth: 20,
        boxHeight: 1

      },
      // position: 'bottom'
    },
    
    scales: {
      xAxes: [
        {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 25
          },
          
          type: 'time',
          time: {
            parser: 'HH:mm',
            unit: 'minute',
            unitStepSize: 5,
            // round: 'minute',
            displayFormats: {
              // 'millisecond': 'HH:mm',
              // 'second': 'HH:mm',
              'minute': 'HH:mm',
              // 'hour': 'HH:mm',
              // 'day': 'HH',
              // 'week': 'HH',
              // 'month': 'HH',
              // 'quarter': 'HH',
              // 'year': 'HH',
            }
          }
        }
      ],
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
          scaleLabel: {
          },
          ticks: {
            beginAtZero: true,
            autoSkip: true,
            maxTicksLimit: 10,
            // stepSize: Math.ceil(250 / 5),
            // stepSize: 50,
            // max: 250
          }
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right',
          scaleLabel: {
          }
        }
      ]
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    reponsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      intersect: true,
    },
    animation: false
  }
  public frontChartOption2: any = {
    legend: {
      labels: {
        // boxWidth: 20,
        boxHeight: 1

      },
      // position: 'bottom'
    },
    scales: {
      xAxes: [
        {
          display: true,
          ticks: {
            fontColor: "#FFFFFF",
            fontSize: 11
          },
          // type: 'time',
          // time: {
          //   displayFormats: {
          //     // hour: 'M-D HH:00'
          //   }
          // }
          gridLines: {
            display: false,

          }
        }
      ],
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
          scaleLabel: {
          },
          gridLines: {
            display: true,
            color: "#FFFFFF",
            zeroLineColor: "#FFFFFF"
          },
          ticks: {
            fontColor: "#FFFFFF",
            fontSize: 11
          }
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right',
          scaleLabel: {
          },
          gridLines: {
            display: true,
            color: "#FFFFFF",
            zeroLineColor: "#FFFFFF"
          }, ticks: {
            fontColor: "#FFFFFF",
            fontSize: 11
          }
        }
      ]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 3,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    reponsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      intersect: true,
    },
    animation: false,
  }


  public frontChartColours: Array<any>
  public frontChartColours1: Array<any> = [
    {
      // backgroundColor: 'transparent',
      backgroundColor: 'rgba(66, 198, 221, 0.2)',
      borderColor: 'rgb(66, 198, 221)',
      label: 'ml',
      pointBackgroundColor: this.frontInitColor,
      // fill: false,
      yAxisID: 'y-axis-1'
    },
    {
      // backgroundColor: 'transparent',
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      borderColor: 'rgb(255, 0, 0)',
      label: 'ml/h',
      pointBackgroundColor: this.frontInitColor,
      // fill: false,
      yAxisID: 'y-axis-2'
    }
  ]
  public frontChartColours2: Array<any> = [
    {
      backgroundColor: 'transparent',
      // backgroundColor: 'rgba(66, 198, 221, 0.2)',
      // borderColor: 'rgb(66, 198, 221)',
      borderColor: 'rgb(255, 255, 255)',
      label: 'ml',
      // pointBackgroundColor: this.frontInitColor,
      pointBackgroundColor: 'rgba(42, 168, 212, 1)',
      // fill: false,
      yAxisID: 'y-axis-1'
    },
    {
      backgroundColor: 'transparent',
      // backgroundColor: 'rgba(255, 0, 0, 0.2)',
      borderColor: 'rgb(208, 211, 214)',
      label: 'ml/h',
      // pointBackgroundColor: this.frontInitColor,
      pointBackgroundColor: 'rgba(42, 168, 212, 1)',
      // fill: false,
      yAxisID: 'y-axis-2'
    }
  ]

  public frontChartLabels: Array<any> = []
  public frontChartData: Array<any> = [
    {
      data: [],
    },
    {
      data: []
    }
  ]

  @ViewChild('backChart')
  backChart: BaseChartDirective;

  @ViewChild('backRectangle')
  backRectangle: ElementRef;

  backMagnifier
  backIntervalId
  backState
  backX1
  backX2
  backSelectedIndex = []
  backSelectedData = []
  backInitColor = []

  public backChartType = 'line';
  public backChartLegend = true;
  public backChartOptions: any = {
    legend: {
      labels: {
        // boxWidth: 20,
        boxHeight: 1

      },
      // position: 'bottom'
    },
    scales: {
      xAxes: [
        {
          ticks: {},
          type: 'time',
          time: {
            displayFormats: {
              minute: 'HH:mm',
              hour: 'MM-DD HH:00'
            }
          }
        }
      ],
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
          scaleLabel: {
          },
          ticks: {
            beginAtZero: true,
            autoSkip: true,
            maxTicksLimit: 10,
            // max: 250
          }
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right',
          scaleLabel: {
          }
        }
      ]
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    reponsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      intersect: true,
    },
    animation: false
  }
  public backChartColours: Array<any> = [
    {
      // backgroundColor: 'transparent',
      backgroundColor: 'rgba(66, 198, 221, 0.2)',
      borderColor: 'rgb(66, 198, 221)',
      label: 'ml',
      pointBackgroundColor: this.backInitColor,
      // fill: false,
      yAxisID: 'y-axis-1'
    },
    {
      // backgroundColor: 'transparent',
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      borderColor: 'rgb(255, 0, 0)',
      label: 'ml/h',
      pointBackgroundColor: this.backInitColor,
      // fill: false,
      yAxisID: 'y-axis-2'
    }
  ]
  public backChartLabels: Array<any> = []
  public backChartData: Array<any> = [
    {
      data: [],
    },
    {
      data: []
    }
  ]

  public daterange: any = {};

  constructor(private favoriteDevicesService: FavoriteDevicesService, private elementRef: ElementRef, private daterangepickerConfig: DaterangepickerConfig, private influxService: InfluxService) {
    this.daterangepickerConfig.settings = {
      locale: { format: 'YYYY-MM-DD' },
      alwaysShowCalendars: false,
      ranges: {
        'Today': [moment(), moment()],
        'Last 1 week': [moment().subtract(1, 'week'), moment()],
        'Last 1 month': [moment().subtract(1, 'month'), moment()],
      }
    }

    this.favoriteDevices = this.favoriteDevicesService.getFavoriteDevices()
  }

  ngOnInit() {
    this.selectedTime = this.times[1]
    

    if (window.innerWidth > 1326) {
      this.width = this.device.width
      this.height = this.device.height
      
      if (this.device.dragged) {
        this.elementRef.nativeElement.style.position = 'absolute'
        this.elementRef.nativeElement.style.width = '0px'
        this.elementRef.nativeElement.style.height = '0px'
        this.elementRef.nativeElement.style.top = '0px'
        this.elementRef.nativeElement.style.left = '0px'
        this.top = this.device.top
        this.left = this.device.left
        // console.log('> ', this.top, this.left)
        this.elementRef.nativeElement.style.zIndex = this.device.zIndex
        

        if (this.device.zIndex > this.favoriteDevicesService.zIndex) {
          this.favoriteDevicesService.zIndex = this.device.zIndex
        }

        console.log(this.device.id + ' : ' + this.device.zIndex + ' : ' + this.favoriteDevicesService.zIndex)
      }

      this.frontChartOptions = this.frontChartOption1
      this.frontChartColours = this.frontChartColours1

      this.thumbnail = false

    } else if (window.innerWidth <= 1325) {
      // this.width = 375
      // this.height = 200
      this.width = 185
      this.height = 120

      this.frontChartOptions = this.frontChartOption2
      this.frontChartColours = this.frontChartColours2
      this.frontChartLegend = false

      this.elementRef.nativeElement.querySelector('.content').style.backgroundColor = 'rgba(42, 168, 212, 1)'

      this.thumbnail = true
    }

    this.realTime(this.selectedTime)
    // this.frontIntervalId = setInterval(() => {
    //   this.realTime(this.selectedTime)
    // }, 5000);


    this.dateChange({ start: moment().format('YYYY-MM-DD'), end: moment().format('YYYY-MM-DD') })
  }

  flip() {
    this.cardElemRef.nativeElement.classList.toggle('flipped')
  }

  frontPrevious() {
    this.realTime(this.selectedTime)
    this.frontIntervalId = setInterval(() => {
      this.realTime(this.selectedTime)
    }, 5000);
  }

  onChange(time) {
    clearInterval(this.frontIntervalId)
    this.realTime(time)
    this.frontIntervalId = setInterval(() => {
      this.realTime(time)
    }, 5000);
    this.currentTime = time
    console.log('onchange')
  }

  realTime(selectedTime) {
    this.frontMagnifier = false
    // console.log('realTime')

    if (this.thumbnail) {
      this.influxService.getTimeInfo(this.device.id, 1).subscribe(data => {
        data.label.forEach((item, index) => {
          this.frontInitColor.push('white')
        })
        
        
        this.frontChartLabels = data.label.slice(-10)
        this.frontChartData[0].data = data.total_weight.slice(-10)
        this.frontChartData[1].data = data.weight.slice(-10)

        if (this.frontChart.chart) this.frontChart.chart.update()

        this.ml_value = data.total_weight[data.total_weight.length - 2]
        this.mlh_value = data.weight[data.weight.length - 2]

        let now = moment().subtract('minute', 1).format('H:mm')
        let index = data.label.indexOf(now)
        this.ml_value = data.total_weight[index]
        this.mlh_value = data.weight[index]

        if (!this.ml_value || this.ml_value == "NaN") {
          console.log('2')
          this.ml_value = "-"
        }
        if (!this.mlh_value || this.mlh_value == "NaN") {
          this.mlh_value = "-"
        }
      })
    } else {
      if (selectedTime == '1 hour') {
        this.influxService.getTimeInfo(this.device.id, 1).subscribe(data => {
          data.label.forEach((item, index) => {
            this.frontInitColor.push('white')
          })

          this.frontChartLabels = data.label
          this.frontChartData[0].data = data.total_weight
          this.frontChartData[1].data = data.weight

          if (this.frontChart.chart) this.frontChart.chart.update()

          this.ml_value = data.total_weight[data.total_weight.length - 2]
          this.mlh_value = data.weight[data.weight.length - 2]

          let now = moment().subtract('minute', 1).format('H:mm')
          let index = data.label.indexOf(now)
          this.ml_value = data.total_weight[index]
          this.mlh_value = data.weight[index]

          if (!this.ml_value || this.ml_value == "NaN") {
            console.log('2')
            this.ml_value = "-"
          }
          if (!this.mlh_value || this.mlh_value == "NaN") {
            this.mlh_value = "-"
          }
        })
      } else if (selectedTime == '1 day') {
        var today = moment().format('YYYY-MM-DD')
        this.influxService.getDayInfo(this.device.id, today, today).subscribe(data => {
          data.label.forEach((item, index) => {
            data.label[index] = item.split(' ')[1]
            this.frontInitColor.push('white')
          })

          // console.log(data.label)
          this.frontChartLabels = data.label

          this.frontChartData[0].data = data.total_weight
          this.frontChartData[1].data = data.weight

          if (this.frontChart.chart) this.frontChart.chart.update()

          this.ml_value = data.total_weight[data.total_weight.length - 2]
          this.mlh_value = data.weight[data.weight.length - 2]

          let now = moment().subtract('minute', 1).format('H:mm')
          let index = data.label.indexOf(now)
          this.ml_value = data.total_weight[index]
          this.mlh_value = data.weight[index]

          if (!this.ml_value || this.ml_value == "NaN") {
            this.ml_value = "-"
          }
          if (!this.mlh_value || this.mlh_value == "NaN") {
            this.mlh_value = "-"
          }
        })
      }
    }
  }

  frontMouseDown(event) {
    console.log('mouse down')
    if (this.thumbnail) {

    } else {
      this.frontState = 1;
      this.frontX1 = event.offsetX;
      // console.log(this.frontX1)

      var el = this.frontRectangle.nativeElement;
      el.style.display = 'block';
      el.style.width = '0px';
      el.style.height = '0px';
      // console.log(el);

      this.zIndexChange(event)
    }
  }

  frontMouseMove(event, type) {
    if (this.frontState == 1) {

      let coordinates = this.frontChart.chart.config.data.datasets["0"]._meta[Object.keys(this.frontChart.chart.config.data.datasets["0"]._meta)[0]].data
      let x_coordinate = [];
      coordinates.forEach((item, intex) => {
        x_coordinate.push(item._model.x);
      });

      if (type == 1) {
        this.frontX2 = event.offsetX;
      } else if (type == 2) {
        if (this.state == 1) {
          this.frontX2 = this.frontX1 + event.offsetX
        } else if (this.state == 2) {
          this.frontX2 = this.tempX + event.offsetX
        }

      }

      let start, end
      if (this.frontX1 > this.frontX2) {
        start = this.frontX2;
        end = this.frontX1;
        this.state = 2
        this.tempX = this.frontX2
      } else {
        start = this.frontX1;
        end = this.frontX2;
        this.state = 1
      }

      this.frontSelectedIndex = [];

      for (var i = 0; i < x_coordinate.length; i++) {
        if (this.frontSelectedIndex.length == 0) {
          if (start <= x_coordinate[i]) {
            this.frontSelectedIndex.push(i);
          }
        } else {
          if (end <= x_coordinate[i]) {
            if (end == x_coordinate[i]) {
              this.frontSelectedIndex.push(i);
            } else {
              this.frontSelectedIndex.push(i - 1);
            }
            break;
          }
        }
      }

      if (this.frontSelectedIndex.length == 1) {
        this.frontSelectedIndex.push(x_coordinate.length - 1);
      }

      this.frontSelectedData = [];
      this.frontChart.chart.data.datasets[0].pointBackgroundColor = this.frontInitColor.slice(0)
      this.frontChart.chart.data.datasets[1].pointBackgroundColor = this.frontInitColor.slice(0)
      if (start <= x_coordinate[this.frontSelectedIndex[0]] && x_coordinate[this.frontSelectedIndex[1]] <= end) {
        for (i = this.frontSelectedIndex[0]; i <= this.frontSelectedIndex[1]; i++) {
          this.frontSelectedData.push(this.frontChartData[0].data[i]);
          this.frontChart.chart.data.datasets[0].pointBackgroundColor[i] = 'rgb(66, 198, 221)';
          this.frontChart.chart.data.datasets[1].pointBackgroundColor[i] = 'rgb(255, 0, 0)';
        }
      }
      this.frontChart.chart.update()

      var el = this.frontRectangle.nativeElement;
      var chartHeight = this.frontChart.chart.height;
      var labelHeight = this.frontChart.chart.scales['y-axis-1'].height;
      var legendHeight = this.frontChart.chart.legend.height;

      // console.log(chartHeight, labelHeight, legendHeight)
      el.style.display = 'block';
      el.style.position = 'absolute';
      el.style.left = start + 'px';
      el.style.top = legendHeight + 'px'

      // el.style.top = -(chartHeight - legendHeight + 50) + 'px';

      el.style.width = Math.abs(end - start) + 'px';
      el.style.height = labelHeight + 'px';

      // console.log(el);
    }
  }

  frontMouseUp(event) {
    // console.log('mouse up')
    if (this.thumbnail) {

    } else {
      if (this.frontState == 1) {
        this.frontState = 0;
        // console.log(this.frontSelectedData.filter((item) => { return item != null && item != undefined && item != "NaN" }))
        if (this.frontSelectedData.filter((item) => { return item != null && item != undefined && item != "NaN" }).length > 2) {

          this.frontChartLabels = this.frontChartLabels.slice(this.frontSelectedIndex[0], this.frontSelectedIndex[1] + 1)
          this.frontChartData[0].data = this.frontChartData[0].data.slice(this.frontSelectedIndex[0], this.frontSelectedIndex[1] + 1)
          this.frontChartData[1].data = this.frontChartData[1].data.slice(this.frontSelectedIndex[0], this.frontSelectedIndex[1] + 1)

          this.frontChart.chart.update()
          this.frontSelectedData.length = 0
          clearInterval(this.frontIntervalId)
          this.frontMagnifier = true
        }
      }
      var el = this.frontRectangle.nativeElement;
      el.style.display = 'none';
    }
  }

  touchStart(event) {
    console.log('touchStart')
    this.frontState = 2;
    this.frontX1 = event.touches[0].pageX - event.target.getBoundingClientRect().left
    // var rect = e.target.getBoundingClientRect();
    // console.log(event)
    // console.log(event.target.getBoundingClientRect())
    // console.log(event.touches[0].pageX - event.target.getBoundingClientRect().left)

    this.zIndexChange(event)
  }

  touchMove(event) {
    console.log('touchMove')
    if (this.thumbnail) {

    } else {
      if (this.frontState == 2) {

        let coordinates = this.frontChart.chart.config.data.datasets["0"]._meta[Object.keys(this.frontChart.chart.config.data.datasets["0"]._meta)[0]].data
        let x_coordinate = [];
        coordinates.forEach((item, intex) => {
          x_coordinate.push(item._model.x);
        });

        this.frontX2 = event.touches[0].pageX - event.target.getBoundingClientRect().left;

        let start, end
        if (this.frontX1 > this.frontX2) {
          start = this.frontX2;
          end = this.frontX1;
        } else {
          start = this.frontX1;
          end = this.frontX2;
        }

        this.frontSelectedIndex = [];

        for (var i = 0; i < x_coordinate.length; i++) {
          if (this.frontSelectedIndex.length == 0) {
            if (start <= x_coordinate[i]) {
              this.frontSelectedIndex.push(i);
            }
          } else {
            if (end <= x_coordinate[i]) {
              if (end == x_coordinate[i]) {
                this.frontSelectedIndex.push(i);
              } else {
                this.frontSelectedIndex.push(i - 1);
              }
              break;
            }
          }
        }

        if (this.frontSelectedIndex.length == 1) {
          this.frontSelectedIndex.push(x_coordinate.length - 1);
        }

        this.frontSelectedData = [];
        this.frontChart.chart.data.datasets[0].pointBackgroundColor = this.frontInitColor.slice(0)
        this.frontChart.chart.data.datasets[1].pointBackgroundColor = this.frontInitColor.slice(0)
        if (start <= x_coordinate[this.frontSelectedIndex[0]] && x_coordinate[this.frontSelectedIndex[1]] <= end) {
          for (i = this.frontSelectedIndex[0]; i <= this.frontSelectedIndex[1]; i++) {
            this.frontSelectedData.push(this.frontChartData[0].data[i]);
            this.frontChart.chart.data.datasets[0].pointBackgroundColor[i] = 'rgb(66, 198, 221)';
            this.frontChart.chart.data.datasets[1].pointBackgroundColor[i] = 'rgb(255, 0, 0)';
          }
        }
        this.frontChart.chart.update()


        var el = this.frontRectangle.nativeElement;
        var chartHeight = this.frontChart.chart.height;
        var labelHeight = this.frontChart.chart.scales['y-axis-1'].height;
        var legendHeight = this.frontChart.chart.legend.height;

        // console.log(chartHeight, labelHeight, legendHeight)
        el.style.display = 'block';
        el.style.position = 'absolute';
        el.style.left = start + 'px';
        el.style.top = legendHeight + 'px'

        // el.style.top = -(chartHeight - legendHeight + 50) + 'px';

        el.style.width = Math.abs(end - start) + 'px';
        el.style.height = labelHeight + 'px';

        // console.log(el);
      }
    }
  }

  touchEnd(event) {
    console.log('touchEnd')

    if (this.thumbnail) {
      this.width = 375
      this.height = 200

      this.frontChartOptions = this.frontChartOption1
      this.frontChartColours = this.frontChartColours1
      this.frontChartLegend = true

      this.elementRef.nativeElement.querySelector('.content').style.backgroundColor = '#ffffff'

      this.thumbnail = false
      this.thumbnail_expand = true
      this.realTime(this.selectedTime)
    } else {
      if (this.frontState == 2) {
        this.frontState = 0;
        console.log(this.frontSelectedData.filter((item) => { return item != null && item != undefined && item != "NaN" }))
        if (this.frontSelectedData.filter((item) => { return item != null && item != undefined && item != "NaN" }).length > 2) {

          this.frontChartLabels = this.frontChartLabels.slice(this.frontSelectedIndex[0], this.frontSelectedIndex[1] + 1)
          this.frontChartData[0].data = this.frontChartData[0].data.slice(this.frontSelectedIndex[0], this.frontSelectedIndex[1] + 1)
          this.frontChartData[1].data = this.frontChartData[1].data.slice(this.frontSelectedIndex[0], this.frontSelectedIndex[1] + 1)

          this.frontChart.chart.update()
          this.frontSelectedData.length = 0
          clearInterval(this.frontIntervalId)
          this.frontMagnifier = true
        }
      }
      var el = this.frontRectangle.nativeElement;
      el.style.display = 'none';
    }
  }

  toThumbnail() {
    this.width = 185
    this.height = 120

    this.frontChartOptions = this.frontChartOption2
    this.frontChartColours = this.frontChartColours2
    this.frontChartLegend = false

    this.elementRef.nativeElement.querySelector('.content').style.backgroundColor = 'rgba(42, 168, 212, 1)'

    this.thumbnail = true
    this.thumbnail_expand = false

    this.realTime(this.selectedTime)
  }

  backPrevious() {
    this.dateChange({ start: this.daterange.start, end: this.daterange.end })
    console.log(this.daterange)
  }

  backMouseDown(event) {
    console.log('mouse down')
    this.backState = 1;
    this.backX1 = event.offsetX;
    // console.log(this.backX1)

    var el = this.backRectangle.nativeElement;
    el.style.display = 'block';
    el.style.width = '0px';
    el.style.height = '0px';
    // console.log(el);

    this.zIndexChange(event)
  }

  backMouseMove(event, type) {
    if (this.backState == 1) {

      let coordinates = this.backChart.chart.config.data.datasets["0"]._meta[Object.keys(this.backChart.chart.config.data.datasets["0"]._meta)[0]].data
      let x_coordinate = [];
      coordinates.forEach((item, intex) => {
        x_coordinate.push(item._model.x);
      });

      if (type == 1) {
        this.backX2 = event.offsetX;
      } else if (type == 2) {
        if (this.state == 1) {
          this.backX2 = this.backX1 + event.offsetX
        } else if (this.state == 2) {
          this.backX2 = this.tempX + event.offsetX
        }

      }

      let start, end
      if (this.backX1 > this.backX2) {
        start = this.backX2;
        end = this.backX1;
        this.state = 2
        this.tempX = this.backX2
      } else {
        start = this.backX1;
        end = this.backX2;
        this.state = 1
      }

      this.backSelectedIndex = [];

      for (var i = 0; i < x_coordinate.length; i++) {
        if (this.backSelectedIndex.length == 0) {
          if (start <= x_coordinate[i]) {
            this.backSelectedIndex.push(i);
          }
        } else {
          if (end <= x_coordinate[i]) {
            if (end == x_coordinate[i]) {
              this.backSelectedIndex.push(i);
            } else {
              this.backSelectedIndex.push(i - 1);
            }
            break;
          }
        }
      }

      if (this.backSelectedIndex.length == 1) {
        this.backSelectedIndex.push(x_coordinate.length - 1);
      }

      this.backSelectedData = [];
      this.backChart.chart.data.datasets[0].pointBackgroundColor = this.backInitColor.slice(0)
      this.backChart.chart.data.datasets[1].pointBackgroundColor = this.backInitColor.slice(0)
      if (start <= x_coordinate[this.backSelectedIndex[0]] && x_coordinate[this.backSelectedIndex[1]] <= end) {
        for (i = this.backSelectedIndex[0]; i <= this.backSelectedIndex[1]; i++) {
          this.backSelectedData.push(this.backChartData[0].data[i]);
          this.backChart.chart.data.datasets[0].pointBackgroundColor[i] = 'rgb(66, 198, 221)';
          this.backChart.chart.data.datasets[1].pointBackgroundColor[i] = 'rgb(255, 0, 0)';
        }
      }
      this.backChart.chart.update()

      var el = this.backRectangle.nativeElement;
      var chartHeight = this.backChart.chart.height;
      var labelHeight = this.backChart.chart.scales['y-axis-1'].height;
      var legendHeight = this.backChart.chart.legend.height;

      // console.log(chartHeight, labelHeight, legendHeight)
      el.style.display = 'block';
      el.style.position = 'absolute';
      el.style.left = start + 'px';

      el.style.top = legendHeight + 'px'
      // el.style.top = -(chartHeight - legendHeight + 50) + 'px';

      el.style.width = Math.abs(end - start) + 'px';
      el.style.height = labelHeight + 'px';

      // console.log(el);
    }
  }

  backMouseUp(event) {
    console.log('mouse up')
    if (this.backState == 1) {
      this.backState = 0;

      // console.log(this.backSelectedData)
      // console.log(this.backSelectedData.filter((item) => { return item }))

      if (this.backSelectedData.filter((item) => { return item != null && item != undefined && item != "NaN" }).length > 2) {

        this.backChartLabels = this.backChartLabels.slice(this.backSelectedIndex[0], this.backSelectedIndex[1] + 1)
        this.backChartData[0].data = this.backChartData[0].data.slice(this.backSelectedIndex[0], this.backSelectedIndex[1] + 1)
        this.backChartData[1].data = this.backChartData[1].data.slice(this.backSelectedIndex[0], this.backSelectedIndex[1] + 1)

        this.backChart.chart.update()
        this.backSelectedData.length = 0
        this.backMagnifier = true
      }

      var el = this.backRectangle.nativeElement;
      el.style.display = 'none';
    }
  }


  public selectedDate(value: any, datepicker?: any) {
    datepicker.start = value.start;
    datepicker.end = value.end;

    // this.daterange.start = value.start
    // this.daterange.end = value.end

    this.dateChange({ start: datepicker.start.format('YYYY-MM-DD'), end: datepicker.end.format('YYYY-MM-DD') })
    // console.log(datepicker.start.format('YYYY-MM-DD') + ' ~ ' + datepicker.end.format('YYYY-MM-DD'))
  }

  backTouchStart(event) {
    console.log('backTouchStart')
    this.backState = 2;
    this.backX1 = event.touches[0].pageX - event.target.getBoundingClientRect().left

    this.zIndexChange(event)

  }

  backTouchMove(event) {
    console.log('backTouchMove')
    if (this.backState == 2) {

      let coordinates = this.backChart.chart.config.data.datasets["0"]._meta[Object.keys(this.backChart.chart.config.data.datasets["0"]._meta)[0]].data
      let x_coordinate = [];
      coordinates.forEach((item, intex) => {
        x_coordinate.push(item._model.x);
      });

      this.backX2 = event.touches[0].pageX - event.target.getBoundingClientRect().left;

      let start, end
      if (this.backX1 > this.backX2) {
        start = this.backX2;
        end = this.backX1;
      } else {
        start = this.backX1;
        end = this.backX2;
      }

      this.backSelectedIndex = [];

      for (var i = 0; i < x_coordinate.length; i++) {
        if (this.backSelectedIndex.length == 0) {
          if (start <= x_coordinate[i]) {
            this.backSelectedIndex.push(i);
          }
        } else {
          if (end <= x_coordinate[i]) {
            if (end == x_coordinate[i]) {
              this.backSelectedIndex.push(i);
            } else {
              this.backSelectedIndex.push(i - 1);
            }
            break;
          }
        }
      }

      if (this.backSelectedIndex.length == 1) {
        this.backSelectedIndex.push(x_coordinate.length - 1);
      }

      this.backSelectedData = [];
      this.backChart.chart.data.datasets[0].pointBackgroundColor = this.backInitColor.slice(0)
      this.backChart.chart.data.datasets[1].pointBackgroundColor = this.backInitColor.slice(0)
      if (start <= x_coordinate[this.backSelectedIndex[0]] && x_coordinate[this.backSelectedIndex[1]] <= end) {
        for (i = this.backSelectedIndex[0]; i <= this.backSelectedIndex[1]; i++) {
          this.backSelectedData.push(this.backChartData[0].data[i]);
          this.backChart.chart.data.datasets[0].pointBackgroundColor[i] = 'rgb(66, 198, 221)';
          this.backChart.chart.data.datasets[1].pointBackgroundColor[i] = 'rgb(255, 0, 0)';
        }
      }
      this.backChart.chart.update()

      var el = this.backRectangle.nativeElement;
      var chartHeight = this.backChart.chart.height;
      var labelHeight = this.backChart.chart.scales['y-axis-1'].height;
      var legendHeight = this.backChart.chart.legend.height;

      // console.log(chartHeight, labelHeight, legendHeight)
      el.style.display = 'block';
      el.style.position = 'absolute';
      el.style.left = start + 'px';
      el.style.top = legendHeight + 'px'

      // el.style.top = -(chartHeight - legendHeight + 50) + 'px';

      el.style.width = Math.abs(end - start) + 'px';
      el.style.height = labelHeight + 'px';

      // console.log(el);
    }
  }

  backTouchEnd(event) {
    console.log('backTouchEnd')
    if (this.backState == 2) {
      this.backState = 0;
      console.log(this.backSelectedData.filter((item) => { return item != null && item != undefined && item != "NaN" }))
      if (this.backSelectedData.filter((item) => { return item != null && item != undefined && item != "NaN" }).length > 2) {

        this.backChartLabels = this.backChartLabels.slice(this.backSelectedIndex[0], this.backSelectedIndex[1] + 1)
        this.backChartData[0].data = this.backChartData[0].data.slice(this.backSelectedIndex[0], this.backSelectedIndex[1] + 1)
        this.backChartData[1].data = this.backChartData[1].data.slice(this.backSelectedIndex[0], this.backSelectedIndex[1] + 1)

        this.backChart.chart.update()
        this.backSelectedData.length = 0
        clearInterval(this.backIntervalId)
        this.backMagnifier = true
      }
    }
    var el = this.backRectangle.nativeElement;
    el.style.display = 'none';
  }


  public dateChange(value?) {
    this.daterange.start = value.start
    this.daterange.end = value.end

    this.backMagnifier = false
    this.influxService.getDayInfo(this.device.id, value.start, value.end).subscribe(data => {
      // console.log(data)
      this.backInitColor.length = 0
      data.label.forEach((item, index) => {
        this.backInitColor.push('white')
      })
      // console.log(this.backInitColor)
      this.backChartLabels = data.label
      this.backChartData[0].data = data.total_weight
      this.backChartData[1].data = data.weight

      if (this.backChart.chart) this.backChart.chart.update()

    })
  }

  ngOnDestroy() {
    clearInterval(this.frontIntervalId);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    console.log('onResize')

    this.frontChart.chart.resize()
    this.backChart.chart.resize()

    // if (event.target.innerWidth > 1326) {
    //   this.width = 516
    //   this.height = 290
    // } else if (event.target.innerWidth <= 1325) {
    //   this.width = 375
    //   this.height = 200
    // }

    // if (window.innerWidth > 1326) {
    //   this.width = 516
    //   this.height = 290

    //   this.frontChartOptions = this.frontChartOption1
    //   this.frontChartColours = this.frontChartColours1
    //   this.frontChartLegend = true

    //   this.elementRef.nativeElement.querySelector('.content').style.backgroundColor = '#ffffff'

    //   this.thumbnail = false

    // } else if (window.innerWidth <= 1325) {
    //   // this.width = 375
    //   // this.height = 200

    //   if (!this.thumbnail) {
    //     alert(this.thumbnail)
    //     this.width = 185
    //     this.height = 120

    //     this.frontChartOptions = this.frontChartOption2
    //     this.frontChartColours = this.frontChartColours2
    //     this.frontChartLegend = false

    //     this.elementRef.nativeElement.querySelector('.content').style.backgroundColor = 'rgba(42, 168, 212, 1)'

    //     this.thumbnail = true
    //   }
    // }
  }

  resizeMouseDown(event) {
    console.log('resizeMouseDown')
    this.grabber = true;
    this.oldY = event.clientY;
    this.oldX = event.clientX;

    this.zIndexChange(event)
  }

  @HostListener('document:mousemove', ['$event'])
  resizeMouseMove(event) {

    if (this.grabber) {
      console.log('grabberMouseMove')
      this.resizer(event.clientY - this.oldY, event.clientX - this.oldX);

      this.oldY = event.clientY;
      this.oldX = event.clientX;
    } else if (this.isDrag) {
      let offsetX = event.clientX - this.oldX
      let offsetY = event.clientY - this.oldY

      this.left += offsetX;
      this.top += offsetY;

      this.oldY = event.clientY;
      this.oldX = event.clientX;
    } else {
      return;
    }


  }

  @HostListener('document:mouseup', ['$event'])
  resizeMouseUp(event) {
    // console.log('resizeMouseUp')
    
    if (this.grabber) {
      console.log('grabber')
      this.grabber = false;

      this.frontChart.chart.resize()
      this.backChart.chart.resize()
      var selection = window.getSelection();
      selection.removeAllRanges();
      
      this.favoriteDevices = this.favoriteDevicesService.getFavoriteDevices()

      let i = this.favoriteDevices[0].devices.map((innerDevice, index) => { return innerDevice.type + '#' + innerDevice.id }).indexOf(this.device.type + '#' + this.device.id)
      
      this.favoriteDevices[0].devices[i].width = this.width
      this.favoriteDevices[0].devices[i].height = this.height
  
      this.favoriteDevicesService.setFavoriteDevices(JSON.stringify(this.favoriteDevices[0]))
      
    } else if (this.isDrag) {
      console.log('isDrag')
      this.isDrag = false;

      
      this.favoriteDevices = this.favoriteDevicesService.getFavoriteDevices()

      let i = this.favoriteDevices[0].devices.map((innerDevice, index) => { return innerDevice.type + '#' + innerDevice.id }).indexOf(this.device.type + '#' + this.device.id)
      this.favoriteDevices[0].devices[i].dragged = true
      
      this.favoriteDevices[0].devices[i].top = this.top
      this.favoriteDevices[0].devices[i].left = this.left

      console.log(this.elementRef.nativeElement)
  
      this.favoriteDevicesService.setFavoriteDevices(JSON.stringify(this.favoriteDevices[0]))
    }

    // this.zIndexChange(event)
  }

  resizer(offsetY: number, offsetX: number) {

    // this.width += offsetX * 2;
    this.width += offsetX;
    this.height += offsetY;

    // if (this.width < 516) {
    //   this.width = 516
    // } else if (this.width > 1140) {
    //   this.width = 1140
    // }

    // if (this.height < 290) {
    //   this.height = 290
    // } else if (this.height > 750) {
    //   this.height = 750
    // }
  }

  resizeTouchStart(event) {
    console.log('resizeTouchStart')
    this.grabber = true;
    this.oldY = event.touches[0].clientY;
    this.oldX = event.touches[0].clientX;

    // console.log(event, this.oldX, this.oldY)

    this.zIndexChange(event)
  }

  resizeTouchMove(event) {
    console.log('resizeTouchMove')
    if (this.grabber) {
      console.log('grabberMouseMove')
      this.resizer(event.touches[0].clientY - this.oldY, event.touches[0].clientX - this.oldX);

      this.oldY = event.touches[0].clientY;
      this.oldX = event.touches[0].clientX;
    } else if (this.isDrag) {
      let offsetX = event.touches[0].clientX - this.oldX
      let offsetY = event.touches[0].clientY - this.oldY

      this.left += offsetX;
      this.top += offsetY;

      this.oldY = event.touches[0].clientY;
      this.oldX = event.touches[0].clientX;
    } else {
      return;
    }
  }

  resizeTouchEnd(event) {

    console.log('resizeTouchEnd')
    if (this.grabber) {
      this.grabber = false;

      this.frontChart.chart.resize()
      this.backChart.chart.resize()
      var selection = window.getSelection();
      selection.removeAllRanges();
    } else if (this.isDrag) {
      console.log('dragMouseUp')
      this.isDrag = false;
    }

    this.zIndexChange(event)
  }


  // resizeTouchMove(event) {
  //   console.log('resizeTouchMove')
  //   if (!this.grabber) {
  //     return;
  //   }

  //   console.log('resizeMouseMove')
  //   this.resizer(event.touches[0].clientY - this.oldY, event.touches[0].clientX - this.oldX);

  //   this.oldY = event.touches[0].clientY;
  //   this.oldX = event.touches[0].clientX;
  // }

  // resizeTouchEnd(event) {

  //   console.log('resizeTouchEnd')
  //   this.grabber = false;

  //   this.frontChart.chart.resize()
  //   this.backChart.chart.resize()
  //   var selection = window.getSelection ();
  //   selection.removeAllRanges ();
  // }


  dragMouseDown(event) {
    console.log('dragMouseDown')
    this.isDrag = true

    this.oldY = event.clientY;
    this.oldX = event.clientX;

    this.zIndexChange(event)

    // let width = event.path[6].style.width
    // if (width.slice(0, width.indexOf('px')) != "0") {
    //   event.path[6].style.position = "absolute"
    //   event.path[6].style.width = "0px"
    //   event.path[6].style.height = "0px"
    //   event.path[6].style.left = event.offsetX + 'px'
    //   event.path[6].style.top = event.offsetY + 'px'
    // }
    let width = event.path[6].style.width
    let offsetLeft = event.path[6].offsetLeft
    let offsetTop = event.path[6].offsetTop
    console.log('>>', event)
    if (width.slice(0, width.indexOf('px')) != "0") {
      console.log('>>', event)
      event.path[6].style.position = "absolute"
      event.path[6].style.width = "0px"
      event.path[6].style.height = "0px"
      // event.path[6].style.left = offsetLeft + 'px'
      // event.path[6].style.top = offsetTop + 'px'
      event.path[6].style.left = '0px'
      event.path[6].style.top = '0px'
      this.left = offsetLeft
      this.top = offsetTop
    }
  }

  dragTouchStart(event) {
    this.isDrag = true;

    this.oldY = event.touches[0].clientY;
    this.oldX = event.touches[0].clientX;

    this.zIndexChange(event)

    let width = event.path[6].style.width
    let offsetLeft = event.path[6].offsetLeft
    let offsetTop = event.path[6].offsetTop

    if (width.slice(0, width.indexOf('px')) != "0") {
      console.log(event)
      event.path[6].style.position = "absolute"
      event.path[6].style.width = "0px"
      event.path[6].style.height = "0px"
      event.path[6].style.left = offsetLeft + 'px'
      event.path[6].style.top = offsetTop + 'px'
    }

  }

  zIndexChange(event) {
    
    if (event.path[5] && event.path[5].tagName == 'MY-CARD8') {
      event.path[5].style.zIndex = ++this.favoriteDevicesService.zIndex
    } else if (event.path[6] && event.path[6].tagName == 'MY-CARD8') {
      event.path[6].style.zIndex = ++this.favoriteDevicesService.zIndex
    }
    
    
    if (this.favoriteDevicesService.zIndex > 9999) this.favoriteDevicesService.zIndex = 0

    this.favoriteDevices = this.favoriteDevicesService.getFavoriteDevices()

    let i = this.favoriteDevices[0].devices.map((innerDevice, index) => { return innerDevice.type + '#' + innerDevice.id }).indexOf(this.device.type + '#' + this.device.id)
    
    this.device.zIndex = this.favoriteDevicesService.zIndex
    this.favoriteDevices[0].devices[i].zIndex = this.favoriteDevicesService.zIndex

    this.favoriteDevicesService.setFavoriteDevices(JSON.stringify(this.favoriteDevices[0]))

    console.log(event.path)
    console.log(this.device.id + ' : ' + this.device.zIndex + ' : ' + this.favoriteDevicesService.zIndex)
  }


  updateTag() {
    this.isValid = null
    console.log('updateTag')
  }

  blurTag(tag) {

    this.isValid = true
    this.favoriteDevices = this.favoriteDevicesService.getFavoriteDevices()
    let i = this.favoriteDevices[0].devices.map((innerDevice, index) => { return innerDevice.type + '#' + innerDevice.id }).indexOf(this.device.type + '#' + this.device.id)

    this.favoriteDevices[0].devices[i].tag = this.device.tag
        
    this.favoriteDevicesService.setFavoriteDevices(JSON.stringify(this.favoriteDevices[0]))
    
    console.log(this.favoriteDevices[0].devices)
    console.log('blurTag')
  }


  frontPress() {
    console.log('frontPress')
  }

  timeClick() {
    console.log('timeClick()')
    let index = (this.times.indexOf(this.currentTime) + 1) % 2

    clearInterval(this.frontIntervalId)
    this.realTime(this.times[index])
    this.frontIntervalId = setInterval(() => {
      this.realTime(this.times[index])
    }, 5000);
    this.currentTime = this.times[index]
    
    this.selectedTime = this.currentTime
  }
  
  
}
