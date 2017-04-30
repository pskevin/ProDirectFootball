import { Component, OnInit } from '@angular/core';
import {Boot} from '../Shared/boot.model';
import {AuthService} from '../Shared/auth.service';
import {HttpService} from '../Shared/http.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'pdf-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  no_of_orders: number = 0;
  totalamount: number = 0;
  isCartEmpty: boolean = false
  boots: Boot[] = [];
  bootsQuantity: number[] = [];
  cart: any;
  flag: any = -1;
  myForm: FormGroup;
  myOtp: FormGroup;
  request: any;

  constructor(
    private http: HttpService,
    private auth: AuthService,
    private formBuilder: FormBuilder
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
    this.myForm = formBuilder.group({
      'card_num': ['',[Validators.required]],
      'month': ['',[Validators.required]],
      'year': ['',[Validators.required]],
      'cvv': ['',[Validators.required]]
    });
    this.myOtp = formBuilder.group({
      'otp_num': ['',[Validators.required]]
    });
  }

  ngOnInit() {
  }

  onSubmit(data: any, flag: any) {
    if (flag !== 1) {
      this.request = {
        username: data.username,
        password: data.password,
      };
      this.verifyUser(this.request);
    }
    else {
      this.request = {
        otp: data.otp_num,
      };
      this.verifyOtp(this.request);
    }
  }
  verifyUser(request: any) {
    console.log(request);
  }

  generateOtpMsg() {

  }

  generateOtpMail() {

  }
  verifyOtp(request: any) {
    console.log(request);
  }

  total() {
    for(let i in this.boots) {
      this.totalamount += ((+this.boots[i].price)*(+this.bootsQuantity[i]));
    }
  }

  routeToHome() {
    this.auth.navigateTo('home');
  }

  removeBoot(i) {
    this.boots.splice(i,1);
    this.bootsQuantity.splice(i,1);
    this.auth.removeFromCart(this.boots,this.bootsQuantity);
    this.total();
    if(!this.auth.checkCache()) {
      this.isCartEmpty = true;
    }

  }
}
