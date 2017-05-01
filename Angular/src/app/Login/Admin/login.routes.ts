import {Routes, RouterModule} from '@angular/router';

import {AdminStartComponent} from './admin-start.component';
import {AdminComponent} from './admin.component';
import { PaymentGuard } from '../../Shared/payment.guard';


const LOGIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminStartComponent,
    canActivateChild: [PaymentGuard],
    children: [
      {path: '', component: AdminComponent}
    ]
  }
];

export const loginRoutes = RouterModule.forChild(LOGIN_ROUTES);

