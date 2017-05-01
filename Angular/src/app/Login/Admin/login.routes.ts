import {Routes, RouterModule} from '@angular/router';

import {AdminStartComponent} from './admin-start.component';
import {AdminComponent} from './admin.component';

const LOGIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminStartComponent,
    children: [
      {path: '', component: AdminComponent}
    ]
  }
];

export const loginRoutes = RouterModule.forChild(LOGIN_ROUTES);

