import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl , FormGroup, FormBuilder } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { AppComponent } from '../../../app.component';
import { AuthService } from '../../../services/auth.service';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    AuthService
  ]
})
export class LoginComponent implements OnInit {

  msgs;
  display: boolean;
  login: FormGroup;

  constructor(
    private _Router: Router,
    private _FormBuilder: FormBuilder,
    private _SnotifyService: SnotifyService,
    private _AppComponent: AppComponent,
    private _AuthService: AuthService
  ) {
    this._AppComponent.header = false;
    this._AppComponent.footer = false;
    this.formatLogin();
  }

  ngOnInit() {
    $('body').removeClass();
    $('body').addClass('hold-transition login-page');
    $('#content').removeClass();
    $('#content').addClass('login-box');
    $('body').css('padding-top', '0');
  }

  formatLogin() {
    this.login = this._FormBuilder.group({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    this.display = true;
    this._AuthService.login(this.login.value).subscribe(
      response => {
        if ( response.user ) {
          this._SnotifyService.success('Bienvenido, solo un poco mas..', '¡Exito..!');
          if ( response.user.perfil === 'ALUMNO(A)' ) {
            this._AuthService.setAlumno(response.alumno);
          }
          this._AuthService.setToken(response.token);
          this._AuthService.setExpire(response.expire);
          this._AuthService.setIdentity(response.user);
        } else {
          this._SnotifyService.warning(response.data, '¡Atención..!');
        }
        this._Router.navigateByUrl('/inicio');
        this.display = false;
      },
      error => {
        this.errorRequest(error);
      }
    );
  }

  /* ----------------------------------------- */
  errorRequest(error) {
    if ( error.status === 401 ) {
      this._AuthService.sessionLogout();
      this._SnotifyService.error('No Autorizado', '¡Atención..!');
    } else {
      this._SnotifyService.error('Ocurrío un Error', '¡Atención..!');
    }
  }

  /*showGrowl(typeError, title, detail) {
    this.msgs = [];
    this.msgs.push({severity: typeError, summary: title, detail: detail});
  }*/

  /* ----------------------------------------- */

}
