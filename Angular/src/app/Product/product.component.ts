import { AnimationTransitionEvent, Component, OnInit } from '@angular/core';

import { HttpService } from '../Shared/http.service';
import { Boot } from "../Shared/boot.model";
import { AuthService } from "../Shared/auth.service";
import { bootStateTrigger } from "../Shared/boot.animations";

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
  brand_logo: string = `puma`;
  collection: string = `<strong>COPA</strong>`;
  imgsrc: string = `../../assets/images/productImages/thumbs/144664.jpg`;
  overlayclass: string = `new`;
  overlaytext: string = `New`;
  bootname: string = `them boots`;
  bootprice: string = `200`;
  brands: string[] = [];
  collections: string[] = [];
  boots: Boot[] = [];
  displayedBoots: Boot[] = [];
  prices: string[] = ['0-100','100-200','200-300'];
  isBrandSelected: boolean[] = [];
  isCollectionSelected: boolean[] = [];
  isPriceSelected: boolean[] = [false,false,false];
  
  constructor(
    private http: HttpService,
    private auth: AuthService
  ) {}
  
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
    this.http.startBoots()
      .subscribe(
        (x) => {
          console.log (x);
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
              ''
            ));
          }
          if(this.boots.length >= 1) {
            this.displayedBoots.push(this.boots[0]);
          }
        }
      );
  }
  
  toggleBrand(i) {
    if(this.isBrandSelected[i]){
      this.isBrandSelected[i] = false;
    }
    else {
      this.isBrandSelected[i] = true;
    }
  }
  
  toggleCollection(i) {
    if(this.isCollectionSelected[i]){
      this.isCollectionSelected[i] = false;
    }
    else {
      this.isCollectionSelected[i] = true;
    }
  }
  
  fetchBoot(i){
    console.log("FETCH BOOT" + this.boots[i].id);
    this.auth.fetchBoot(this.boots[i].id);
  }
  
  bootAnimated(event: AnimationTransitionEvent , id: number) {
    if(event.fromState != 'void') {
      return;
    }
    console.log(event);
    if(this.boots.length > (id+1)) {
      this.displayedBoots.push(this.boots[id+1]);
    }
    else {
      this.displayedBoots = this.boots;
    }
  }
}
