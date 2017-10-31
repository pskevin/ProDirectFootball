import { Routes , RouterModule } from '@angular/router';
import { HomeComponent } from './Home/home.component';
import { ProductComponent } from './Product/product.component';
import { TerminalComponent} from './Terminal/terminal.component';
import { BasketComponent} from './BasketPage/basket.component';
import { RegisterpComponent} from './Register/registerp.component';
import { PaymentComponent } from './PaymentPage/payment.component';
import { ContactusComponent } from './FooterPages/contactus.component';
import { TandcComponent } from './FooterPages/tandc.component';
import { PrivacyComponent } from './FooterPages/privacy.component';
import { ActivateAdmin , PaymentActivateGuard } from './Shared/paymentActivate.guard';
import { PaymentDeactivateGuard } from './Shared/paymentDeactivate.guard';
import { OrdersComponent } from './MyOrders/orders.component';

const APP_ROUTES: Routes =  [
  { path: 'home', component: HomeComponent },
  { path: 'boots', component: ProductComponent },
  { path: 'terminal', component: TerminalComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'register', component: RegisterpComponent },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [PaymentActivateGuard],
    canDeactivate: [PaymentDeactivateGuard]
  },
  { path: 'contact_us', component: ContactusComponent },
  { path: 'tandc', component: TandcComponent },
  { path: 'my_orders', component: OrdersComponent },
  { path: 'admin', canActivate: [ActivateAdmin], loadChildren: 'app/Admin/admin.module#AdminModule' },
  { path: 'privacy', component: PrivacyComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

export const ROUTES = RouterModule.forRoot(APP_ROUTES);
