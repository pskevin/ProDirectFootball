import { Component, OnInit } from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { HttpService } from "../Shared/http.service";
import { AuthService } from "../Shared/auth.service";

@Component({
  selector: 'pdf-registerp',
  templateUrl: './registerp.component.html',
  styleUrls: ['./registerp.component.css'],
  providers: [ HttpService ]
})

export class RegisterpComponent implements OnInit {
  // Form Variables
  myForm: FormGroup;
  myOtp: FormGroup;
  request: any;
  valid: {response: string, check: string, type: string} ;
  flag: any = -1;
  otp: any;

  constructor(
    private auth: AuthService,
    private http: HttpService,
    private formBuilder: FormBuilder
  ) {
    // Form controls
    this.myForm = formBuilder.group({
      'first_name': ['',[Validators.required]],
      'middle_name': ['',[Validators.required]],
      'last_name': ['',[Validators.required]],
      'add_ress': ['',[Validators.required]],
      'email_id': ['',[Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]],
      'mob_no': ['',[Validators.required]],
      'user_name': ['',[Validators.required]],
      'pass_word': ['',[Validators.required]],
      're_pass': ['',[Validators.required]],
    }, { validator: this.confirmpass }
    );
    this.myOtp = formBuilder.group({
      'otp_num': ['',[Validators.required]]
    });
    this.valid = {
      response: '',
      check: '',
      type: ''

    };
  }

  ngOnInit() {
    this.myForm.statusChanges.subscribe(
      (data) => console.log(data)
    );
  }

  confirmpass(group: FormGroup) {
    if (group.controls['pass_word'].value === group.controls['re_pass'].value) {
      return null;
    }
    else
      return false;
  }

  onSubmit(data: any, flag: any) {
    if (flag !== 1) {
      this.request = {
        username: data.user_name,
        password: data.pass_word,
        Fname: data.first_name,
        Mname: data.middle_name,
        Lname: data.last_name,
        email: data.email_id,
        mobno: data.mob_no,
        address: data.add_ress
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
    this.http.registerUser(request)
      .subscribe(
        (data) => {
          console.log(data);
          console.log(data.status == 'Registration Successful!');
          if(data.status === 'Registration Successful!') {
            console.log("asd"+request.username);
            this.auth.setUser(request.username);
            this.flag = 1;
          }
        }
      );
  }

  generateOtpMsg() {
    let user: string = this.auth.getUser();
    console.log(user);
    this.http.generateOtpMessage({username: user})
      .subscribe(
        (data) => {
          this.valid = {
            response: 'OTP has been sent to your registered Mobile Number!',
            check: 'otp',
            type: 'success'
          };
          console.log(this.valid);
        }
      );
  }

  generateOtpMail() {
    let user: string = this.auth.getUser();
    console.log(user);
    this.http.generateOtpMail({username: user})
      .subscribe(
        (data) => {
          this.valid = {
            response: 'OTP has been sent to your registered Email ID!',
            check: 'otp',
            type: 'success'
          };
          console.log(this.valid);
        }
      );
  }

  verifyOtp(otp: any) {
    let user: string = this.auth.getUser();
    this.http.verifyOtpAccount({username: user, otp: otp.otp})
      .subscribe(
        (data) => {
          if(data === 'Account successfully verified!') {
            console.log("Successful");
            this.auth.removeUser();
            this.valid = {
              response: 'Registration has been Successful!',
              check: 'otp',
              type: 'success'
            };
            setTimeout(
              () => {
                this.auth.navigateTo('boots');
              },
              1500
            );
          } else {
            this.valid = {
              response: 'OTP match failed. Re-enter the correct OTP please!',
              check: 'otp',
              type: 'danger'
            };
            this.myOtp.reset();
          }
        }
      );
  }
}
