import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class PaymentGuard implements CanActivateChild {
  
  constructor(private auth: AuthService, private router: Router) { }
  
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log("USING GAURD" + this.auth.isLoggedIn());
    if(this.auth.isLoggedIn())
      return true;
    else {
      this.router.navigate(['./login']);
    }
  }
}
