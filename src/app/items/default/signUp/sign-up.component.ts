import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { Validators, FormControl , FormGroup, FormBuilder } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { AuthService } from '../../../services/auth.service';
import { AjustesService } from '../../../services/ajustes.service';

declare var $: any;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [
    AuthService,
    AjustesService
  ]
})
export class SignUpComponent implements OnInit {

  title: any = 'Registrarme';
  msgs: any;
  alumnos: any;
  next: number;
  data_c: any;
  data_s: any;
  es: any;
  uploadedFiles: any[] = [];
  choose = 'Agregar';
  textBlock: RegExp = /[a-zA-ZáéíóúÁÉÍÓÚ ]/;
  dir: RegExp = /[0-9a-zA-ZáéíóúÁÉÍÓÚ °#/]/;
  tel: RegExp = /[0-9 ()+#*]/;
  e_mail: RegExp = /[0-9a-zA-Z.@]/;
  pw: any;
  url: any;
  request: any;

  signUp: FormGroup;

  constructor(
    private _FormBuilder: FormBuilder,
    private _SnotifyService: SnotifyService,
    private _AppComponent: AppComponent,
    private _AuthService: AuthService,
    private _AjustesService: AjustesService
  ) {
    this.url = this._AuthService.url();
    this._AppComponent.header = false;
    this._AppComponent.footer = false;
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
    this.next = 0;
    this.data_s = [
      {label: 'MASCULINO', value: 0},
      {label: 'FEMENINO', value: 1},
      {label: 'OTRO', value: 2}
    ];
    this.pw = {
      'promptLabelOne' : 'Por favor ingrese una contraseña',
      'promptLabelTwo' : 'Por favor confirme su contraseña',
      'weakLabel' : 'Corto',
      'mediumLabel' : 'Mediano',
      'strongLabel' : 'Perfecto'
    };
    this.formatSignUp();
  }

  ngOnInit() {
    $('body').removeClass();
    $('body').addClass('hold-transition register-page');
    $('#content').removeClass();
    $('#content').addClass('register-box');
    $('body').css('padding-top', '0rem');
    this._AjustesService.carreras_activeExToken().subscribe(
      response => {
        if ( response.status === 200 ) {
          this.data_c = response.data;
        } else {
          this.data_c = [];
          this._SnotifyService.warning(response.data, 'Atención..!');
        }
      },
      error => {
        this.errorRequest(error);
      }
    );
  }

  formatSignUp() {
    this.signUp = this._FormBuilder.group({
      carreras_id: new FormControl(null, Validators.required),
      carreras: new FormControl(null),
      dni: new FormControl(null, Validators.required),
      nombres: new FormControl(null, Validators.required),
      apellidos: new FormControl(null, Validators.required),
      sexo: new FormControl(null, Validators.required),
      edad: new FormControl(null, Validators.required),
      nacimiento: new FormControl(null, Validators.required),
      telefono: new FormControl(null, Validators.required),
      direccion: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      pass: new FormControl(null, Validators.required),
      src_img: new FormControl(null),
    });
  }

  blurDni() {
    const dni = this.signUp.get('dni').value;
    if ( dni ) {
      if ( dni.length < 8 ) {
        this._SnotifyService.info('El DNI ingresado está incompleto', 'Atención..!');
        $('input[formControlName="dni"]').focus();
        this.signUp.patchValue({dni: null});
      } else {
        this._AuthService.validateDni(this.signUp.value.dni).subscribe(
          response => {
            if ( response.status === 200 ) {
              if ( response.data === true ) {
                $('input[formControlName="nombres"]').focus();
              } else {
                this.next = 0;
                this.signUp.patchValue({dni: null});
                $('input[formControlName="dni"]').focus();
                this._SnotifyService.warning('El DNI ingresado se encuentra ocupado', 'Atención..!');
              }
            } else {
              this.next = 0;
              this.signUp.patchValue({dni: null});
              this._SnotifyService.warning(response.data, 'Atención..!');
            }
          },
          error => {
            this.errorRequest(error);
          }
        );
      }
    }
  }

  blurEmail() {
    const email = this.signUp.get('email').value;
    if ( !email ) {
      this._SnotifyService.info('Ingrese su correo electrónico', 'Atención..!');
    } else {
      this._AuthService.validateEmail(this.signUp.value.email).subscribe(
        response => {
          if ( response.status === 200 ) {
            if ( response.data === true ) {
              $('p-dropdown[name="carreras"]').focus();
            } else {
              this.next = 2;
              this.signUp.patchValue({email: null});
              $('input[formControlName="email"]').focus();
              this._SnotifyService.warning('El EMAIL ingresado se encuentra ocupado', 'Atención..!');
            }
          } else {
            this.next = 2;
            this.signUp.patchValue({email: null});
            this._SnotifyService.warning(response.data, 'Atención..!');
          }
        },
        error => {
          this.errorRequest(error);
        }
      );

    }
  }

  selectCarrera(data) {
    this.signUp.patchValue({carreras_id: data.id});
  }

  onUpload(event) {
    for ( const file of event.files ) {
      this.uploadedFiles.push(file);
    }
    this._SnotifyService.success('Imagen Cargado Correctamente', 'Exito..!');
  }

  onSubmit(value) {
    if ( this.next === 0 ) {
      if ( !this.signUp.value.dni ) {
        this._SnotifyService.info('Ingrese su DNI', 'Atención..!');
        $('input[formControlName="dni"]').focus();
      } else if ( !this.signUp.value.nombres ) {
        this._SnotifyService.info('Ingrese su(s) nombre(s)', 'Atención..!');
        $('input[formControlName="nombres"]').focus();
      } else if ( !this.signUp.value.apellidos ) {
        this._SnotifyService.info('Ingrese su(s) apellido(s)', 'Atención..!');
        $('input[formControlName="apellidos"]').focus();
      } else {
        this.next = this.next + 1;
        $('p-dropdown[name="sexo"]').focus();
      }
    } else if ( this.next === 1 ) {
      if ( !this.signUp.value.sexo && this.signUp.value.sexo !== 0 ) {
        $('p-dropdown[name="sexo"]').focus();
        this._SnotifyService.info('Ingrese su Género', 'Atención..!');
      } else if ( !this.signUp.value.edad ) {
        $('input[formControlName="edad"]').focus();
        this._SnotifyService.info('Ingrese su Edad', 'Atención..!');
      } else if ( !this.signUp.value.nacimiento ) {
        $('p-calendar[name="nacimiento"]').focus();
        this._SnotifyService.info('Ingrese su fecha de nacimiento', 'Atención..!');
      } else {
        this.next = this.next + 1;
        $('input[formControlName="direccion"]').focus();
      }
    } else if ( this.next === 2 ) {
      if ( !this.signUp.value.direccion ) {
        $('input[formControlName="direccion"]').focus();
        this._SnotifyService.info('Ingrese su dirección', 'Atención..!');
      } else if ( !this.signUp.value.telefono ) {
        $('input[formControlName="telefono"]').focus();
        this._SnotifyService.info('Ingrese su teléfono', 'Atención..!');
      } else if ( !this.signUp.value.email ) {
        $('input[formControlName="email"]').focus();
        this._SnotifyService.info('Ingrese su correo electrónico', 'Atención..!');
      } else {
        this.next = this.next + 1;
      }
    } else if ( this.next === 3 ) {
      if ( !this.signUp.value.carreras_id ) {
        $('p-dropdown[name="carreras"]').focus();
        this._SnotifyService.info('Seleccione la Carrera en que se encuentra', 'Atención..!');
      } else {
        this.next = this.next + 1;
      }
    } else if ( this.next === 4 ) {
      if ( !this.signUp.value.password ) {
        this._SnotifyService.info('Ingrese una contraseña', 'Atención..!');
        $('input[formControlName="password"]').focus();
      } else if ( !this.signUp.value.pass ) {
        this._SnotifyService.info('Confirme su contraseña', 'Atención..!');
        $('input[formControlName="pass"]').focus();
      } else {
        if ( this.signUp.value.password.length < 6 ) {
          this.signUp.patchValue({password: null, pass: null});
          this._SnotifyService.info('La contraseña no puede ser menor de 6 dígitos', 'Atención..!');
          $('input[formControlName="password"]').focus();
        } else if ( this.signUp.value.password !== this.signUp.value.pass ) {
          this.signUp.patchValue({password: null, pass: null});
          this._SnotifyService.info('Las Contraseñas no coinciden', 'Atención..!');
          $('input[formControlName="password"]').focus();
        } else {
          this.next = this.next + 1;
        }
      }
    } else if ( this.next === 5 ) {
      if ( !this.uploadedFiles ) {
        this._SnotifyService.info('Agregue su Fotografía', 'Atención..!');
      } else {
        this._AuthService.signUp(this.uploadedFiles, this.signUp.value).subscribe(
          response => {
            if ( response.status === 201 ) {
              this.next = 6;
              this.signUp.patchValue({src_img: response.data.src_img});
              this._SnotifyService.success('Datos Guardados Correctamente', 'Exito..!');
            } else {
              this._SnotifyService.warning(response.data, 'Atención..!');
            }
          },
          error => {
            this.errorRequest(error);
          }
        );
      }
    } else if ( this.next === 6 ) {
      this.signUp.value.nacimiento = new Date(this.signUp.value.nacimiento);
      this._AuthService.signUp(this.uploadedFiles, this.signUp.value).subscribe(
        response => {
          if ( response.status === 201 ) {
            this._SnotifyService.success('Datos Guardados Correctamente', 'Exito..!');
          } else {
            this._SnotifyService.warning(response.data, 'Atención..!');
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
      this._SnotifyService.error('No Autorizado', 'Atención..!');
    } else {
      this._SnotifyService.error('Ocurrío un Error', 'Atención..!');
    }
  }

  /*showGrowl(typeError, title, detail) {
    this.msgs = [];
    this.msgs.push({severity: typeError, summary: title, detail: detail});
  }*/

  /* ----------------------------------------- */

}
