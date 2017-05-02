import { AnimationTransitionEvent, Component, OnInit } from '@angular/core';

import { HttpService } from '../Shared/http.service';
import { Boot } from "../Shared/boot.model";
import { AuthService } from "../Shared/auth.service";
import { bootStateTrigger } from "../Shared/boot.animations";
import { Query, QueryStack } from "../Shared/query.model";

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
  page: number[] = [];
  activePage: number = 1;
  totalPages: number;
  query: Query;
  queryStack: QueryStack[] = [];
  queryMode: string;
  
  constructor(
    private http: HttpService,
    private auth: AuthService
  ) {
  }
  
  ngOnInit() {
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
    this.startBoots();
  }
  
  startBoots() {
    this.http.startBoots()
      .subscribe(
        (x) => {
          console.log(x);
          console.log(this.collections);
          this.queryMode = 'content';
          this.makePage(x);
        }
      );
  }
  
  makePage(x: any) {
    this.clear();
    if(this.queryMode === 'content') {
      this.totalPages = x.pages;
      this.initializePage (this.totalPages);
      this.setPage (0);
    }
    for(let brand of x.brand) {
      this.brands.push(brand);
      this.isBrandSelected.push(false);
    }
    for(let collection of x.collection) {
      this.collections.push(collection);
      this.isCollectionSelected.push(false);
    }
    for(let boot of x.data) {
      if(boot.status === 'none') {
        this.boots.push(new Boot(
          boot._id,
          boot.brand,
          boot.bname,
          boot.coll,
          boot.image[0].data,
          boot.saleprice,
          ''
        ));
      } else {
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
    }
    if(this.boots.length >= 1) {
      this.displayedBoots.push(this.boots[0]);
    }
    if(this.queryStack.length > 0) {
      for(let query of this.queryStack) {
        switch(query.clicked) {
          case 'brand' :
            this.isBrandSelected[this.brands.indexOf(query.selected)] = true;
            break;
          case 'collection' :
            this.isCollectionSelected[this.collections.indexOf(query.selected)] = true;
            break;
          case 'price':
            this.isPriceSelected[this.prices.indexOf(query.selected)] = true;
        }
      }
    }
  }
  
  nextPage(){
    if(this.activePage != (this.totalPages-1)) {
      this.setPage(this.activePage + 1);
      this.queryStack.push(new QueryStack("","",this.activePage));
      this.queryMode = 'page';
      this.fireQuery();
    }
  }
  
  previousPage(){
    if(this.activePage != 0) {
      this.setPage(this.activePage - 1);
      this.queryStack.push(new QueryStack("","",this.activePage));
      this.queryMode = 'page';
      this.fireQuery();
    }
  }
  
  setPage(x){
    this.activePage = x;
    for(let i in this.page) {
      if(i == x) {
        this.page[i] = 1;
      } else {
        this.page[i] = 0;
      }
    }
    console.log(this.page);
  }
  
  initializePage(x){
    this.page.push(1);
    for(let i = 1; i < x; i++) {
      this.page.push(0);
    }
  }
  
  toggleBrand(i) {
    let index: string = '-1';
    
    if(this.isBrandSelected[i]){
      this.isBrandSelected[i] = false;
    }
    else {
      this.isBrandSelected[i] = true;
    }
    for(let j in this.queryStack) {
      index = j;
      console.log('index - '+index);
      if(
        this.queryStack[j].clicked == 'brand' &&
        this.queryStack[j].selected == this.brands[i] &&
        (!this.isBrandSelected[i])
      ) {
        break;
      }
    }
    if((index == '-1') || (this.queryStack[(+index)].selected != this.brands[i])) {
      this.queryStack.push (new QueryStack ("brand", this.brands[ i ], this.activePage));
      console.log(this.queryStack);
    } else {
      this.queryStack.splice((+index),1);
    }
    this.queryMode = 'content';
    this.fireQuery();
  }
  
  toggleCollection(i) {
    let index: string = '-1';
    
    if(this.isCollectionSelected[i]){
      this.isCollectionSelected[i] = false;
    }
    else {
      this.isCollectionSelected[i] = true;
    }
    for(let j in this.queryStack) {
      index = j;
      if(
        this.queryStack[j].clicked == 'collection' &&
        this.queryStack[j].selected == this.collections[i] &&
        (!this.isCollectionSelected[i])
      ) {
        break;
      }
    }
    if((index == '-1') || (this.queryStack[(+index)].selected != this.collections[i])) {
      this.queryStack.push (new QueryStack ("collection", this.collections[ i ], this.activePage));
    } else {
      this.queryStack.splice((+index),1);
    }
    this.queryMode = 'content';
    this.fireQuery();
  }
  
  togglePrice(i) {
    let index: string = '-1';
    
    for(let j in this.isPriceSelected) {
      if(j == i) {
        if (this.isPriceSelected[ j ]) {
          this.isPriceSelected[ j ] = false;
        }
        else {
          this.isPriceSelected[ j ] = true;
        }
      } else {
        this.isPriceSelected [ j ] = false;
      }
    }
    
    for(let j in this.queryStack) {
      index = j;
      if(
        this.queryStack[j].clicked == 'price' &&
        this.queryStack[j].selected == this.prices[i] &&
        (!this.isPriceSelected[i])
      ) {
        break;
      }
    }
    if((index == '-1') || (this.queryStack[(+index)].selected != this.prices[i])) {
      for(let j in this.queryStack) {
        if(this.queryStack[j].clicked === 'price') {
          this.queryStack.splice((+j),1);
        }
      }
      this.queryStack.push (new QueryStack ("price", this.prices[ i ], this.activePage));
    } else {
      this.queryStack.splice((+index),1);
    }
    this.queryMode = 'content';
    this.fireQuery();
  }
  
  
  fireQuery() {
    console.log(this.queryStack);
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
    this.query = new Query(this.page.indexOf(1), this.qbrands, this.qcollections, this.qprice);
    
    this.http.filterBoots(this.query.makeQuery())
      .subscribe(
        (x) => {
          console.log("MAKING PAGE");
          console.log(x);
          this.makePage(x);
        }
      )
  }
  
  clearQueryVariables(){
    this.qbrands = [];
    this.qcollections = [];
    this.qprice = 0;
  }
  
  clear(){
    if(this.queryMode === 'content') {
      this.page = [];
    }
    this.brands = [];
    this.collections  = [];
    this.boots = [];
    this.displayedBoots = [];
    this.isBrandSelected = [];
    this.isCollectionSelected = [];
    this.isPriceSelected = [false,false,false];
    console.log("RESETTTT");
    console.log(this.collections);
  }
  
  reset(){
    console.log("STARTING RESET");
    this.query = null;
    this.queryStack = [];
    this.clearQueryVariables();
    this.startBoots();
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


