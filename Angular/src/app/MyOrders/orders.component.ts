import { Component, OnInit } from '@angular/core';
import {HttpService} from '../Shared/http.service';
import {Boot, Order} from '../Shared/boot.model';

@Component({
  selector: 'pdf-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  boots: Boot[] = [];
  bootQuantity: number[] =[];
  totalAmount: number[] = [];

  constructor(
    private http: HttpService
  ) {
      console.log('Here');
      this.http.getOrders()
        .subscribe(
          (data) => {
            console.log(data);
            for (let order of data.orders) {
              this.boots = [];
              this.bootQuantity = [];
              for (let boot of order.orderId.product) {
                this.boots.push(new Boot(
                  '',
                  '',
                  boot.productId.bname,
                  '',
                  boot.productId.image[0].data,
                  boot.salecost,
                  ''
                ));
                this.bootQuantity.push(boot.quantity);
              }
              this.totalAmount.push(this.total(this.boots));
              console.log(order.orderId._id);
              this.orders.push(new Order(order.orderId._id,this.boots,this.bootQuantity));
            }
            console.log(this.orders);
          }
        );
  }

  ngOnInit(){
  }

  total(boots: Boot[]){
    let amount: number = 0;

    for(let boot of boots) {
      amount += +boot.price;
    }
    return amount;
  }
}
