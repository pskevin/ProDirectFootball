import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import {LocalStorageService} from "angular-2-local-storage";

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

@Injectable()
export class ActivateAdmin implements CanActivate {
  constructor(
    private local: LocalStorageService,
    private router: Router,
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('admin')){
      return true;
    }
    else{
      this.router.navigateByUrl('/home');
      return (false);
    }
  }
}
