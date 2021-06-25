import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { AuthService } from '../../../services/auth.service';
import { AppComponent } from '../../../app.component';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
  providers: [
    AuthService,
    UsuariosService
  ]
})
export class AvatarComponent implements OnInit {

  title = 'Foto de Perfil';
  msgs: any;

  identity: any;
  url: any;

  choose = ' Seleccionar';
  pw: any;
  uploadedFiles: any[] = [];
  display: boolean;

  constructor(
    private _Router: Router,
    private _SnotifyService: SnotifyService,
    private _AuthService: AuthService,
    private _AppComponent: AppComponent,
    private _UsuariosService: UsuariosService,
  ) {
    this.identity = this._AuthService.getIdentity();
    this.url = this._AuthService.url();
    this.pw = {
      'promptLabelOne' : 'Por favor ingrese una contraseña',
      'promptLabelTwo' : 'Por favor confirme su contraseña',
      'weakLabel' : 'Corto',
      'mediumLabel' : 'Mediano',
      'strongLabel' : 'Perfecto'
    };
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

  onUpload(event) {
    for ( const file of event.files ) {
      this.uploadedFiles.push(file);
    }
    this._SnotifyService.success('Imagen Cargado Correctamente', '¡Exito..!');
  }

  onSubmit(event) {
    if ( this.uploadedFiles.length < 1 ) {
      this._SnotifyService.info('Agregue su Fotografía', '¡Atención..!');
    } else {
      this._UsuariosService.update(this.uploadedFiles, this.identity, this.identity.id).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 201 ) {
            event.clear();
            this.uploadedFiles = [];
            this._AuthService.setIdentity(response.data);
            this._AppComponent.identity = response.data;
            this.identity = response.data;
            this._SnotifyService.success('Datos Guardados Correctamente', '¡Exito..!');
          } else {
            this._SnotifyService.warning(response.data, '¡Atención..!');
          }
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
