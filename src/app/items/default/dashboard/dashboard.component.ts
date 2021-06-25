import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { SnotifyService } from 'ng-snotify';
import { AuthService } from '../../../services/auth.service';
import { AjustesService } from '../../../services/ajustes.service';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    AuthService,
    AjustesService
  ]
})
export class DashboardComponent implements OnInit {

  title = 'Inicio';
  identity: any;
  msgs: any;
  data_tp: any;
  data_da: any;
  display: boolean;

  constructor(
    private _Router: Router,
    private _AppComponent: AppComponent,
    private _SnotifyService: SnotifyService,
    private _AuthService: AuthService,
    private _AjustesService: AjustesService
  ) {
    this._AppComponent.header = true;
    this._AppComponent.footer = true;
    this._AppComponent.identity = this._AuthService.getIdentity();
    this._AppComponent.alumno = this._AuthService.getAlumno();
    this.identity = this._AuthService.getIdentity();
    this.data_da = {
      matriculas: 0,
      usuarios: 0
    };
  }

  ngOnInit() {
    $('body').removeClass();
    $('body').addClass('hold-transition sidebar-mini sidebar-collapse');
    $('#content').removeClass();
    $('#content').addClass('content-wrapper');
    this.display = true;
    if ( this.identity.perfil !== 'ALUMNO(A)' ) {
      this._AuthService.dashboardAdmin().subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 200 ) {
            this.data_da = response.data;
          } else {
            this.data_da = [];
            this._SnotifyService.warning(response.data, 'Atención..!');
          }
          this.display = false;
        },
        error => {
          this.errorRequest(error);
        }
      );
    } else {
      this._AjustesService.tipoMatriculas_active().subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 200 ) {
            this.data_tp = response.data;
          } else {
            this.data_tp = [];
            this._SnotifyService.warning(response.data, 'Atención..!');
          }
          this.display = false;
        },
        error => {
          this.errorRequest(error);
        }
      );
    }
  }

  /* ---------- Default ------------- */

  errorRequest(error) {
    if ( error.status === 401 ) {
      this._AuthService.sessionLogout();
      this._SnotifyService.error('No Autorizado', 'Atención..!');
    } else {
      this._SnotifyService.error('Ocurrío un Error', 'Atención..!');
    }
  }

  formatDateTime(data) {
    const date = new Date(data);
    const formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    return  formattedDate;
  }

  formatDate(data) {
    const date = new Date(data + ' 00:00:00');
    const formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    return  formattedDate;
  }

  validateDateTM(inicio, final) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const init = new Date(inicio + ' 00:00:00');
    const termino = new Date(final + ' 00:00:00');
    if ( init > today ) {
      return true;
    } else if ( termino >= today ) {
      return false;
    } else {
      return true;
    }
  }

  /* ------------------------------ --*/

}
