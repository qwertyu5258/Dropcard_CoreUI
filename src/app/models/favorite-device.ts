
export class FavoriteDevice {
    constructor(
        public user_id?: string,
        public devices?: InnerDevice[]
    ) { }
}

export class InnerDevice {
    public width:any = 516
    public height: any = 290
    
    public dragged: boolean = false
    public zIndex:any = 0
    public top:any
    public left:any

    constructor(
        public type?: string,
        public id?: string,
        public tag?: string,
        public isExpanded?: boolean,
        public alarm?: AlarmConfig,
        public thumbnailGraph?: ThumbnailGraph,
        public expandGraph?: ExpandGraph,
        public expandGraph2?: ExpandGraph2,
        public intervalId?: any,

        
    ) {
        this.thumbnailGraph = new ThumbnailGraph()
        this.expandGraph = new ExpandGraph()
        this.expandGraph2 = new ExpandGraph2()

    }
}

export class AlarmConfig {
    public total_weight_min: number = 100
    public total_weight_max: number = 2000
    public total_weight_value: number = 500
    
    public weight_min: number = 100
    public weight_max: number = 500
    public weight_value_from: number = 200
    public weight_value_to: number = 250

    constructor(init?: Partial<AlarmConfig>) {
        Object.assign(this, init)
    }
}

export class MyColor {
    public brandPrimary: string = '#20a8d8';
    public brandSuccess: string = '#4dbd74';
    public brandInfo: string = '#63c2de';
    public brandWarning: string = '#f8cb00';
    public brandDanger: string = '#f86c6b';
}

export class ExpandGraph {

    public color: MyColor = new MyColor()

    // convert Hex to RGBA
    public convertHex(hex: string, opacity: number) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity / 100 + ')';
        return rgba;
    }

    // mainChart
    public random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public mainChartElements = 27;
    public mainChartData1: Array<number> = [];
    public mainChartData2: Array<number> = [];
    public mainChartData3: Array<number> = [];

    public mainChartData: Array<any> = [
        {
            data: this.mainChartData1,
            label: 'Total Weight'
        },
        {
            data: this.mainChartData2,
            label: 'Weight'
        },
    ];
    /* tslint:disable:max-line-length */
    public mainChartLabels: Array<any> = [];
    public mainChartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            mode: 'index',
            intersect: true,
        },
        animation: false,
        scales: {
            xAxes: [{
                gridLines: {
                    drawOnChartArea: false,
                },
                ticks: {
                    callback: function (value: any) {
                        return value
                    }
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    // maxTicksLimit: 5,
                    stepSize: Math.ceil(250 / 5),
                    // max: 250
                }
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
        }
    };

    public mainChartColours: Array<any> = [
        { // brandInfo
            // backgroundColor: this.convertHex(this.color.brandInfo, 10),
            backgroundColor: 'transparent',
            borderColor: this.color.brandInfo,
            pointHoverBackgroundColor: '#fff'
        },
        { // brandSuccess
            backgroundColor: 'transparent',
            borderColor: this.color.brandSuccess,
            pointHoverBackgroundColor: '#fff'
        },
        { // brandDanger
            backgroundColor: 'transparent',
            borderColor: this.color.brandDanger,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5]
        }
    ];
    public mainChartLegend = false;
    public mainChartType = 'line';

    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }
    //end
}

export class ThumbnailGraph {

    public color: MyColor = new MyColor()

    public lineChartData: Array<any> = [
        {
            data: [],
            label: ''
        },
        {
            data: [],
            label: ''
        }
    ];
    public lineChartLabels: Array<any> = [];
    public lineChartOptions: any = {
        maintainAspectRatio: false,
        tooltips: {
            mode: 'index',
            y: -40,
            yAlign: 'above'
        },
        animation: false,
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false
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
            },
        },
        legend: {
            display: false
        }
    };
    public lineChartColours: Array<any> = [
        {
            backgroundColor: 'rgba(255,255,255,.2)',
            borderColor: 'rgba(255,255,255,.55)',
        },
        {
            backgroundColor: this.color.brandDanger,
            borderColor: this.color.brandDanger
        }
    ];

    public lineChartLegend: boolean = false;
    public lineChartType = 'line';

    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }
}

export class ExpandGraph2 {
    
        public color: MyColor = new MyColor()
    
        // convert Hex to RGBA
        public convertHex(hex: string, opacity: number) {
            hex = hex.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
    
            const rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity / 100 + ')';
            return rgba;
        }
    
        // mainChart
        public random(min: number, max: number) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
    
        public mainChartElements = 27;
        public mainChartData1: Array<number> = [];
        public mainChartData2: Array<number> = [];
        public mainChartData3: Array<number> = [];
    
        public mainChartData: Array<any> = [
            {
                data: this.mainChartData1,
                label: 'ml'
            },
            {
                data: this.mainChartData2,
                label: 'ml/h'
            }
        ];
        /* tslint:disable:max-line-length */
        public mainChartLabels: Array<any> = [];
        public mainChartOptions: any = {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                mode: 'index',
                intersect: true,
            },
            animation: false,
            scales: {
                xAxes: [{
                    gridLines: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        callback: function (value: any) {
                            return value
                        }
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        // maxTicksLimit: 5,
                        stepSize: Math.ceil(250 / 5),
                        // max: 250
                    }
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
            }
        };
    
        public mainChartColours: Array<any> = [
            { // brandInfo
                // backgroundColor: this.convertHex(this.color.brandInfo, 10),
                backgroundColor: 'transparent',
                borderColor: this.color.brandInfo,
                pointHoverBackgroundColor: '#fff'
            },
            { // brandSuccess
                backgroundColor: 'transparent',
                borderColor: this.color.brandSuccess,
                pointHoverBackgroundColor: '#fff'
            },
            { // brandDanger
                backgroundColor: 'transparent',
                borderColor: this.color.brandDanger,
                pointHoverBackgroundColor: '#fff',
                borderWidth: 1,
                borderDash: [8, 5]
            }
        ];
        public mainChartLegend = false;
        public mainChartType = 'line';
    
        public chartClicked(e: any): void {
            console.log(e);
        }
    
        public chartHovered(e: any): void {
            console.log(e);
        }
        //end
    }

// class Person {
//     public name: string = "default"
//     public address: string = "default"
//     public age: number = 0;

//     public constructor(init?:Partial<Person>) {
//         Object.assign(this, init);
//     }
// }

// let persons = [
//     new Person(),
//     new Person({}),
//     new Person({name:"John"}),
//     new Person({address:"Earth"}),    
//     new Person({age:20, address:"Earth", name:"John"}),
// ];