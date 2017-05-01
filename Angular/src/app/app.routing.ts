import { Routes , RouterModule} from '@angular/router';
import { HomeComponent } from './Home/home.component';
import { ProductComponent } from './Product/product.component';
import {TerminalComponent} from './Terminal/terminal.component';
import {BasketComponent} from './BasketPage/basket.component';
import {RegisterpComponent} from './Register/registerp.component';
import {PaymentComponent} from './Payment Page/payment.component';
import {ContactusComponent} from './FooterPages/contactus.component';
import {TandcComponent} from './FooterPages/tandc.component';
import {PrivacyComponent} from './FooterPages/privacy.component';

const APP_ROUTES: Routes =  [
  {path: 'home', component: HomeComponent},
  {path: 'boots', component: ProductComponent},
  {path: 'terminal', component: TerminalComponent},
  {path: 'basket', component: BasketComponent},
  {path: 'register', component: RegisterpComponent},
  {path: 'payment', component: PaymentComponent},
  {path: 'contact_us', component: ContactusComponent},
  {path: 'tandc', component: TandcComponent},
  {path: 'privacy', component: PrivacyComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home', pathMatch: 'full'},
];

export const ROUTES = RouterModule.forRoot(APP_ROUTES);
