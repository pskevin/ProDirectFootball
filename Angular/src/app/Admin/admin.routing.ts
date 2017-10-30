import {RouterModule, Routes} from '@angular/router';
import {StatsComponent} from './stats.component';
import {AdminComponent} from './admin.component';
import {StockComponent} from './stock.component';
import {WallpComponent} from './wallp.component';
import {AddbComponent} from './addb.component';


const ADMIN_ROUTES: Routes = [
  {
    path: '', component: AdminComponent, children: [
      {path: '', component: StatsComponent},
      {path: 'statistics', component: StatsComponent},
      {path: 'stock', component: StockComponent},
      {path: 'add_wallpaper', component: WallpComponent},
      {path: 'add_boots', component: AddbComponent}
    ]
  }
];

export const adminRouting = RouterModule.forChild(ADMIN_ROUTES);
