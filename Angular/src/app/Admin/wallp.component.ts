import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../Shared/auth.service';
import {HttpService} from '../Shared/http.service';

@Component({
  selector: 'pdf-wallp',
  templateUrl: './wallp.component.html',
  styleUrls: ['./wallp.component.css']
})
export class WallpComponent implements OnInit {

  myForm: FormGroup;
  file: any;
  wname: any;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private http: HttpService
  ) {
    // this.myForm = formBuilder.group({
    //     'wallp': ['', [Validators.required]],
    //   }
    // );
  }

  onSubmit(data: any, name: any) {
    this.file = data.substr(23);
    this.wname = name;
  }

  sendWall() {
    let request: any;
    request = {
      data: this.file,
      name: this.wname
    };
    console.log(request);
    this.http.sendWallPaper(request)
      .subscribe(
        (result) => {
          console.log(result);
          alert('Wallpaper added! Clear and upload the next one.');
        }
      );
  }

  ngOnInit() {
  }

}
