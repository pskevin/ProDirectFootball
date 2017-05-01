import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class PaymentActivateGuard implements CanActivate{
  
  constructor(private auth: AuthService) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.auth.changeEmitted$.subscribe(
      (event) => {
        if(event.type === 'login') {
          return this.validate(this.auth.bool(event.change));
        }
      }
    );
    return this.validate(this.auth.isLoggedIn());
  }
  
  
  validate(check: boolean) {
    if(check){
      return true;
    }
  }
}
