import { Injectable } from '@angular/core';
import { LocalStorageService } from "angular-2-local-storage";

@Injectable()
export class AuthService {
  //Declaring local service variables
  log: boolean = false;
  name: string;
  token: any;
  
  constructor(private local: LocalStorageService) {
    //localStorage.setItem('cookie',this.cookie);
  }

  
  isLoggedIn() {
    console.log("CHECKING");
    return this.bool(localStorage.getItem('log'));
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
  
  loggedIn(data: any) {
    console.log("LOGGED IN");
    this.storeLocally(data);
    this.name = data.userdata.username;
    this.token = data.userdata.token;
    this.log = true;
  }
  
  getToken() {
    return localStorage.getItem('token');
  }
  
  loggedOut() {
    localStorage.setItem('log','false');
    this.log = false;
    this.clear();
  }
  
  setCookie() {
    localStorage.setItem('cookie','true');
  }
  
  getCookie() {
    return this.bool(localStorage.getItem('cookie'));
  }
  
  clear() {
    console.log("REMOVING");
    console.log(localStorage);
    localStorage.removeItem('name');
    localStorage.removeItem('token');
  }
}
