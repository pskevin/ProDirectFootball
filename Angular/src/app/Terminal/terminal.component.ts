import { Component, OnInit } from '@angular/core';
import { HttpService } from "../Shared/http.service";
import { AuthService } from "../Shared/auth.service";
import { EventService } from "../Shared/event.service";

@Component({
  selector: 'pdf-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {
  /*img1src: string= `../../assets/images/productImages/roundabout/sliders/141404.jpg`;
  img2src: string= `../../assets/images/productImages/roundabout/sliders/141404(1).jpg`;
  img3src: string= `../../assets/images/productImages/roundabout/sliders/141404(2).jpg`;
  boottitle: string= `Puma evoSPEED 17.SL-S Kun City DF FG - Bluefish/Puma White/Quarry/Puma Black/Gold`;
  bootcollection: string= `Collection Name`;
  bootprice: string= `$200`;
  bootdetails: string= `Featuring his club colours, this Derby Fever version of the PUMA evoSPEED 17.1 SL.S will be pulled on by Sergio Agüero when Manchester City face arch rivals Manchester United at the Etihad Stadium on Thursday 27th April 2017.<br><br>The PUMA evoSPEED 17.SL S is constructed with microfibre upper material for the upper, while a laser-cut SPEEDFRAME structure optimises the boot’s shape further, providing support during forward acceleration and quick turns.`;
  */query: any;
  desc: string;
  name: string;
  collection: string;
  img1src: string;
  img2src: string;
  img3src: string;
  price: string;
  status: string;
  
  constructor (
    private http: HttpService,
    private auth: AuthService,
    private event: EventService
  ) {
    this.query = {
      "_id": this.auth.getBootID ()
    };
    this.http.fetchBoot(this.query)
      .subscribe(
        (boot) => {
          console.log(boot);
          this.name = boot.bname;
          this.collection = boot.coll;
          this.price = boot.saleprice;
          this.desc = boot.description;
          for(let i in boot.image) {
            switch( i ){
              case '0' :
                this.img1src = boot.image[i].data;
                break;
              case '1' :
                this.img2src = boot.image[i].data;
                break;
              case '2' :
                this.img3src = boot.image[i].data;
            }
          }
        }
      );
  }
  
  ngOnInit() {
  }
  
  basket(){
    this.event.addToCart();
  }
}
