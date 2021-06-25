import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl , FormGroup, FormBuilder } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { AuthService } from '../../../services/auth.service';
import { UsuariosService } from '../../../services/usuarios.service';

declare var $: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  providers: [
    AuthService,
    UsuariosService
  ]
})
export class UsuariosComponent implements OnInit {

  title = 'Usuarios';
  msgs: any;
  display: boolean;

  usuarios: FormGroup;
  title_u: string;
  data_u: any;
  data_p: any;
  pw: any;
  loading_u: boolean;
  display_u: boolean;

  constructor(
    private _Router: Router,
    private _FormBuilder: FormBuilder,
    private _SnotifyService: SnotifyService,
    private _AuthService: AuthService,
    private _UsuariosService: UsuariosService
  ) {
    this.data_p = [
      {label: 'ALUMNO(A)', value: 'ALUMNO(A)'},
      {label: 'SECRETARIO(A)', value: 'SECRETARIO(A)'},
      {label: 'ADMINISTRADOR(A)', value: 'ADMINISTRADOR(A)'}
    ];
    this.pw = {
      'promptLabelOne' : 'Por favor ingrese una contraseña',
      'promptLabelTwo' : 'Por favor confirme su contraseña',
      'weakLabel' : 'Corto',
      'mediumLabel' : 'Mediano',
      'strongLabel' : 'Perfecto'
    };
    this.formatUsuarios();
  }

  ngOnInit() {
    this.loadData();
  }

  formatUsuarios() {
    this.usuarios = this._FormBuilder.group({
      id: new FormControl(null),
      dni: new FormControl(null, Validators.required),
      nombres: new FormControl(null, Validators.required),
      apellidos: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      email_verified_at: new FormControl(null),
      password: new FormControl(''),
      pass: new FormControl(''),
      src_img: new FormControl(null),
      perfil: new FormControl('ALUMNO(A)', Validators.required),
      estado: new FormControl(true, Validators.required),
      created_at: new FormControl(null),
      updated_at: new FormControl(null)
    });
  }

  add() {
    this.formatUsuarios();
    this.display_u = true;
    this.title_u = 'Agregar Usuario';
  }

  edit(usuario) {
    const data = {};
    for ( const prop in usuario) {
      data[prop] = usuario[prop];
    }
    this.formatUsuarios();
    data['password'] = null;
    data['pass'] = null;
    this.usuarios.setValue(data);
    this.display_u = true;
    this.title_u = 'Editar Usuario';
  }

  loadData() {
    this.loading_u = true;
    this._UsuariosService.index().subscribe(
      response => {
        this._AuthService.setToken(response.token);
        if ( response.status === 200 ) {
          this.data_u = response.data;
          this._SnotifyService.success('Consulta Exitosa', '¡Exito..!');
        } else {
          this.data_u = [];
          this._SnotifyService.warning(response.data, '¡Atención..!');
        }
        this.loading_u = false;
      },
      error => {
        this.errorRequest(error);
      }
    );
  }

  save() {
    if ( this.usuarios.value.password || this.usuarios.value.pass ) {
      if ( !this.usuarios.value.password ) {
        this._SnotifyService.info('Ingrese una contraseña', 'Atención..!');
        $('input[formControlName="password"]').focus();
        return;
      } else if ( !this.usuarios.value.pass ) {
        this._SnotifyService.info('Confirme su contraseña', 'Atención..!');
        $('input[formControlName="pass"]').focus();
        return;
      } else {
        if ( this.usuarios.value.password.length < 6 ) {
          this.usuarios.patchValue({password: '', pass: ''});
          this._SnotifyService.info('La contraseña no puede ser menor de 6 dígitos', 'Atención..!');
          $('input[formControlName="password"]').focus();
          return;
        } else if ( this.usuarios.value.password !== this.usuarios.value.pass ) {
          this.usuarios.patchValue({password: '', pass: ''});
          this._SnotifyService.info('Las Contraseñas no coinciden', 'Atención..!');
          $('input[formControlName="password"]').focus();
          return;
        }
      }
    }
    this.display = true;
    if ( !this.usuarios.value.id ) {
      this._UsuariosService.store(this.usuarios.value).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 201 ) {
            this.loadData();
            this.display_u = false;
            this._SnotifyService.success('Datos Guardados Correctamente', '¡Exito..!');
          } else {
            this._SnotifyService.warning(response.data, '¡Atención..!');
          }
          this.display = false;
        },
        error => {
          this.errorRequest(error);
        }
      );
    } else {
      this._UsuariosService.update([], this.usuarios.value, this.usuarios.value.id).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 201 ) {
            this.loadData();
            this.display_u = false;
            this._SnotifyService.success('Datos Guardados Correctamente', '¡Exito..!');
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

  formatDate(data) {
    const date = new Date(data + ' 00:00:00');
    const formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    return  formattedDate;
  }

  formatDateTime(data) {
    const date = new Date(data);
    const formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    return  formattedDate;
  }

  /* ----------------------------------------- */

}
