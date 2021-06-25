import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl , FormGroup, FormBuilder } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { AuthService } from '../../../services/auth.service';
import { AjustesService } from '../../../services/ajustes.service';

@Component({
  selector: 'app-ciclos',
  templateUrl: './ciclos.component.html',
  styleUrls: ['./ciclos.component.css'],
  providers: [
    AuthService,
    AjustesService
  ]
})
export class CiclosComponent implements OnInit {

  title = 'Ciclos';
  msgs: any;
  token: any;
  es: any;

  display: boolean;

  etapas: FormGroup;
  etapa: any;
  display_e: boolean;
  title_e: string;
  loading_e: boolean;
  data_e: any;

  ciclos: FormGroup;
  display_cl: boolean;
  title_cl: string;
  estado2: boolean;
  loading2: boolean;
  data_cl: any;

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
    this.formatEtapas();
    this.formatCiclos();
  }

  ngOnInit() {
  }

  /* ------------ Etapas -------------- */

  formatEtapas() {
    this.etapas = this._FormBuilder.group({
      id: new FormControl(null),
      inicio: new FormControl(null, Validators.required),
      final: new FormControl(null, Validators.required),
      estado: new FormControl(true, Validators.required),
      created_at: new FormControl(null),
      updated_at: new FormControl(null)
    });
  }

  loadEtapas() {
    this.loading_e = true;
    this._AjustesService.etapas_index().subscribe(
      response => {
        this._AuthService.setToken(response.token);
        if ( response.status === 200 ) {
          this.data_e = response.data;
          this._SnotifyService.success('Consulta Exitosa', '¡Exito..!');
        } else {
          this.data_e = [];
          this._SnotifyService.warning(response.data, '¡Atención..!');
        }
        this.loading_e = false;
      },
      error => {
        this.errorRequest(error);
      }
    );
  }

  addEtapas() {
    this.formatEtapas();
    this.display_e = true;
    this.title_e = 'Agregar Etapa';
  }

  editEtapas(etapa) {
    const data = {};
    for ( const prop in etapa) {
      data[prop] = etapa[prop];
    }
    data['inicio'] = new Date(data['inicio'] + ' 00:00:00');
    data['final'] = new Date(data['final'] + ' 00:00:00');
    this.formatEtapas();
    this.etapas.setValue(data);
    this.display_e = true;
    this.title_e = 'Editar Etapa';
  }

  saveEtapas() {
    this.display = true;
    if ( !this.etapas.value.id ) {
      this._AjustesService.etapas_store(this.etapas.value).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 201 ) {
            this.loadEtapas();
            this.display_e = false;
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
      this._AjustesService.etapas_update(this.etapas.value, this.etapas.value.id).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 201 ) {
            this.loadEtapas();
            this.display_e = false;
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

  /* ------------ Ciclos -------------- */

  formatCiclos() {
    this.ciclos = this._FormBuilder.group({
      id: new FormControl(null),
      etapas_id: new FormControl(this.etapa ? this.etapa.id : null, Validators.required),
      etapas: new FormControl(null),
      nombre: new FormControl('', Validators.required),
      estado: new FormControl(true, Validators.required),
      created_at: new FormControl(null),
      updated_at: new FormControl(null)
    });
  }

  loadCiclos(etapa) {
    this.etapa = etapa;
    if ( !this.etapa ) {
      this._SnotifyService.info('No selecciono una Etapa', '¡Atención..!');
    } else {
      this.loading2 = true;
      this._AjustesService.ciclos_indexByEtapa(this.etapa.id).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if (response.status === 200) {
            this.data_cl = response.data;
            this._SnotifyService.success('Consulta Exitosa', '¡Exito..!');
          } else {
            this.data_cl = [];
            this._SnotifyService.warning(response.data, '¡Atención..!');
          }
          this.loading2 = false;
        },
        error => {
          this.errorRequest(error);
        }
      );
    }
  }

  addCiclos() {
    if ( !this.etapa ) {
      this._SnotifyService.info('No selecciono una Etapa', '¡Atención..!');
    } else {
      this.formatCiclos();
      this.display_cl = true;
      this.title_cl = 'Agregar Ciclo';
    }
  }

  editCiclos(ciclo) {
    const data = {};
    for ( const prop in ciclo) {
      data[prop] = ciclo[prop];
    }
    this.formatCiclos();
    this.ciclos.setValue(data);
    this.display_cl = true;
    this.title_cl = 'Editar Ciclo';
  }

  saveCiclos() {
    this.display = true;
    if ( !this.ciclos.value.id ) {
      this._AjustesService.ciclos_store(this.ciclos.value).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 201 ) {
            this.loadCiclos(this.etapa);
            this.display_cl = false;
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
      this._AjustesService.ciclos_update(this.ciclos.value, this.ciclos.value.id).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 201 ) {
            this.loadCiclos(this.etapa);
            this.display_cl = false;
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
