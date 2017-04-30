import { Component, OnInit } from '@angular/core';
import { HttpService } from "../Shared/http.service";
import { AuthService } from "../Shared/auth.service";
import { Boot } from "../Shared/boot.model";

@Component({
  selector: 'pdf-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  no_of_orders: number = 0;
  totalamount: number = 0;
  isCartEmpty: boolean = false
  boots: Boot[] = [];
  bootsQuantity: number[] = [];
  cart: any;
  
  constructor(
    private http: HttpService,
    private auth: AuthService
  ) {
    if(!this.auth.checkCache()) {
      this.isCartEmpty = true;
    }
    else {
      this.cart = this.auth.getCart();
      this.boots = this.cart.boots;
      this.bootsQuantity = this.cart.quantity;
      this.no_of_orders = this.boots.length;
    }
    this.total();
  }
  
  ngOnInit() {
  }
  
  total() {
    for(let i in this.boots) {
      this.totalamount += ((+this.boots[i].price)*(+this.bootsQuantity[i]));
    }
  }
  
  routeToBoots() {
    this.auth.navigateTo('boots');
  }
  
  removeBoot(i) {
    this.boots.splice(i,1);
    this.bootsQuantity.splice(i,1);
    this.no_of_orders = this.boots.length;
    this.auth.removeFromCart(this.boots,this.bootsQuantity);
    this.total();
    if(!this.auth.checkCache()) {
      this.isCartEmpty = true;
    }
  }
}
