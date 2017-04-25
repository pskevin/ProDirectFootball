import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './admin.component';
import { AdminStartComponent } from './admin-start.component';
import { ReactiveFormsModule } from '@angular/forms';
import { loginRoutes } from './login.routes';
import { HttpService } from '../../Shared/http.service';
import { AuthService } from '../../Shared/auth.service';

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
  providers: [
    HttpService,
    AuthService
  ]
})

export class LoginModule { }
