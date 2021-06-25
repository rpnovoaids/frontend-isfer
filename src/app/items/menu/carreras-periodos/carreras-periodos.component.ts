import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl , FormGroup, FormBuilder } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { AuthService } from '../../../services/auth.service';
import { AjustesService } from '../../../services/ajustes.service';

@Component({
  selector: 'app-carreras-periodos',
  templateUrl: './carreras-periodos.component.html',
  styleUrls: ['./carreras-periodos.component.css'],
  providers: [
    AuthService,
    AjustesService
  ]
})
export class CarrerasPeriodosComponent implements OnInit {

  title = 'Carreras y Periodos';
  msgs: any;
  token: any;
  es: any;

  display: boolean;

  periodos: FormGroup;
  display_p: boolean;
  title_p: string;
  estado1: boolean;
  loading1: boolean;
  data_p: any;

  carreras: FormGroup;
  display_c: boolean;
  title_c: string;
  estado3: boolean;
  loading3: boolean;
  data_c: any;

  constructor(
    private _Router: Router,
    private _FormBuilder: FormBuilder,
    private _SnotifyService: SnotifyService,
    private _AuthService: AuthService,
    private _AjustesService: AjustesService
  ) {
    this.token = sessionStorage.getItem('token');
    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ 'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado' ],
      dayNamesShort: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
      dayNamesMin: [ 'D', 'L', 'M', 'X', 'J', 'V', 'S' ],
      monthNames: [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
        'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ],
      monthNamesShort: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
      today: 'Hoy',
      clear: 'Borrar'
    };
    this.formatPeriodos();
    this.formatCarreras();
  }

  ngOnInit() {
  }

  /* ------------ Periodos -------------- */

  formatPeriodos() {
    this.periodos = this._FormBuilder.group({
      id: new FormControl(null),
      nombre: new FormControl('', Validators.required),
      estado: new FormControl(true, Validators.required),
      created_at: new FormControl(null),
      updated_at: new FormControl(null)
    });
  }

  loadPeriodos() {
    this.loading1 = true;
    this._AjustesService.periodos_index().subscribe(
      response => {
        this._AuthService.setToken(response.token);
        if ( response.status === 200 ) {
          this.data_p = response.data;
          this._SnotifyService.success('Consulta Exitosa', '¡Exito..!');
        } else {
          this.data_p = [];
          this._SnotifyService.warning(response.data, '¡Atención..!');
        }
        this.loading1 = false;
      },
      error => {
        this.errorRequest(error);
      }
    );
  }

  addPeriodos() {
    this.formatPeriodos();
    this.display_p = true;
    this.title_p = 'Agregar Periodo';
  }

  editPeriodos(periodo) {
    const data = {};
    for ( const prop in periodo) {
      data[prop] = periodo[prop];
    }
    this.formatPeriodos();
    this.periodos.setValue(data);
    this.display_p = true;
    this.title_p = 'Editar Periodo';
  }

  savePeriodos() {
    this.display = true;
    if ( !this.periodos.value.id ) {
      this._AjustesService.periodos_store(this.periodos.value).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 201 ) {
            this.loadPeriodos();
            this.display_p = false;
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
      this._AjustesService.periodos_update(this.periodos.value, this.periodos.value.id).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 201 ) {
            this.loadPeriodos();
            this.display_p = false;
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

  /* ------------------------------ */

  /* ------------ Carreras -------------- */

  formatCarreras() {
    this.carreras = this._FormBuilder.group({
      id: new FormControl(null),
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      src_img: new FormControl(''),
      estado: new FormControl(true, Validators.required),
      created_at: new FormControl(null),
      updated_at: new FormControl(null)
    });
  }

  loadCarreras() {
    this.loading3 = true;
    this._AjustesService.carreras_index().subscribe(
      response => {
        this._AuthService.setToken(response.token);
        if ( response.status === 200 ) {
          this.data_c = response.data;
          this._SnotifyService.success('Consulta Exitosa', '¡Exito..!');
        } else {
          this.data_c = [];
          this._SnotifyService.warning(response.data, '¡Atención..!');
        }
        this.loading3 = false;
      },
      error => {
        this.errorRequest(error);
      }
    );
  }

  addCarreras() {
    this.formatCarreras();
    this.display_c = true;
    this.title_c = 'Agregar Carrera';
  }

  editCarreras(carrera) {
    const data = {};
    for ( const prop in carrera) {
      data[prop] = carrera[prop];
    }
    this.formatCarreras();
    this.carreras.setValue(data);
    this.display_c = true;
    this.title_c = 'Editar Carrera';
  }

  saveCarreras() {
    this.display = true;
    if ( !this.carreras.value.id ) {
      this._AjustesService.carreras_store(this.carreras.value).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 201 ) {
            this.loadCarreras();
            this.display_c = false;
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
      this._AjustesService.carreras_update(this.carreras.value, this.carreras.value.id).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 201 ) {
            this.loadCarreras();
            this.display_c = false;
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

  /* ------------------------------ */

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

  /* ----------------------------------------- */

}
