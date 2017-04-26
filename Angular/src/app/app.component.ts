import { Component, OnInit } from '@angular/core';
import { HttpService } from './Shared/http.service';

@Component({
  selector: 'pdf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpService]
})
export class AppComponent implements OnInit {
  spaceScreens: any;
  
  constructor(private http: HttpService) { }
  
  ngOnInit() {
    this.http.demo()
      .subscribe(res => {
        this.spaceScreens = res;
        console.log("UHH");
        console.log(this.spaceScreens);
      });
  }
}
