import {RouterModule, Routes} from '@angular/router';
import {StatsComponent} from './stats.component';
import {AdminComponent} from './admin.component';
import {StockComponent} from './stock.component';


const ADMIN_ROUTES: Routes = [
  {
    path: '', component: AdminComponent, children: [
      {path: '', component: StatsComponent},
      {path: 'statistics', component: StatsComponent},
      {path: 'stock', component: StockComponent}
    ]
  }
];

export const adminRouting = RouterModule.forChild(ADMIN_ROUTES);
