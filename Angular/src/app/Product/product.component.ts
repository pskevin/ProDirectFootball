import { Component, OnInit } from '@angular/core';
import { HttpService } from "../Shared/http.service";

@Component({
  selector: 'pdf-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ HttpService ]
})
export class ProductComponent implements OnInit {
  img:any;
  constructor(private http : HttpService) {
    this.http.startBoots()
      .subscribe(
        (x) => {
          console.log (x);
          this.img = x.data[0].image[1].data;
        }
      );
  }

  ngOnInit() {

  }

}
