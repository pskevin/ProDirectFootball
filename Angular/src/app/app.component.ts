import { Component, OnInit } from '@angular/core';
import { AuthService } from "./Shared/auth.service";

@Component({
  selector: 'pdf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  spaceScreens: any;
  
  constructor() {}
  
  ngOnInit() {
  }
}
