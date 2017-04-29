import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../Shared/http.service';

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

  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder) {
    // Form controls
    this.myForm = formBuilder.group({
      'first_name': ['',[Validators.required]],
      'last_name': ['',[Validators.required]],
      'user_name': ['',[Validators.required]],
      'email_id': ['',[Validators.required]],
      'pass_word': ['',[Validators.required]],
      're_pass': ['',[Validators.required /*this.exampleValidator*/]],
      'add_ress': ['',[Validators.required]]
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
  exampleValidator(control): {[s: string]: boolean} {
    if ( /*password and confirm match*/) {
      return null;
    }
    else {
      return {example: true};
    }
  }

  onSubmit(data: any) {
    if (data.length === 7) {
      this.request = {
        firstname: data.first_name,
        lastname: data.last_name,
        username: data.user_name,
        emailid: data.email_id,
        password: data.pass_word,
        address: data.add_ress
      };
      this.registerUser(this.request);
    }
    else {
      this.request = {
        otp: data.otp_num
      };
      this.verifyOtp(this.request);
    }
  }

  registerUser(request: any) {
    this.http.registerUser(request)
      .subscribe(
        (data) => {
          console.log(data);
        }
      );
  }

  verifyOtp(request: any) {
    this.http.verifyOtp(request)
      .subscribe(
        (data) => {
          console.log(data);
        }
      );
  }

  generateOtpMail() {

  }
  generateOtpMsg() {

  }
}
