import { Component, OnInit } from '@angular/core';

import { HttpService } from "../Shared/http.service";
import { AuthService } from "../Shared/auth.service";

@Component({
  selector: 'pdf-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  // Montly Profit
  UBarChartData: any[] = [];
  UBarChartLabels: any[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  UBarChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: {
        0: {
          ticks: {
            beginAtZero: true
          }
        }
      }
    }
  };
  Uloaded: boolean = false;
  UloadCanvas = false;
  // // Most Profitable Boot
  // BLBarChartData: any[] = [];
  // BLBarChartLabels: any[] = [];
  // BLBarChartOptions = {
  //   scaleShowVerticalLines: false,
  //   responsive: true,
  //   scales: {
  //     yAxes: {
  //       0: {
  //         ticks: {
  //           beginAtZero: true
  //         }
  //       }
  //     }
  //   }
  // };
  // BLBarChartLegend: boolean = true;
  // BLloaded: boolean = false;
  // BLloadCanvas = false;
  // // Most saleable Boot
  // BRBarChartData: any[] = [];
  // BRBarChartLabels: any[] = [];
  // BRBarChartOptions = {
  //   scaleShowVerticalLines: false,
  //   responsive: true,
  //   scales: {
  //     yAxes: {
  //       0: {
  //         ticks: {
  //           beginAtZero: true
  //         }
  //       }
  //     }
  //   }
  // };
  // BRBarChartLegend: boolean = true;
  // BRloaded: boolean = false;
  // BRloadCanvas = false;

  constructor(
    private http: HttpService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.http.getStatistics()
      .subscribe(
        (stats) => {
          // Montly Profit and Sales
          this.UBarChartData = [
            {data: stats.profit_monthly, label: 'Monthly Profits'},
            {data: stats.total_monthly, label: 'Monthly Sales'}
          ];
          this.Uloaded = true;
          this.UloadCanvas = true;
          console.log(this.UBarChartData);
        }
      );
  }

}
