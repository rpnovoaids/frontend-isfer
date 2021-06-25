import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { Validators, FormControl , FormGroup, FormBuilder } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { AuthService } from '../../../services/auth.service';
import { AjustesService } from '../../../services/ajustes.service';
import { MatriculasService } from '../../../services/matriculas.service';
import { PagosService } from '../../../services/pagos.service';

import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

declare var $: any;

@Component({
  selector: 'app-matriculas',
  templateUrl: './matriculas.component.html',
  styleUrls: ['./matriculas.component.css'],
  providers: [
    AuthService,
    AjustesService,
    MatriculasService,
    PagosService
  ]
})
export class MatriculasComponent implements OnInit {

  title = 'Matriculas';
  es: any;

  data_m: any;
  data_c: any;
  data_cl: any;
  data_es: any;
  data_p: any;

  cols_m: any;
  cols_opt_m: any;

  matriculas: FormGroup;
  images: any[];
  url: any;
  pagos: FormGroup;
  report: FormGroup;

  token: any;
  msgs: any;

  display: boolean;
  display_p: boolean;
  display_r: boolean;
  stacked_m: boolean;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private _Router: Router,
    private _FormBuilder: FormBuilder,
    private _SnotifyService: SnotifyService,
    private _AuthService: AuthService,
    private _AjustesService: AjustesService,
    private _MatriculasService: MatriculasService,
    private _PagosService: PagosService
  ) {
    this.url = this._AuthService.url();
    this.formatMatriculas();
    this.formatPagos();
    this.formatReport();
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
    this.cols_m = [
      { field: 'alumnos', header: 'DNI' },
      { field: 'alumnos', header: 'NOMBRE' },
      { field: 'alumnos', header: 'APELLIDOS' },
      { field: 'carreras', header: 'CARRERA' },
      { field: 'ciclos', header: 'CICLO' },
      { field: 'created_at', header: 'REG.' },
      { field: 'updated_at', header: 'ACT.' },
      { field: 'estado', header: 'ESTADO' }
    ];
    this.data_es = [
      {label: 'TODOS', value: null},
      {label: 'ANULADO', value: 0},
      {label: 'PAGADO', value: 1},
      {label: 'PROCESO', value: 2},
      {label: 'OBSERVADO', value: 3},
      {label: 'EMITIDO', value: 4}
    ];
    this.galleryOptions = [
      {
        thumbnails: false,
        thumbnailsRemainingCount: true,
        width: '100%',
        thumbnailsColumns: 1,
        imageAnimation: NgxGalleryAnimation.Slide,
        imageDescription: true,
        previewFullscreen: true,
        previewKeyboardNavigation: true
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100px',
        height: '100px',
        imagePercent: 100,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];
  }

  ngOnInit() {
    this.cols_opt_m = [];
    for (let i = 0; i < this.cols_m.length; i++) {
      this.cols_opt_m.push({label: this.cols_m[i].header, value: this.cols_m[i]});
    }
    this.display = true;
    this._MatriculasService.byPeriodoAndEtapa().subscribe(
      response1 => {
        this._AuthService.setToken(response1.token);
        if ( response1.status === 200 ) {
          this.data_m = response1.data;
          for (let i = 0; i < this.data_m.length; i++) {
            this.data_m[i].created_at = this.formatDateTime(this.data_m[i].created_at);
            this.data_m[i].updated_at = this.formatDateTime(this.data_m[i].updated_at);
          }
          this._AjustesService.carreras_active().subscribe(
            response2 => {
              this._AuthService.setToken(response2.token);
              if ( response2.status === 200 ) {
                this.data_c = response2.data;
                this.data_c.unshift({id: null, nombre: 'TODOS'});
                this._AjustesService.ciclos_active().subscribe(
                  response3 => {
                    this._AuthService.setToken(response3.token);
                    if ( response3.status === 200 ) {
                      this.data_cl = response3.data;
                      this.data_cl.unshift({id: null, nombre: 'TODOS'});
                      this.display = false;
                    } else {
                      this.data_cl = [];
                      this._SnotifyService.warning(response3.data, '¡Atención..!');
                    }
                  },
                  error => {
                    this.errorRequest(error);
                  }
                );
              } else {
                this.data_c = [];
                this._SnotifyService.warning(response2.data, '¡Atención..!');
              }
            },
            error => {
              this.errorRequest(error);
            }
          );
        } else {
          this.data_m = [];
          this._SnotifyService.warning(response1.data, '¡Atención..!');
        }
      },
      error => {
        this.errorRequest(error);
      }
    );
  }

  formatMatriculas() {
    this.matriculas = this._FormBuilder.group({
      id: new FormControl(null),
      alumnos_id: new FormControl(null),
      alumnos: new FormControl(null),
      periodos_id: new FormControl(null, Validators.required),
      periodos: new FormControl(null),
      carreras_id: new FormControl(null, Validators.required),
      carreras: new FormControl(null),
      ciclos_id: new FormControl(null, Validators.required),
      ciclos: new FormControl(null),
      tipo_matriculas_id: new FormControl(null, Validators.required),
      tipo_matriculas: new FormControl(null),
      tasa_descuento: new FormControl(0, Validators.required),
      total: new FormControl(0, Validators.required),
      estado: new FormControl(true, Validators.required),
      created_at: new FormControl(null),
      updated_at: new FormControl(null),
      pagos: new FormControl(0, Validators.required),
      tipo_pagos: new FormControl(null),
      coutas_pagadas: new FormControl(0, Validators.required)
    });
  }

  formatPagos() {
    this.pagos = this._FormBuilder.group({
      id: new FormControl(null),
      matriculas_id: new FormControl(null, Validators.required),
      tipo_pagos_id: new FormControl(null, Validators.required),
      tipo_pagos: new FormControl(null),
      numero_vaucher: new FormControl(null, Validators.required),
      fecha_vaucher: new FormControl(null),
      importe: new FormControl(0, Validators.required),
      src_img: new FormControl(null),
      observacion: new FormControl(null),
      estado: new FormControl(true, Validators.required),
      created_at: new FormControl(null),
      updated_at: new FormControl(null)
    });
  }

  loadData() {
    this.display = true;
    this._MatriculasService.byPeriodoAndEtapa().subscribe(
      response => {
        this._AuthService.setToken(response.token);
        if ( response.status === 200 ) {
          this.data_m = response.data;
          for (let i = 0; i < this.data_m.length; i++) {
            this.data_m[i].created_at = this.formatDateTime(this.data_m[i].created_at);
            this.data_m[i].updated_at = this.formatDateTime(this.data_m[i].updated_at);
          }
          this.display = false;
        } else {
          this.data_m = [];
          this._SnotifyService.warning(response.data, '¡Atención..!');
        }
      },
      error => {
        this.errorRequest(error);
      }
    );
  }

  toggleMatriculas() {
    this.stacked_m = !this.stacked_m;
  }

  selectMatricula(matricula) {
    const data = {};
    for ( const prop in matricula) {
      data[prop] = matricula[prop];
    }
    data['tipo_pagos'] = null;
    data['coutas_pagadas'] = 0;
    this.matriculas.setValue(data);
    this.images = [];
    let coutas_pagadas = 0;
    this.data_p = data['pagos'];
    for (let i = 0; i < this.data_p.length; i++) {
      if ( this.data_p[i].estado === 1 ) {
        coutas_pagadas = coutas_pagadas + 1;
      }
      this.images.push({
        small: this.data_p[i].src_img ? this.url + '/storage/vauchers/' + this.data_p[i].src_img : 'assets/dist/img/shortcut-img.png',
        medium: this.data_p[i].src_img ? this.url + '/storage/vauchers/' + this.data_p[i].src_img : 'assets/dist/img/shortcut-img.png',
        big: this.data_p[i].src_img ? this.url + '/storage/vauchers/' + this.data_p[i].src_img : 'assets/dist/img/shortcut-img.png',
        description: this.data_p[i].numero_vaucher ? this.data_p[i].numero_vaucher : 'Vaucher sin registrar',
        label: this.data_p[i].numero_vaucher ? this.data_p[i].numero_vaucher : 'Vaucher sin registrar'
      });
    }
    this.galleryImages = this.images;
    this.matriculas.patchValue({tipo_pagos: this.data_p[0].tipo_pagos, coutas_pagadas: coutas_pagadas});
  }

  selectPago(gallery, data) {
    if ( !data.numero_vaucher ) {
      this._SnotifyService.info('Vaucher sin registrar', '¡Atención..!');
    } else {
      for (let i = 0; i < this.galleryImages.length; i++) {
        if ( this.galleryImages[i].description === data.numero_vaucher ) {
          gallery.openPreview(i);
        }
      }
    }
  }

  observacion(data) {
    this.pagos.setValue(data);
    this.display_p = true;
  }

  onSubmit(data, estado) {
    this.display = true;
    data['estado'] = estado;
    if ( estado === 3 && !data['observacion'] ) {
      data['estado'] = 2;
    }
    this._PagosService.update([], data, data.id).subscribe(
      response => {
        this._AuthService.setToken(response.token);
        if ( response.status === 201 ) {
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

  formatReport() {
    this.report = this._FormBuilder.group({
      carrera: new FormControl(null, Validators.required),
      ciclo: new FormControl(null,  Validators.required),
      on: new FormControl(null,  Validators.required),
      off: new FormControl(null,  Validators.required)
    });
  }

  onReport(data) {
    window.open(this._AuthService.url() + '/matriculas/' + data['carrera']['id'] + '/' + data['ciclo']['id'] + '/' + this.date(data['on'])
      + '/' + this.date(data['off']) + '/report?token=' + this._AuthService.getToken(), '_blank');
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

  date(date) {
    const formattedDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    return  formattedDate;
  }

  /* ----------------------------------------- */

}
