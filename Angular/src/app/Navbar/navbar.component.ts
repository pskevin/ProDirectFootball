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
  
  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private auth: AuthService
  ) {
    this.myForm = formBuilder.group({
      'username': ['',[Validators.required]],
      'password': ['',[Validators.required]],
      'rememberme': ['']
    });
    this.myForm.valueChanges.subscribe(data => console.log('Form changes', data));
    this.valid = {
      response: '',
      check: false
    };
  }
  
  ngOnInit(){
    if(this.auth.isLoggedIn()) {
      console.log("LOGGED IN ALREADY BHAI");
      console.log(this.auth.isLoggedIn());
    }
  }
  
  onSubmit(data: any) {
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
            this.valid.response = "Unauthorized attempt!";
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
            this.auth.loggedIn({name: this.request.username, userdata: data});
          }
        }
      );
  }
}
