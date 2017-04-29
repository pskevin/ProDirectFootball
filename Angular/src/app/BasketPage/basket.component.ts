import { Component, OnInit } from '@angular/core';
import { HttpService } from "../Shared/http.service";
import { AuthService } from "../Shared/auth.service";
import { EventService } from "../Shared/event.service";
import { Boot } from "../Shared/boot.model";

@Component({
  selector: 'pdf-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  no_of_orders: number = 0;
  bootimg: string= `../../assets/images/productImages/thumbs/144664.jpg`;
  bootname: string= `Them Boots`;
  bootsize: string= `UK: 10`;
  bootquantity: string= `2`;
  bootprice: string= `$200`;
  totalamount: string= `$400`;
  isCartEmpty: boolean = false
  boots: Boot[] = [];
  
  constructor(
    private http: HttpService,
    private auth: AuthService,
    private event: EventService
  ) {
    if(this.auth.cartContents === 0){
      this.isCartEmpty = true;
    }
    else {
      this.boots = this.auth.getCart();
    }
  }

  ngOnInit() {
  }

}
