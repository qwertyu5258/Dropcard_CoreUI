import { Component, Input, ViewChild, OnInit, OnDestroy } from '@angular/core'
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { InnerDevice } from 'app/models/favorite-device';
import { InfluxService } from '../../../../services/influx.service'
import * as moment from 'moment'

@Component({
  selector: 'my-card6',
  templateUrl: './my-card6.component.html'
})

export class MyCard6Component implements OnInit, OnDestroy {

  @Input()
  device: InnerDevice

  ml
  mlh

  intervalId

  @ViewChild('frontChart')
  socialChart: BaseChartDirective;

  public socialChartLegend = false;
  public socialChartType = 'line';

  public socialChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    },
    animation: false
  };

  public socialChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff'
    },
    {
      backgroundColor: 'skyblue',
      borderColor: 'skyblue',
      pointHoverBackgroundColor: 'skyblue'
    }
  ];

  public socialChartData: Array<any> = [
    {
      data: [],
      label: 'ml'
    },
    {
      data: [],
      label: 'ml/h'
    }
  ];
  public socialChartLabels: Array<any> = [];

  constructor(private influxService: InfluxService) { }

  ngOnInit() {
    this.realTime()
    this.intervalId = setInterval(() => {
      this.realTime()
    }, 5000);
  }

  realTime() {
    this.influxService.getTimeInfo(this.device.id, 1).subscribe(data => {

      this.socialChartLabels = data.label
      this.socialChartData[0].data = data.total_weight
      this.socialChartData[1].data = data.weight

      if (this.socialChart) this.socialChart.chart.update()

      let now = moment().subtract('minute', 1).format('H:mm')
      let index = data.label.indexOf(now)
      this.ml = data.total_weight[index]
      this.mlh = data.weight[index]

      if (!this.ml || this.ml == "NaN") {
        this.ml = "-"
      }
      if (!this.mlh || this.mlh == "NaN") {
        this.mlh = "-"
      }
    })
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }  
}
