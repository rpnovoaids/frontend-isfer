import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl , FormGroup, FormBuilder } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { AppComponent } from '../../../app.component';
import { AuthService } from '../../../services/auth.service';

declare var $: any;

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.css'],
  providers: [
    AuthService
  ]
})
export class LockscreenComponent implements OnInit {

  msgs: any;
  user: FormGroup;
  identity: any;
  time: any;
  url: any;
  display: boolean;

  constructor(
    private _Router: Router,
    private _FormBuilder: FormBuilder,
    private _SnotifyService: SnotifyService,
    private _AppComponent: AppComponent,
    private _AuthService: AuthService
  ) {
    this._AppComponent.header = false;
    this._AppComponent.footer = false;
    this.identity =  this._AuthService.getIdentity();
    this.url = this._AuthService.url();
    this.user = this._FormBuilder.group({
      email: new FormControl(this.identity ? this.identity.email : null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  ngOnInit() {
    $('body').removeClass();
    $('body').addClass('hold-transition lockscreen');
    $('#content').removeClass();
    $('#content').addClass('lockscreen-wrapper');
    this.startTime();
    this._AuthService.refresh().subscribe(
      response => {
        this._AuthService.setToken(response.token);
        if ( response.status !== 200 ) {
          this._SnotifyService.warning(response.data, '¡Atención..!');
        }
      },
      error => {
        this.errorRequest(error);
      }
    );
  }

  onSubmit() {
    this.display = true;
    this._AuthService.login(this.user.value).subscribe(
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
      this._SnotifyService.error('No Autorizado', 'Atención..!');
    } else {
      this._SnotifyService.error('Ocurrío un Error', 'Atención..!');
    }
  }

  /*showGrowl(typeError, title, detail) {
    this.msgs = [];
    this.msgs.push({severity: typeError, summary: title, detail: detail});
  }*/

  startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();

    // add a zero in front of numbers<10
    m = this.checkTime(m);
    s = this.checkTime(s);

    /*Check for PM and AM*/
    const day_or_night = ( h > 11 ) ? 'PM' : 'AM';

    /*Convert to 12 hours system*/
    if (h > 12) {
      h -= 12;
    }

    /*Add time to the headline and update every 500 milliseconds*/
    this.time = h + ':' + m + ':' + s + ' ' + day_or_night;
    setTimeout(() => {
      this.startTime();
    }, 500);
  }

  checkTime(i) {
    if ( i < 10) {
      i = '0' + i;
    }
    return i;
  }

  /* ----------------------------------------- */

}
