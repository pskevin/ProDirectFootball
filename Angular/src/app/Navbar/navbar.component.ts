import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../Shared/http.service';
import { AuthService } from '../Shared/auth.service';

@Component({
  selector: 'pdf-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  // Declaring variables
  myForm: FormGroup;
  request: any;
  valid: {response: string, check: boolean} ;
  logButton: string;
  loggedIn : boolean = false;
  cartContents: string = "";
  
  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private auth: AuthService
  ) {
    if(this.auth.checkCache()){
      if(this.auth.getCartContents() === 0){
        this.cartContents = "";
      }
      else {
        this.cartContents = JSON.stringify(this.auth.getCartContents());
      }
    }
    this.myForm = formBuilder.group({
      'username': ['',[Validators.required]],
      'password': ['',[Validators.required]],
      'rememberme': [false]
    });
    this.auth.changeEmitted$.subscribe(
      cart => {
        if(cart === 0){
          this.cartContents = "";
        }
        else {
          this.cartContents = cart;
        }
      });
    this.myForm.valueChanges.subscribe(data => console.log('Form changes', data));
    this.valid = {
      response: '',
      check: false
    };
  }
  
  ngOnInit() {
    if(this.auth.isLoggedIn()) {
      this.loggedIn = true;
      this.logButton = "Logout";
      console.log("LOGGED IN ALREADY BHAI");
      console.log(this.auth.isLoggedIn());
    }
    else {
      this.logButton = "Login";
    }
  }
  
  onSubmit(data: any) {
    console.log("COMES HERE");
    this.request = {
      username: data.username,
      password: data.password
    };
    this.verifyUser(this.request);
  }
  
  verifyUser(request: any) {
    this.http.verifyUser(request)
      .subscribe(
        (data) => {
          console.log(data);
          if(data === "Already logged in") {
            console.log("Logged in");
            this.valid.check = false;
            this.valid.response = "Already Logged In!";
          }
          else
          if(data === "Unauthorized"){
            console.log("Unauthorized");
            this.valid.check = false;
            this.valid.response = "Wrong Username or Password!";
          }
          else
          if(data === "Unverified"){
            console.log("Unverified");
            this.valid.check = false;
            this.valid.response = "Unverified Account!";
          }
          else
          if(data.success){
            console.log("ASDAD");
            this.valid.check = true;
            this.valid.response = "Valid User!";
            this.loggedIn = true;
            this.logButton = "Logout";
            this.auth.loggedIn({name: this.request.username, userdata: data});
          }
        }
      );
  }
  
  logout(){
    this.http.logOut(this.auth.getToken()).subscribe(
      (response) => {
        console.log(response);
        this.auth.loggedOut();
        this.loggedIn = false;
        this.logButton = "Login";
      }
    );
  }
}
