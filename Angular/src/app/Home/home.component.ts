import { Component, OnInit } from '@angular/core';
import {HttpService} from '../Shared/http.service';

@Component({
  selector: 'pdf-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  img_data: any;

  constructor(
    private http: HttpService
  ) {}

  ngOnInit() {
    this.http.getWallPaper()
      .subscribe(
        (result) => {
          this.img_data = 'data:image/jpg;base64,' + result;
        }
      );
  }
}
