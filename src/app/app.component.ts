import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    AuthService
  ]
})
export class AppComponent implements OnInit {

  identity: any;
  alumno: any;
  url: any;

  header: boolean;
  footer: boolean;

  constructor(
    private _AuthService: AuthService
  ) {
    this.header = true;
    this.footer = true;
    this.identity = this._AuthService.getIdentity();
    this.alumno = this._AuthService.getAlumno();
    this.url = this._AuthService.url();
  }

  ngOnInit() {
  }

}
