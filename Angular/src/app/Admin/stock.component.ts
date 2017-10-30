import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'pdf-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
myForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ){
    this.myForm = formBuilder.group({
      'addition': ['', [Validators.required]],
      }
    );
  }

  ngOnInit() {
  }

}
