import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'pdf-registerp',
  templateUrl: './registerp.component.html',
  styleUrls: ['./registerp.component.css']
})
export class RegisterpComponent implements OnInit {
  // Form Variables
  myForm: FormGroup;
  userData: FormGroup;
  request: any;
  valid: {response: string, check: boolean} ;

  constructor(private formBuilder: FormBuilder){
    // Form controls
    this.myForm = formBuilder.group({
      'first_name': ['',[Validators.required]],
      'last_name': ['',[Validators.required]],
      'user_name': ['',[Validators.required]],
      'email_id': ['',[Validators.required]],
      'pass_word': ['',[Validators.required]],
      're_pass': ['',[Validators.required]],
      'otp_num': ['',[Validators.required]]
    });
    // this.valid = {
    //   response: '',
    //   check: false
    // };
  }

  ngOnInit(){

  }

  onSubmit(data: any) {
    this.request = {
      username: data.username,
      password: data.password
    };
    this.verifyUser(this.request);
  }

  verifyUser(request: any){

  }

}
