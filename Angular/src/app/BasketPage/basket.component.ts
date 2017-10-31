import { Component, OnInit, AnimationTransitionEvent } from '@angular/core';
import { HttpService } from "../Shared/http.service";
import { AuthService } from "../Shared/auth.service";
import { Boot, BootOrder } from "../Shared/boot.model";
import { bootStateTrigger } from "../Shared/boot.animations";
import swal from 'sweetalert2';

declare var $: any;

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
  loadingComplete: boolean = false;

  constructor(
    private http: HttpService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.displayedBoots = [];
    this.loadingComplete = false;
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
            console.log('Stock is available');
          } else {
            console.log('Stock is unavailable');
            let html = '<i>The following boots have inadequate stock - </i>\
              <table><thead><th>Name</th><th>Available Quantity</th></thead><tbody>';
            res.data.forEach((boot) => {
              html += '<tr><th>'+ boot.bname + '</th><th>' + boot.stock + '</th></tr><br/>'
            });
            html += '</tbody></table>';
            swal({
              type: 'error',
              title: 'Oops!',
              confirmButtonColor: '#f27474',
              confirmButtonText: 'Remove boots from Basket',
              html: html
            }).then(
              () => {
                let faultyNames = res.data.map((faultyBoot) => (faultyBoot.bname)),
                  acceptedIndices = this.boots.map((addedBoot) => {
                    return !faultyNames.some((faultyName) => (faultyName === addedBoot.name));
                  })
                this.boots = this.boots.filter((boot,i) => (acceptedIndices[i]));
                this.bootsQuantity = this.bootsQuantity.filter((quan,i) => (acceptedIndices[i]));
                console.log(acceptedIndices);
                console.log(this.boots);
                console.log(this.bootsQuantity);
                this.auth.removeFromCart(this.boots, this.bootsQuantity);
                this.ngOnInit();
              }
            )
            .catch(
              (dismiss) => {
                console.log(dismiss);
                this.verifyStock();
              }
            );
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
      console.log('Finished animating');
      this.verifyStock();
      this.loadingComplete = true;
    }
  }
}
