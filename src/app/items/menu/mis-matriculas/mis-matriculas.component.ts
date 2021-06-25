import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { AuthService } from '../../../services/auth.service';
import { AjustesService } from '../../../services/ajustes.service';
import { MatriculasService } from '../../../services/matriculas.service';

@Component({
  selector: 'app-mis-matriculas',
  templateUrl: './mis-matriculas.component.html',
  styleUrls: ['./mis-matriculas.component.css'],
  providers: [
    AuthService,
    AjustesService,
    MatriculasService
  ]
})
export class MisMatriculasComponent implements OnInit {

  title = 'Matrículas';
  msgs = [];
  data_m: any;
  data_e: any;
  url: any;
  alumno: any;

  constructor(
    private _Router: Router,
    private _SnotifyService: SnotifyService,
    private _AuthService: AuthService,
    private _AjustesService: AjustesService,
    private _MatriculasService: MatriculasService
  ) {
    this.url = this._AuthService.url();
    this.alumno = this._AuthService.getAlumno();
  }

  ngOnInit() {
    this._MatriculasService.byAlumno(this.alumno.id).subscribe(
      res1 => {
        this._AuthService.setToken(res1.token);
        if ( res1.status === 200 ) {
          this.data_m = res1.data;
          /*this._AjustesService.etapas_etapaActual().subscribe(
            res2 => {
              this._AuthService.setToken(res2.token);
              if ( res2.status === 200 ) {
                this.data_e = res2.data;
                const m = [];
                for (const row of res1.data ) {
                  if ( row.ciclos.etapas_id === this.data_e.id ) {
                    m.push(row);
                  }
                }
                this.data_m = m;
              } else {
                this.data_e = [];
                this._SnotifyService.warning(res2.data, '¡Atención..!');
              }
            },
            error => {
              this.errorRequest(error);
            }
          );*/
        } else {
          this.data_m = [];
          this._SnotifyService.warning(res1.data, '¡Atención..!');
        }
      },
      error => {
        this.errorRequest(error);
      }
    );
  }

  showWarn() {
    this.msgs = [];
    this.msgs.push({severity: 'warn', summary: '¡Atención..!', detail: 'There are unsaved changes'});
    return '';
  }

  romanize(n) {
    const values = [1, 5, 10, 50, 100, 500, 1000],
      letras = ['I', 'V', 'X', 'L', 'C', 'D', 'M'],
      res = [];
    let num, letra, val, pos, insert;

    for (let i = 6; num = values[i], letra = letras[i]; i--) {
      // Suficientemente grande
      if (n >= num) {
        // Número de letras repetidas
        let r = Math.floor(n / num);

        // Restamos el actual
        n -= r * num;

        if (r < 4) {
          // Metemos las letras
          while (r--) {
            res.push(letra);
          }
        } else {
          // No se pueden repetir 4+ veces
          val = res.pop(); // Última letra

          // Si es el string vacío o letra == "M" (no hay anterior)
          // usamos la letra anterior a esta
          pos = (val ? letras.indexOf(val) : i) + 1;

          // Y si letra == "M" -> letras[pos] no existirá y usamos M
          insert = letra + (letras[pos] || 'M');

          // Insertamos el string
          res.push(insert);
        }
      } else {
        // Si no vamos a poner letra usamos un ""
        // para que no afecte pop
        res.push('');
      }
    }

    return res.join('');
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
