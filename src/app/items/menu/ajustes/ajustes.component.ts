import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl , FormGroup, FormBuilder } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { AuthService } from '../../../services/auth.service';
import { AjustesService } from '../../../services/ajustes.service';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.css'],
  providers: [
    AuthService,
    AjustesService
  ]
})
export class AjustesComponent implements OnInit {

  title = 'Ajustes';
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

  carreras: FormGroup;
  display_c: boolean;
  title_c: string;
  estado3: boolean;
  loading3: boolean;
  data_c: any;

  tipoMatriculas: FormGroup;
  tipo_matriculas: any;
  display_tm: boolean;
  title_tm: string;
  estado4: boolean;
  loading4: boolean;
  data_tm: any;
  inicio: Date;
  final: Date;

  tipoPagos: FormGroup;
  display_tp: boolean;
  title_tp: string;
  estado5: boolean;
  loading5: boolean;
  data_tp: any;

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
    this.formatEtapas();
    this.formatCiclos();
    this.formatCarreras();
    this.formatTipoMatriculas();
    this.formatTipoPagos();
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

  /* ------------ TipoMatriculas -------------- */

  formatTipoMatriculas() {
    this.tipoMatriculas = this._FormBuilder.group({
      id: new FormControl(null),
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      inicio: new FormControl(null, Validators.required),
      final: new FormControl(null, Validators.required),
      importe: new FormControl(0, Validators.required),
      estado: new FormControl(true, Validators.required),
      created_at: new FormControl(null),
      updated_at: new FormControl(null)
    });
  }

  loadTipoMatriculas() {
    this.loading4 = true;
    this._AjustesService.tipoMatriculas_index().subscribe(
      response => {
        this._AuthService.setToken(response.token);
        if ( response.status === 200 ) {
          this.data_tm = response.data;
          this._SnotifyService.success('Consulta Exitosa', '¡Exito..!');
        } else {
          this.data_tm = [];
          this._SnotifyService.warning(response.data, '¡Atención..!');
        }
        this.loading4 = false;
      },
      error => {
        this.errorRequest(error);
      }
    );
  }

  addTipoMatriculas() {
    this.formatTipoMatriculas();
    this.display_tm = true;
    this.title_tm = 'Agregar Tipo de Matricula';
  }

  editTipoMatriculas(tipoMatricula) {
    const data = {};
    for ( const prop in tipoMatricula) {
      data[prop] = tipoMatricula[prop];
    }
    data['inicio'] = new Date(data['inicio'] + ' 00:00:00');
    data['final'] = new Date(data['final'] + ' 00:00:00');
    this.formatTipoMatriculas();
    this.tipoMatriculas.setValue(data);
    this.display_tm = true;
    this.title_tm = 'Editar Tipo de Matricula';
  }

  saveTipoMatriculas() {
    this.display = true;
    if ( !this.tipoMatriculas.value.id ) {
      this._AjustesService.tipoMatriculas_store(this.tipoMatriculas.value).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 201 ) {
            this.loadTipoMatriculas();
            this.display_tm = false;
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
      this._AjustesService.tipoMatriculas_update(this.tipoMatriculas.value, this.tipoMatriculas.value.id).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 201 ) {
            this.loadTipoMatriculas();
            this.display_tm = false;
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

  /* ------------ TipoPagos -------------- */

  formatTipoPagos() {
    this.tipoPagos = this._FormBuilder.group({
      id: new FormControl(null),
      tipo_matriculas_id: new FormControl(this.tipo_matriculas ? this.tipo_matriculas.id : null, Validators.required),
      tipo_matriculas: new FormControl(null),
      nombre: new FormControl('', Validators.required),
      importe: new FormControl(0, Validators.required),
      partes: new FormControl(0, Validators.required),
      estado: new FormControl(true, Validators.required),
      created_at: new FormControl(null),
      updated_at: new FormControl(null)
    });
  }

  loadTipoPagos(tipoPagos) {
    this.tipo_matriculas = tipoPagos;
    if ( !this.tipo_matriculas ) {
      this._SnotifyService.info('No selecciono un Tipo de Matricula', '¡Atención..!');
    } else {
      this.loading5 = true;
      this._AjustesService.tipoPagos_indexByTipoMatricula(this.tipo_matriculas.id).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 200 ) {
            this.data_tp = response.data;
            this._SnotifyService.success('Consulta Exitosa', '¡Exito..!');
          } else {
            this.data_tp = [];
            this._SnotifyService.warning(response.data, '¡Atención..!');
          }
          this.loading5 = false;
        },
        error => {
          this.errorRequest(error);
        }
      );
    }
  }

  addTipoPagos() {
    if ( !this.tipo_matriculas ) {
      this._SnotifyService.info('No selecciono un Tipo de Matricula', '¡Atención..!');
    } else {
      this.formatTipoPagos();
      this.display_tp = true;
      this.title_tp = 'Agregar Tipo de Pago';
    }
  }

  editTipoPagos(tipoPagos) {
    const data = {};
    for ( const prop in tipoPagos) {
      data[prop] = tipoPagos[prop];
    }
    this.formatTipoPagos();
    this.tipoPagos.setValue(data);
    this.display_tp = true;
    this.title_tp = 'Editar Tipo de Pago';
  }

  saveTipoPagos() {
    this.display = true;
    if ( !this.tipoPagos.value.id ) {
      this._AjustesService.tipoPagos_store(this.tipoPagos.value).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 201 ) {
            this.loadTipoPagos(this.tipo_matriculas);
            this.display_tp = false;
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
      this._AjustesService.tipoPagos_update(this.tipoPagos.value, this.tipoPagos.value.id).subscribe(
        response => {
          this._AuthService.setToken(response.token);
          if ( response.status === 201 ) {
            this.loadTipoPagos(this.tipo_matriculas);
            this.display_tp = false;
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
