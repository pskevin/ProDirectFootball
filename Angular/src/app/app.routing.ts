import { Routes , RouterModule} from '@angular/router';
import { HomeComponent } from './Home/home.component';
import { ProductComponent } from './Product/product.component';
import {TerminalComponent} from './Terminal/terminal.component';
import {BasketComponent} from './BasketPage/basket.component';
import {RegisterpComponent} from './Register/registerp.component';

const APP_ROUTES: Routes =  [
  {path: 'home', component: HomeComponent},
  {path: 'boots', component: ProductComponent},
  {path: 'terminal', component: TerminalComponent},
  {path: 'basket', component: BasketComponent},
  {path: 'register', component: RegisterpComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home', pathMatch: 'full'}
];

export const ROUTES = RouterModule.forRoot(APP_ROUTES);
