import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/Rx';
//import { AuthService } from "./auth.service";


@Injectable()
export class HttpService {

  constructor(private http: Http/*, private auth: AuthService*/) {
  }

  demo() {
    console.log("HERE");
    const body = JSON.stringify("");
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('https://localhost:3443/boot/im', body)
          .map((response: Response) => response.json());
  }
  logOut(token: string) {
      let headers = new Headers();
      headers.append('x-access-token', token);
      return this.http.get('https://localhost:8000/users/logout', {headers})
        .map((response: Response) => response.json());
      }
  /*
  startDashboard() {
    console.log("HTTP");
    return this.http.get('https://localhost:3443/dashboard')
      .map((response: Response) => response.json());
  }

  queryDashboard(data: any) {
    const body = JSON.stringify(data);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('https://localhost:3443/dashboard', body, {headers})
      .map((response: Response) => response.json());
  }
  
  verifyUser(data: any) {
    console.log("SENT");
    const body = JSON.stringify(data);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('https://localhost:8000/users/login', body, {headers})
      .map((response: Response) => response.json());
  }

  
    
    registerUser(token: string, request: any){
    console.log("INSIDE");
      const body =(request);
      let headers = new Headers();
      headers.append('x-access-token', token);
      return this.http.post('https://localhost:8000/users/register', body, {headers})
            .map((response: Response) => response.json());
    }
    
    addInstitute(token:string, request:any) {
      const body =(request);
      let headers = new Headers();
      headers.append('x-access-token', token);
      return this.http.post('https://localhost:8000/my_institute', body, {headers})
        .map((response: Response) => response.json());
    }*/
}
