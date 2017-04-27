import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pdf-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  no_of_orders: string= `3`;
  bootimg: string= `../../assets/images/productImages/thumbs/144664.jpg`;
  bootname: string= `Them Boots`;
  bootsize: string= `UK: 10`;
  bootquantity: string= `2`;
  bootprice: string= `$200`;
  totalamount: string= `$400`;


  constructor() { }

  ngOnInit() {
  }

}
