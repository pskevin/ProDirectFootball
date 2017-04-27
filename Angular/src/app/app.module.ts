import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './Navbar/navbar.component';
import { HomeComponent } from './Home/home.component';
import { AuthService } from './Shared/auth.service';
import { AuthGuard } from './Shared/auth.guard';
import { LocalStorageModule } from 'angular-2-local-storage';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './Login/login.component';
import { HttpService } from "./Shared/http.service";
import { ProductComponent } from './Product/product.component';
import { BootsComponent } from './Boots/boots.component';
import { BallsComponent } from './Balls/balls.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    ProductComponent,
    BootsComponent,
    BallsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    ReactiveFormsModule,
    LocalStorageModule.withConfig({
      prefix: 'pdf-app',
      storageType: 'localStorage'
    })
  ],
  providers: [AuthService, AuthGuard, HttpService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
