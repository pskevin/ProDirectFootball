import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pdf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  spaceScreens: any;
  
  constructor() { }
  
  ngOnInit() {
   /* this.http.demo()
      .subscribe(res => {
        this.spaceScreens = res;
        console.log("UHH");
        console.log(this.spaceScreens);
      });*/
  }
}
