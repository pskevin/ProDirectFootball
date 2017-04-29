import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EventService {
  cartContents: number = 0;
  
  // Observable string sources
  private emitChangeSource = new Subject<any>();
  // Observable string streams
  changeEmitted$ = this.emitChangeSource.asObservable();
  // Service message commands
  emitChange(change: any) {
    this.emitChangeSource.next(change);
  }
  
  getContents() {
    return this.cartContents;
  }
  
  addToCart() {
    this.cartContents += 1;
    this.emitChange(this.cartContents);
  }
  
  removeFromCart() {
    this.cartContents -= 1;
    this.emitChange(this.cartContents);
  }
}
