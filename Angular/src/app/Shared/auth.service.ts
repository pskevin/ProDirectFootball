import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-2-local-storage";
import { Boot } from "./boot.model";
import { Query } from "./query.model";

@Injectable()
export class AuthService {
  
  constructor(
    private router: Router,
    private local: LocalStorageService
  ) {}
  
  /*---> USER RELATED STORAGE SERVICES <---*/
  //Declaring user service variables
  log: boolean = false;
  name: string;
  tempName: string;
  token: any;
  
  setUser(name: string) {
    console.log("SET CACHE");
    localStorage.setItem('tempUser',name);
  }
  
  getUser() {
    return localStorage.getItem('tempUser');
  }
  
  removeUser() {
    localStorage.removeItem('tempUser');
  }
  
  isLoggedIn() {
    console.log("CHECKING");
    return this.bool(localStorage.getItem('log'));
  }
  
  loggedIn(data: any) {
    console.log("LOGGED IN");
    this.storeLocally(data);
    this.name = data.userdata.username;
    this.token = data.userdata.token;
    this.log = true;
  }
  
  storeLocally(data: any) {
    localStorage.setItem('name',data.userdata.username);
    localStorage.setItem('token',data.userdata.token);
    localStorage.setItem('log','true');
  }
  
  bool(str: string): boolean {
    if(str === 'true')
      return true;
    else
    if(str === 'false')
      return false;
  }
  
  getToken() {
    return localStorage.getItem('token');
  }
  
  loggedOut() {
    localStorage.setItem('log','false');
    this.log = false;
    this.clear();
  }
  
  clear() {
    console.log("REMOVING");
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    console.log(localStorage);
  }
  
  /*---> BOOT RELATED STORAGE SERVICES <---*/
  //Declaring boot service variables
  bootid: string;
  boots: Boot[] = [];
  bootQuantity: number[] = [];
  cartContents: number = 0;
  cart : any;
  query: Query;
  
  // Observable string sources
  private emitChangeSource = new Subject<any>();
  
  // Observable string streams
  changeEmitted$ = this.emitChangeSource.asObservable();
  
  // Service message commands
  emitChange(change: any) {
    this.emitChangeSource.next(change);
  }
  
  fetchBoot(id){
    this.bootid = id;
    this.navigateTo("terminal");
  }
  
  getBootID(){
    return this.bootid;
  }
  
  navigateTo(url: string) {
    console.log("ZABARDASTI");
    this.router.navigate(['./'+url]);
  }
  
  checkCache() {
    if(localStorage.getItem('boots') && localStorage.getItem('quantity')){
      this.boots = JSON.parse (localStorage.getItem ('boots'));
      this.bootQuantity = JSON.parse (localStorage.getItem (('quantity')));
      console.log (JSON.parse (localStorage.getItem (('quantity'))));
      this.cartContents = this.boots.length;
      if((this.boots.length >= 1) && (this.bootQuantity.length >= 1)) {
        return true;
      }
      else {
        console.log("EMPTY");
        return false;
      }
    }
    else {
      return false;
    }
  }
  
  addToCart(boot: Boot, quantity: number) {
    this.checkCache();
    this.cartContents += 1;
    this.boots.unshift(boot);
    this.bootQuantity.unshift(quantity);
    if(this.cartContents > 1) {
      localStorage.removeItem('boots');
      localStorage.removeItem('quantity');
    }
    localStorage.setItem('boots',JSON.stringify(this.boots));
    localStorage.setItem('quantity',JSON.stringify(this.bootQuantity));
    this.emitChange(this.cartContents);
  }
  
  removeFromCart(boots: Boot[], quantity: number[]) {
    this.checkCache();
    this.cartContents -= 1;
    this.boots = boots;
    this.bootQuantity = quantity;
    if(this.cartContents > 0) {
      localStorage.removeItem('boots');
      localStorage.removeItem('quantity');
    }
    localStorage.setItem('boots',JSON.stringify(this.boots));
    localStorage.setItem('quantity',JSON.stringify(this.bootQuantity));
    this.emitChange(this.cartContents);
  }
  
  getCart() {
    this.cart = {
      boots: this.boots,
      quantity: this.bootQuantity
    };
    return this.cart ;
  }
  
  getCartContents(){
    this.checkCache();
    return this.boots.length;
  }
}
