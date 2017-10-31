import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../Shared/http.service';

@Component({
  selector: 'pdf-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})


export class StockComponent implements OnInit {
  myForm: FormGroup;
  boots: any[][] = new Array(0);
  current: any;

  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder
  ) {
    this.myForm = formBuilder.group({
      'bname': ['', [Validators.required]],
      'addition': ['', [Validators.required]]
      }
    );
    this.myForm.valueChanges.subscribe(
      (data) => {
        console.log(data.bname);
        for (const boot of this.boots){
         if (boot[0] === data.bname) {
           console.log(boot[0]);
           console.log(boot[1]);
           this.current = boot[1];
         }
       }
      }
    );
  }

  ngOnInit() {
    this.http.getBootsForStock()
      .subscribe(
        (result) => {
          // console.log(result);
          let i: any = 0;
          for (const boot of result) {
            this.boots[i] = new Array(2);
            this.boots[i][0] = boot.bname;
            this.boots[i][1] = boot.stock;
            i++;
          }
        }
      );
  }

  sendStock(data: any) {
      let request: any;
      request = {
        bname: data.bname,
        quantity: data.addition,
      };
      console.log(request);
      this.http.sendStocks(request)
        .subscribe(
          (result) => {
            console.log(result);
            alert('Stock Updated!');
            window.location.reload();
          }
        );
  }
}
