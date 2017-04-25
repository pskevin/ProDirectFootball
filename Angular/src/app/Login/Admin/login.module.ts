import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './admin.component';
import { AdminStartComponent } from './admin-start.component';
import { ReactiveFormsModule } from '@angular/forms';
import { loginRoutes } from './login.routes';

@NgModule({
  imports: [
    CommonModule,
    loginRoutes,
    ReactiveFormsModule
  ],
  declarations: [
    AdminComponent,
    AdminStartComponent
  ],
  providers: []
})
export class LoginModule { }
