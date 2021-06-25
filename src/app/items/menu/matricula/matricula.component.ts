import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormControl , FormGroup, FormBuilder } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { AuthService } from '../../../services/auth.service';
import { AjustesService } from '../../../services/ajustes.service';
import { MatriculasService } from '../../../services/matriculas.service';

@Component({
  selector: 'app-matricula',
  templateUrl: './matricula.component.html',
  styleUrls: ['./matricula.component.css'],
  providers: [
    AuthService,
    AjustesService,
    MatriculasService
  ]
})
export class MatriculaComponent implements OnInit {

  title = 'Matricularme';
  msgs: any;

  data_c: any; /** ciclos */
  data_tp: any; /** tipoPagos */
  matriculas: FormGroup;
  alumno: any;
  display: boolean;

  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _FormBuilder: FormBuilder,
    private _SnotifyService: SnotifyService,
    private _AuthService: AuthService,
    private _AjustesService: AjustesService,
    private _MatriculasService: MatriculasService
  ) {
    this.alumno = this._AuthService.getAlumno();
    this.matriculas = this._FormBuilder.group({
      id: new FormControl(null),
      alumnos_id: new FormControl(this.alumno ? this.alumno.id : null, Validators.required),
      alumnos: new FormControl(this.alumno ? this.alumno : null),
      periodos_id: new FormControl(null, Validators.required),
      periodos: new FormControl(null),
      carreras_id: new FormControl(this.alumno.carreras ? this.alumno.carreras.id : null, Validators.required),
      carreras: new FormControl(this.alumno.carreras ? this.alumno.carreras : null),
      ciclos_id: new FormControl(null, Validators.required),
      ciclos: new FormControl(null),
      tipo_matriculas_id: new FormControl(null, Validators.required),
      tipo_matriculas: new FormControl(null),
      tipo_pagos_id: new FormControl(null, Validators.required),
      tipo_pagos: new FormControl(null),
      tasa_descuento: new FormControl(0, Validators.required),
      total: new FormControl(0, Validators.required),
      estado: new FormControl(true, Validators.required),
      created_at: new FormControl(null),
      updated_at: new FormControl(null)
    });
  }

  ngOnInit() {
    this.display = true;
    const getId = this._ActivatedRoute.snapshot.paramMap.get('id');
    if ( getId ) {
      this.matriculas.value.tipoMatriculas = this._ActivatedRoute.snapshot.paramMap.get('id');
      this._AjustesService.periodos_active().subscribe(
        response0 => {
          this._AuthService.setToken(response0.token);
          if ( response0.status === 200 ) {
            this.matriculas.patchValue({periodos_id: response0.data.id, periodos: response0.data});
            this._AjustesService.tipoMatriculas_show(getId).subscribe(
              response1 => {
                this._AuthService.setToken(response1.token);
                if ( response1.status === 200 ) {
                  this.matriculas.patchValue({tipo_matriculas_id: response1.data.id, tipo_matriculas: response1.data});
                  this._AjustesService.ciclos_byEtapa().subscribe(
                    response2 => {
                      this._AuthService.setToken(response2.token);
                      if ( response2.status === 200 ) {
                        this.data_c = response2.data;
                        this._AjustesService.tipoPagos_indexByTipoMatricula(getId).subscribe(
                          response3 => {
                            this._AuthService.setToken(response3.token);
                            if ( response3.status === 200 ) {
                              this.data_tp = response3.data;
                              this.display = false;
                            } else {
                              this.data_tp = [];
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
                  this._SnotifyService.warning(response1.data, '¡Atención..!');
                }
              },
              error => {
                this.errorRequest(error);
              }
            );
          } else {
            this._SnotifyService.warning(response0.data, '¡Atención..!');
          }
        },
        error => {
          this.errorRequest(error);
        }
      );
    }
  }

  onSubmit() {
    this.display = true;
    this._MatriculasService.store(this.matriculas.value).subscribe(
      response => {
        this._AuthService.setToken(response.token);
        if ( response.status === 201 ) {
          this._Router.navigateByUrl('/matricula/pagos/' + response.data.id);
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

  onSelectCiclo(ciclo) {
    this.matriculas.patchValue({
      ciclos_id: ciclo.id,
      ciclos: ciclo
    });
  }

  onSelectTipoPago(tipo_pago) {
    this.matriculas.patchValue({
      tipo_pagos_id: tipo_pago.id,
      tipo_pagos: tipo_pago,
      tasa_descuento: (this.matriculas.value.tasa_descuento ? this.matriculas.value.tasa_descuento : 0),
      total: tipo_pago.importe
    });
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

  /* ----------------------------------------- */

}
