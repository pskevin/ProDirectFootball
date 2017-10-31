import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../Shared/http.service";

@Component({
  selector: 'pdf-addb',
  templateUrl: './addb.component.html',
  styleUrls: ['./addb.component.css']
})
export class AddbComponent implements OnInit {

  img_t: any;
  img_l: any;
  img_r: any;
  img_o: any;
  name_t: any;
  name_o: any;
  name_r: any;
  name_l: any;
  myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService
  ) {
    this.myForm = formBuilder.group({
      'bname': ['', [Validators.required]],
      'brand': ['', [Validators.required]],
      'coll': ['', [Validators.required]],
      'costprice': ['', [Validators.required]],
      'saleprice': ['', [Validators.required]],
      'description': ['', [Validators.required]],
      'status': ['', [Validators.required]]
      }
    );
  }

  ngOnInit() {
  }

  onSubmit(data: any, name: any, flag: any){
    if (flag === 't') {
      this.img_t = data;
      this.name_t = name;
    }else
    if (flag === 'r') {
      this.img_r = data;
      this.name_r = name;
    }else
    if (flag === 'l') {
      this.img_l = data;
      this.name_l = name;
    }else
    if (flag === 'o') {
      this.img_o = data;
      this.name_o = name;
    }
  }

  sendBoot(data: any) {
    console.log(data);
    let request: any;
    request = {
      banme: data.bname,
      brand: data.brand,
      coll: data.coll,
      description: data.description,
      costprice: data.costprice,
      saleprice: data.saleprice,
      status: data.status,
      thumb: this.img_t,
      left: this.img_l,
      right: this.img_r,
      over: this.img_o
    };
    this.http.sendBoot(request)
      .subscribe(
        (result ) => {
          console.log(result);
      });
  }
}
