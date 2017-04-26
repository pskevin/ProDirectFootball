import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpService } from "../Shared/http.service";

@Component({
  selector: 'pdf-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  //Declaring variables
  myForm: FormGroup;
  
  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder
  ) {
    this.myForm = formBuilder.group({
      'username': ['',[Validators.required]],
      'password': ['',[Validators.required]],
      'rememberme': ['']
    });
  }
  
  ngOnInit() {
  }
  
}
