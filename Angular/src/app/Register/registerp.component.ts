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
  myOtp: FormGroup;
  request: any;
  valid: {response: string, check: boolean} ;
  flag: any = -1;

  constructor(private formBuilder: FormBuilder) {
    // Form controls
    this.myForm = formBuilder.group({
      'first_name': ['',[Validators.required]],
      'last_name': ['',[Validators.required]],
      'add_ress': ['',[Validators.required]],
      'email_id': ['',[Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]],
      'user_name': ['',[Validators.required]],
      'pass_word': ['',[Validators.required]],
      're_pass': ['',[Validators.required]]
    });
    this.myOtp = formBuilder.group({
      'otp_num': ['',[Validators.required]]
    });
    // this.valid = {
    //   response: '',
    //   check: false
    // };
  }

  ngOnInit() {

  }

  onSubmit(data: any, flag: any) {
    if (flag !== 1) {
      this.request = {
        firstname: data.first_name,
        lastname: data.last_name,
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


}
