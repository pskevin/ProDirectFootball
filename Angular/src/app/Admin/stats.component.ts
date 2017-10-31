import { Component, OnInit } from '@angular/core';

import { HttpService } from "../Shared/http.service";
import { AuthService } from "../Shared/auth.service";
import { Boot } from "../Shared/boot.model";

@Component({
  selector: 'pdf-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  boots: Boot[] = [];
  boots1: Boot[] = [];
  boots2: Boot[] = [];
  bootsLoaded:boolean = false;
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
  ) { }

  ngOnInit() {
    this.http.getStatistics()
      .subscribe(
      (stats) => {
        // Montly Profit and Sales
        this.UBarChartData = [
          { data: stats.profit_monthly, label: 'Monthly Profits' },
          { data: stats.total_monthly, label: 'Monthly Sales' }
        ];
        this.Uloaded = true;
        this.UloadCanvas = true;
        console.log(stats);
        for (const boot of stats.profit_boot) {
          this.boots.push(new Boot('', '', boot[0], '', '', boot[1], ''));
        }
        for (const boot of stats.total_boot) {
          this.boots.push(new Boot('', '', boot[0], '', '', boot[1], ''));
        }
        for (const icon of stats.icons) {
          for (const boot of this.boots.filter((boot) => (boot.name === icon[0]))) {
            boot.img = icon[1];
          }
        }
        console.log(this.boots);
        let i: any, k: any;
        for ( i = 0; i < this.boots.length / 2; i++){
          this.boots1[i] = this.boots[i];
        }
        for ( k = 0; k < this.boots.length / 2; k++){
          this.boots2[k] = this.boots[i];
          i++;
        }
        this.bootsLoaded = true;
      }
      );
  }

}
