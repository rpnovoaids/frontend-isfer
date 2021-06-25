import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormControl , FormGroup, FormBuilder } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { AuthService } from '../../../services/auth.service';
import { AjustesService } from '../../../services/ajustes.service';
import { PagosService } from '../../../services/pagos.service';

@Component({
  selector: 'app-pago-matricula',
  templateUrl: './pago-matricula.component.html',
  styleUrls: ['./pago-matricula.component.css'],
  providers: [
    AuthService,
    AjustesService,
    PagosService
  ]
})
export class PagoMatriculaComponent implements OnInit {

  title = 'Pagos Realizados';
  msgs: any;

  matriculas: FormGroup;
  pagos: FormGroup;
  uploadedFiles: any;
  data_p: any;
  data_e: any;
  url: any;
  disable: boolean;
  title_p =  'Vaucher de Pago';

  display: boolean;
  display_p: boolean;

  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _FormBuilder: FormBuilder,
    private _SnotifyService: SnotifyService,
    private _AuthService: AuthService,
    private _AjustesService: AjustesService,
    private _PagosService: PagosService
  ) {
    this.url = this._AuthService.url();
    this.formatPagos();
    this.matriculas = this._FormBuilder.group({
      id: new FormControl(null, Validators.required),
      tipo_pagos: new FormControl(null, Validators.required),
      coutas_pagadas: new FormControl(0, Validators.required),
      total: new FormControl(0, Validators.required),
    });
  }

  ngOnInit() {
    this.display = true;
    const getId = this._ActivatedRoute.snapshot.paramMap.get('id');
    if ( getId ) {
      this.matriculas.patchValue({id: getId});
      this._AjustesService.etapas_etapaActual().subscribe(
        res1 => {
          this._AuthService.setToken(res1.token);
          if ( res1.status === 200 ) {
            this.loadPagos();
            this.data_e = res1.data;
          } else {
            this.data_e = [];
            this._SnotifyService.warning(res1.data, '¡Atención..!');
          }
        },
        error => {
          this.errorRequest(error);
        }
      );
    }
  }

  formatPagos() {
    this.pagos = this._FormBuilder.group({
      id: new FormControl(null),
      matriculas_id: new FormControl(null, Validators.required),
      matriculas: new FormControl(null),
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

  loadPagos() {
    this.display = true;
    this._PagosService.indexByMatricula(this.matriculas.value.id).subscribe(
      response => {
        this._AuthService.setToken(response.token);
        if ( response.status === 200 ) {
          this.data_p = response.data;
          let coutas_pagadas = 0;
          for (let i = 0; i < response.data.length; i++) {
            if ( this.data_p[i].estado === 1 ) {
              coutas_pagadas = coutas_pagadas + 1;
            }
          }
          this.matriculas.patchValue({tipo_pagos: response.data[0].tipo_pagos, coutas_pagadas: coutas_pagadas,
            total: response.data[0].matriculas.total});
        } else {
          this.data_p = [];
          this._SnotifyService.warning(response.data, '¡Atención..!');
        }
        this.display = false;
      },
      error => {
        this.errorRequest(error);
      }
    );
  }

  onSubmit() {
    this.display = true;
    this._PagosService.update(this.uploadedFiles, this.pagos.value, this.pagos.value.id).subscribe(
      response => {
        this._AuthService.setToken(response.token);
        if ( response.status === 201 ) {
          this.loadPagos();
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

  selectPago(pago) {
    const data = {};
    for ( const prop in pago) {
      data[prop] = pago[prop];
    }
    this.formatPagos();
    this.pagos.setValue(data);
    this.display_p = true;
    this.disable = true;
  }

  onDialogHide() {
    this.formatPagos();
    this.display_p = false;
  }

  onSelectFile(event) {
    const dom: any = document.querySelector('.img-upload');
    this.uploadedFiles = <Array<File>>event.target.files;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data_p url
      reader.onload = () => { // called once readAsdata_pURL is completed
        dom.src = reader.result;
      };
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

  /* ----------------------------------------- */

}
