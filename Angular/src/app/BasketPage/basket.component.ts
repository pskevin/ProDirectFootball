import { Component, OnInit, AnimationTransitionEvent } from '@angular/core';
import { HttpService } from "../Shared/http.service";
import { AuthService } from "../Shared/auth.service";
import { Boot, BootOrder } from "../Shared/boot.model";
import { bootStateTrigger } from "../Shared/boot.animations";
import swal from 'sweetalert2';

@Component({
  selector: 'pdf-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
  animations: [
    bootStateTrigger
  ]
})
export class BasketComponent implements OnInit {
  no_of_orders: number = 0;
  totalamount: number = 0;
  isCartEmpty: boolean = false
  boots: Boot[] = [];
  displayedBoots: Boot[] = [];
  bootsQuantity: number[] = [];
  cart: any;

  constructor(
    private http: HttpService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.displayedBoots = [];
    if (!this.auth.checkCache()) {
      this.isCartEmpty = true;
    }
    else {
      this.cart = this.auth.getCart();
      this.boots = this.cart.boots;
      this.bootsQuantity = this.cart.quantity;
      this.no_of_orders = this.boots.length;
    }
    if (this.boots.length >= 1) {
      this.displayedBoots.push(this.boots[0]);
    }
    this.total();
  }

  total() {
    this.totalamount = 0;
    for (let i in this.boots) {
      this.totalamount += ((+this.boots[i].price) * (+this.bootsQuantity[i]));
    }
  }

  routeToBoots() {
    this.auth.navigateTo('boots');
  }

  routeToPayment() {
    if (this.auth.isLoggedIn()) {

      this.auth.navigateTo('payment');
    }
    else {
      this.auth.openModal();
    }
  }

  removeBoot(i) {
    swal({
      type: 'success',
      title: 'Boot removed',
      showConfirmButton: false,
      timer: 1500
    }).catch(
      (dismiss) => {
        console.log(dismiss);
        this.boots.splice(i, 1);
        this.bootsQuantity.splice(i, 1);
        this.no_of_orders = this.boots.length;
        this.auth.removeFromCart(this.boots, this.bootsQuantity);
        this.total();
        if (!this.auth.checkCache()) {
          this.isCartEmpty = true;
        }
      });
  }

  verifyStock() {
    let query: any = [];
    for(let i in this.boots) {
      query.push(new BootOrder(this.boots[i].name, this.bootsQuantity[i]).json())
    }
    console.log('Verifying stock');
    console.log(query);
    this.http.verifyStock(query)
      .subscribe(
        (res) => {
          if (res.status === '1') {
            console.log('Succes');
          } else {
            console.log('Fail');
          }
        }
      )
  }

  bootAnimated(event: AnimationTransitionEvent, id: number) {
    if (event.fromState != 'void') {
      return;
    }
    if (this.boots.length > (id + 1)) {
      this.displayedBoots.push(this.boots[id + 1]);
    }
    else {
      this.displayedBoots = this.boots;
    }
    if (id === this.boots.length - 1) {
      this.verifyStock();
    }
  }
}
