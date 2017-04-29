import { AnimationTransitionEvent, Component, OnInit } from '@angular/core';

import { HttpService } from '../Shared/http.service';
import { Boot } from "../Shared/boot.model";
import { AuthService } from "../Shared/auth.service";
import { bootStateTrigger } from "../Shared/boot.animations";
import { Query } from "../Shared/query.model";

@Component({
  selector: 'pdf-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ HttpService ],
  animations: [
    bootStateTrigger
  ]
})
export class ProductComponent implements OnInit {
  pageLoaded: boolean;
  img: any;
  brands: string[] = [];
  collections: string[] = [];
  boots: Boot[] = [];
  displayedBoots: Boot[] = [];
  prices: string[] = ['0-100','100-200','200-300'];
  isBrandSelected: boolean[] = [];
  isCollectionSelected: boolean[] = [];
  isPriceSelected: boolean[] = [false,false,false];
  qbrands: string[] = [];
  qcollections: string[] = [];
  qprice: number = 0;
  page: number = 0;
  query: Query;
  
  constructor(
    private http: HttpService,
    private auth: AuthService
  ) {
    this.pageLoaded = true;
  }
  
  ngOnInit() {
    this.pageLoaded = true;
    var acc = document.getElementsByClassName("accordion");
    var i;
    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight){
          panel.style.maxHeight = null;
        }
        else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
    this.http.startBoots()
      .subscribe(
        (x) => {
          this.makePage(x);
        }
      );
  }
  
  makePage(x: any) {
    this.clear();
    for(let brand of x.brand) {
      this.brands.push(brand);
      this.isBrandSelected.push(false);
    }
    for(let collection of x.collection) {
      this.collections.push(collection);
      this.isCollectionSelected.push(false);
    }
    for(let boot of x.data) {
      this.boots.push(new Boot(
        boot._id,
        boot.brand,
        boot.bname,
        boot.coll,
        boot.image[0].data,
        boot.saleprice,
        boot.status
      ));
    }
    if(this.boots.length >= 1) {
      this.displayedBoots.push(this.boots[0]);
    }
    this.pageLoaded = true;
  }
  
  toggleBrand(i) {
    if(this.isBrandSelected[i]){
      this.isBrandSelected[i] = false;
    }
    else {
      this.isBrandSelected[i] = true;
    }
    this.fireQuery();
  }
  
  toggleCollection(i) {
    if(this.isCollectionSelected[i]){
      this.isCollectionSelected[i] = false;
    }
    else {
      this.isCollectionSelected[i] = true;
    }
    this.fireQuery();
  }
  
  togglePrice(i) {
    for(let index in this.isPriceSelected) {
      if(index == i) {
        if (this.isPriceSelected[ index ] === true) {
          this.isPriceSelected[ index ] = false;
        }
        else {
          this.isPriceSelected[ index ] = true;
        }
      } else {
        this.isPriceSelected [ index ] = false;
      }
    }
    this.fireQuery();
  }
  
  fireQuery() {
    this.clearQueryVariables();
    for(let i in this.isBrandSelected) {
      if(this.isBrandSelected[i]) {
        this.qbrands.push(this.brands[i]);
      }
    }
    for(let i in this.isCollectionSelected) {
      if(this.isCollectionSelected[i]) {
        this.qcollections.push(this.collections[i]);
      }
    }
    for(let i in this.isPriceSelected) {
      if(this.isPriceSelected[i]) {
        this.qprice = (+i) + 1;
        break;
      }
      else {
        this.qprice = 0;
      }
    }
    this.query = new Query(this.page, this.qbrands, this.qcollections, this.qprice);
    this.http.filterBoots(this.query.makeQuery())
      .subscribe(
        (x) => {
          this.pageLoaded = false;
          console.log(x);
          this.makePage(x);
          this.pageLoaded = true;
        }
      )
  }
  
  clearQueryVariables(){
    this.qbrands = [];
    this.qcollections = [];
    this.qprice = 0;
  }
  
  clear(){
    this.brands = [];
    this.collections  = [];
    this.boots = [];
    this.displayedBoots = [];
    this.isBrandSelected = [];
    this.isCollectionSelected = [];
    this.isPriceSelected = [false,false,false];
  }
  
  fetchBoot(i){
    console.log("FETCH BOOT" + this.boots[i].id);
    this.auth.fetchBoot(this.boots[i].id);
  }
  
  bootAnimated(event: AnimationTransitionEvent , id: number) {
    if(event.fromState != 'void') {
      return;
    }
    //console.log(event);
    if(this.boots.length > (id+1)) {
      this.displayedBoots.push(this.boots[id+1]);
    }
    else {
      this.displayedBoots = this.boots;
    }
  }
}
