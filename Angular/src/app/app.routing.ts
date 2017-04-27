import { Routes , RouterModule} from "@angular/router";
import { HomeComponent } from "./Home/home.component";
import { ProductComponent } from "./Product/product.component";

const APP_ROUTES : Routes =  [
  {path: 'home', component: HomeComponent},
  {path: 'boots', component: ProductComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home', pathMatch: 'full'}
];

export const ROUTES = RouterModule.forRoot(APP_ROUTES);
