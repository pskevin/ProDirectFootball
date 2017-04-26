import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../Shared/auth.service";
import { HttpService } from "../../Shared/http.service";

@Component({
  selector: 'pdf-admin-start',
  templateUrl: './admin-start.component.html',
  styleUrls: ['./admin-start.component.css']
  })

  export class AdminStartComponent implements OnInit {
  
    logout: boolean = false;
    
    constructor(private auth: AuthService, private http: HttpService) {
      console.log(this.auth.isLoggedIn());
      this.logout = this.auth.isLoggedIn();
    }
    onLogout() {
      this.http.logOut(this.auth.getToken()).subscribe(
        (response) => {
          console.log(response);
          this.auth.loggedOut();
        }
      );
    }
  
    ngOnInit() {
    }
  
  }
