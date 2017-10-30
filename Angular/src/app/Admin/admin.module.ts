import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsComponent } from './stats.component';
import {adminRouting} from './admin.routing';
import { AdminComponent } from './admin.component';
import { StockComponent } from './stock.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    adminRouting,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [StatsComponent, AdminComponent, StockComponent]
})
export class AdminModule { }
