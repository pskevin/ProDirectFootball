import {Routes, RouterModule} from '@angular/router';

import {AdminStartComponent} from './admin-start.component';
import {AdminComponent} from './admin.component';
import { AuthGuard } from '../../Shared/Services/auth.guard';


const LOGIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminStartComponent,
    canActivateChild: [AuthGuard],
    children: [
      {path: '', component: AdminComponent}
    ]
  }
];

export const loginRoutes = RouterModule.forChild(LOGIN_ROUTES);

