import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl , FormGroup, FormBuilder } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { AuthService } from '../../../services/auth.service';

declare var $: any;

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
  providers: [
    AuthService
  ]
})
export class PasswordComponent implements OnInit {

  title = 'Cambiar Contraseña';
  msgs: any;

  user: FormGroup;
  display: boolean;

  constructor(
    private _Router: Router,
    private _FormBuilder: FormBuilder,
    private _SnotifyService: SnotifyService,
    private _AuthService: AuthService,
  ) {
    this.user = this._FormBuilder.group({
      password: new FormControl('', Validators.required),
      pass: new FormControl('', Validators.required),
      confirm: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
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
    if ( this.user.value.pass.length < 6 ) {
      this.user.patchValue({pass: '', confirm: ''});
      this._SnotifyService.info('La contraseña no puede ser menor de 6 dígitos', 'Atención..!');
      $('input[formControlName="pass"]').focus();
      return;
    } else if ( this.user.value.pass !== this.user.value.confirm ) {
      this.user.patchValue({pass: '', confirm: ''});
      this._SnotifyService.info('Las Contraseñas no coinciden', 'Atención..!');
      $('input[formControlName="pass"]').focus();
      return;
    } else {
      this.display = true;
      this._AuthService.password(this.user.value).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 201 ) {
            this._SnotifyService.success('Contraseña Cambiada Correctamente', '¡Exito..!');
            $('form').trigger('reset');
            $('input[formControlName="password"]').focus();
          } else {
            this._SnotifyService.warning(response.data, '¡Atención..!');
          }
          this.display = false;
        },
        error => {
          this.errorRequest(error);
        }
      );
    }
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
