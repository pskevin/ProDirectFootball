import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/Rx';

import { AuthService } from "./auth.service";


@Injectable()
export class HttpService {

  constructor(private http: Http, private auth: AuthService) {}

  verifyStock(query: any) {
    console.log("Verify Stock");
    const body = query;
    console.log(JSON.stringify(body));
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('https://localhost:3443/user/checkStock', body)
      .map((response: Response) => response.json());
  }

  fetchBoot(query: any){
    const body = query;
    console.log(body);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('https://localhost:3443/boot/landing', body)
      .map((response: Response) => response.json());
  }

  startBoots() {
    let data =  {};
    console.log("HERE");
    const body = data;
    console.log(body);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('https://localhost:3443/boot', body)
      .map((response: Response) => response.json());
  }

  filterBoots(query: any) {
    console.log("HERE");
    const body = query;
    console.log(JSON.stringify(body));
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('https://localhost:3443/boot', body)
      .map((response: Response) => response.json());
  }

  logOut(token: string) {
    console.log("Trying lgout");
    let headers = new Headers();
    headers.append('x-access-token', token);
    return this.http.get('https://localhost:3443/user/logout', {headers})
      .map((response: Response) => response.json());
  }

  verifyUser(data: any) {
    console.log("SENT");
    const body = JSON.stringify(data);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('https://localhost:3443/user/login', body, {headers})
      .map((response: Response) => response.json());
  }

  registerUser(request: any) {
    console.log("INSIDE");
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('https://localhost:3443/user/register', body, {headers})
      .map((response: Response) => response.json());
  }

  generateOtpMail(request: any) {
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('https://localhost:3443/user/generateOtpVerifyMail', body, {headers})
      .map((response: Response) => response.json());
  }

  generateOtpMessage(request: any) {
    const body = request;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('https://localhost:3443/user/generateOtpVerifyMessage', body, {headers})
      .map((response: Response) => response.json());
  }

  generateOtpPayment() {
    const body = {};
    console.log(body);
    let headers = new Headers();
    headers.append('x-access-token', this.auth.getToken());
    return this.http.post('https://localhost:3443/user/generateOtpPayment', body, {headers})
      .map((response: Response) => response.json());
  }

  verifyOtpAccount(request: any) {
    const body = request;
    console.log(body);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('https://localhost:3443/user/verifyOtpAccount', body, {headers})
      .map((response: Response) => response.json());
  }

  verifyOtpPayment(request: any) {
    const body = request;
    console.log(body);
    let headers = new Headers();
    headers.append('x-access-token', this.auth.getToken());
    console.log(headers);
    return this.http.post('https://localhost:3443/user/verifyOtpPayment', body, {headers})
      .map((response: Response) => response.json());
  }

  completePurchase(request: any) {
    const body = request;
    console.log(body);
    let headers = new Headers();
    headers.append('x-access-token', this.auth.getToken());
    console.log(headers);
    return this.http.post('https://localhost:3443/user/purchase', body, {headers})
      .map((response: Response) => response.json());
  }

  getOrders() {
    let headers = new Headers();
    headers.append('x-access-token', this.auth.getToken());
    console.log(headers);
    return this.http.get('https://localhost:3443/user/orders', {headers})
      .map((response: Response) => response.json());
  }

  sendComment(request: any) {
    let headers = new Headers();
    headers.append('x-access-token', this.auth.getToken());
    const body = request;
    return this.http.post('https://localhost:3443/user/comment', body, {headers})
      .map((response: Response) => response.json());
  }

  sendWallPaper(request: any) {
    let headers = new Headers();
    headers.append('x-access-token', this.auth.getToken());
    const body = request;
    return this.http.post('https://localhost:3443/wallpaper/add', body, {headers})
      .map((response: Response) => response.json());
  }

  getWallPaper(){
    let headers = new Headers();
    headers.append('x-access-token', this.auth.getToken());
    return this.http.post('https://localhost:3443/wallpaper', {headers})
      .map((response: Response) => response.json());
  }
}
