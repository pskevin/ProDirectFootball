import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsComponent } from './stats.component';
import {adminRouting} from './admin.routing';
import { AdminComponent } from './admin.component';
import { StockComponent } from './stock.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { WallpComponent } from './wallp.component';
import { AddbComponent } from './addb.component';
import {ImageUploadModule} from 'angular2-image-upload';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    ImageUploadModule.forRoot(),
    CommonModule,
    adminRouting,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  declarations: [ StatsComponent, AdminComponent, StockComponent, WallpComponent, AddbComponent ]
})
export class AdminModule { }
