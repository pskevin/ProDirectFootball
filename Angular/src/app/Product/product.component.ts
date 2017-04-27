import { Component, OnInit } from '@angular/core';
import { HttpService } from '../Shared/http.service';

@Component({
  selector: 'pdf-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ HttpService ]
})
export class ProductComponent implements OnInit {
  img: any;
  brand_logo: string = `puma`;
  collection: string = `<strong>COPA</strong>`;
  imgsrc: string = `../../assets/images/productImages/thumbs/144664.jpg`;
  overlayclass: string = `new`;
  overlaytext: string = `New`;
  bootname: string = `them boots`;
  bootprice: string = `200`;

  constructor(private http: HttpService) {
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
