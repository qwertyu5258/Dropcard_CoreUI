import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, Input } from '@angular/core'
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { Daterangepicker, DaterangepickerConfig } from 'ng2-daterangepicker'
import * as moment from 'moment'

import { InfluxService } from '../../../services/influx.service'
import { FavoriteDevice, InnerDevice, AlarmConfig, ExpandGraph } from 'app/models/favorite-device';

@Component({
  selector: 'my-card',
  templateUrl: './my-card.component.html',
  styleUrls: ['./my-card.component.scss']
})

export class MyCardComponent implements OnInit, OnDestroy {
  selectedTime
  times: string[] = ['1 hour', '1 day','7days']


  @Input()
  device: InnerDevice

  @ViewChild('card')
  cardElemRef: ElementRef

  @ViewChild('frontChart')
  frontChart: BaseChartDirective;

  @ViewChild('frontRectangle')
  frontRectangle: ElementRef;

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
  public frontChartOptions: any = {
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
              // hour: 'M-D HH:00'
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
    reponsive: true,
    maintainAspectRatio: true,
    tooltips: {
      mode: 'index',
      intersect: true,
    },
    animation: false
  }
  public frontChartColours: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: 'rgb(66, 198, 221)',
      label: 'ml',
      pointBackgroundColor: this.frontInitColor,
      fill: false,
      yAxisID: 'y-axis-1'
    },
    {
      backgroundColor: 'transparent',
      borderColor: 'rgb(255, 0, 0)',
      label: 'ml/h',
      pointBackgroundColor: this.frontInitColor,
      fill: false,
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
              // hour: 'M-D HH:00'
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
    reponsive: true,
    maintainAspectRatio: true,
    tooltips: {
      mode: 'index',
      intersect: true,
    },
    // animation: false
  }
  public backChartColours: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: 'rgb(66, 198, 221)',
      label: 'ml',
      pointBackgroundColor: this.backInitColor,
      fill: false,
      yAxisID: 'y-axis-1'
    },
    {
      backgroundColor: 'transparent',
      data:[0.1,0.2,0,3,0,7],
      borderColor: ['rgba(255,99,132,1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)'],
      label: 'ml/h',
      pointBackgroundColor: this.backInitColor,
      fill: false,
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

  constructor(private daterangepickerConfig: DaterangepickerConfig, private influxService: InfluxService) {
    this.daterangepickerConfig.settings = {
      locale: { format: 'YYYY-MM-DD' },
      alwaysShowCalendars: false,
      ranges: {
        'Last Month': [moment().subtract(1, 'month'), moment()],
        'Last 3 Months': [moment().subtract(4, 'month'), moment()],
        'Last 6 Months': [moment().subtract(6, 'month'), moment()],
        'Last 12 Months': [moment().subtract(12, 'month'), moment()],
      }
    }
  }

  ngOnInit() {
    this.selectedTime = this.times[1]
    console.log(this.frontChartLabels.length)
    this.realTime(this.selectedTime)
    this.frontIntervalId = setInterval(() => {
      this.realTime(this.selectedTime)
    }, 5000);

    this.dateChange({ start: moment().format('YYYY-MM-DD'), end: moment().format('YYYY-MM-DD') })

    // console.log(this.deviceId)
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
    console.log('onchange')
  }

  realTime(selectedTime) {
    this.frontMagnifier = false
    console.log('realTime')
    if (selectedTime == '1 hour') {
      this.influxService.getTimeInfo(this.device.id, 1).subscribe(data => {
        data.label.forEach((item, index) => {
          this.frontInitColor.push('white')
        })

        this.frontChartLabels = data.label
        this.frontChartData[0].data = data.total_weight
        this.frontChartData[1].data = data.weight

        if (this.frontChart.chart) this.frontChart.chart.update()

      })
    } else if (selectedTime == '1 day') {
      var today = moment().format('YYYY-MM-DD')
      this.influxService.getDayInfo(this.device.id, today, today).subscribe(data => {
        data.label.forEach((item, index) => {
          data.label[index] = item.split(' ') [1]
          this.frontInitColor.push('white')
        })

        this.frontChartLabels = data.label
        this.frontChartData[0].data = data.total_weight
        this.frontChartData[1].data = data.weight

        if (this.frontChart.chart) this.frontChart.chart.update()

      })
    }
  }

  frontMouseDown(event) {
    console.log('mouse down')
    this.frontState = 1;
    this.frontX1 = event.offsetX;
    console.log(this.frontX1)

    var el = this.frontRectangle.nativeElement;
    el.style.display = 'block';
    el.style.width = '0px';
    el.style.height = '0px';
    console.log(el);

  }

  frontMouseMove(event) {
    if (this.frontState == 1) {

      let coordinates = this.frontChart.chart.config.data.datasets["0"]._meta[Object.keys(this.frontChart.chart.config.data.datasets["0"]._meta)[0]].data
      let x_coordinate = [];
      coordinates.forEach((item, intex) => {
        x_coordinate.push(item._model.x);
      });

      this.frontX2 = event.offsetX;

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

  frontMouseUp(event) {
    console.log('mouse up')
    if (this.frontState == 1) {
      this.frontState = 0;
      console.log(this.frontSelectedData.filter((item) => { return item != null && item != undefined }))
      if (this.frontSelectedData.filter((item) => { return item != null && item != undefined }).length > 2) {

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

  touchStart(event) {
    console.log('touchStart')
    this.frontState = 2;
    this.frontX1 = event.touches[0].pageX - event.target.getBoundingClientRect().left
    // var rect = e.target.getBoundingClientRect();
    console.log(event)
    console.log(event.target.getBoundingClientRect())
    console.log(event.touches[0].pageX - event.target.getBoundingClientRect().left)
  }

  touchMove(event) {
    console.log('touchMove')
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

  touchEnd(event) {
    console.log('touchEnd')
    if (this.frontState == 2) {
      this.frontState = 0;
      console.log(this.frontSelectedData.filter((item) => { return item != null && item != undefined }))
      if (this.frontSelectedData.filter((item) => { return item != null && item != undefined }).length > 2) {

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



  backPrevious() {
    this.dateChange({ start: this.daterange.start, end: this.daterange.end })
    console.log(this.daterange)
  }

  backMouseDown(event) {
    console.log('mouse down')
    this.backState = 1;
    this.backX1 = event.offsetX;
    console.log(this.backX1)

    var el = this.backRectangle.nativeElement;
    el.style.display = 'block';
    el.style.width = '0px';
    el.style.height = '0px';
    console.log(el);
  }

  backMouseMove(event) {
    if (this.backState == 1) {

      let coordinates = this.backChart.chart.config.data.datasets["0"]._meta[Object.keys(this.backChart.chart.config.data.datasets["0"]._meta)[0]].data
      let x_coordinate = [];
      coordinates.forEach((item, intex) => {
        x_coordinate.push(item._model.x);
      });

      this.backX2 = event.offsetX;

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

      console.log(chartHeight, labelHeight, legendHeight)
      el.style.display = 'block';
      el.style.position = 'absolute';
      el.style.left = start + 'px';

      el.style.top = legendHeight + 'px'
      // el.style.top = -(chartHeight - legendHeight + 50) + 'px';

      el.style.width = Math.abs(end - start) + 'px';
      el.style.height = labelHeight + 'px';

      console.log(el);
    }
  }

  backMouseUp(event) {
    console.log('mouse up')
    if (this.backState == 1) {
      this.backState = 0;

      console.log(this.backSelectedData)
      console.log(this.backSelectedData.filter((item) => { return item }))

      if (this.backSelectedData.filter((item) => { return item != null && item != undefined }).length > 2) {

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
      console.log(this.backInitColor)
      this.backChartLabels = data.label
      this.backChartData[0].data = data.total_weight
      this.backChartData[1].data = data.weight

      if (this.backChart) this.backChart.chart.update()

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
  }
}
