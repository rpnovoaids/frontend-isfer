import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  identity;
  token;
  expire;
  alumno;
  httpOptions: any;

  constructor(
    private _http: Http,
    private _Router: Router
  ) {
  }

  url() {
    return 'http://localhost/backend-iestpam/public';
  }

  /*url() {
    return 'https://www.webservice.matricula.novoaids.com';
  }*/

  headers() {
    return this.httpOptions = {
      headers: new Headers({
        'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + (this.getToken() ? this.getToken() : null),
        'Accept': 'application/json'
      })
    };
  }

  headersFormData() {
    return this.httpOptions = {
      headers: new Headers({
        'Authorization': 'Bearer ' + (this.getToken() ? this.getToken() : null),
        'Accept': 'application/json'
      })
    };
  }

  login(data) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.post(this.url() + '/login', params, this.headers()).map(res => res.json());
  }

  signUp(files: Array<File>, data) {
    const formData: any = new FormData();
    if ( files ) {
      for ( let i = 0; i < files.length; i++ ) {
        formData.append('src_img', files[i], files[i].name);
      }
    }
    formData.append('json', JSON.stringify(data));
    return this._http.post(this.url() + '/signUp', formData, this.headersFormData()).map(res => res.json());
  }

  validateDni(dni) {
    return this._http.get(this.url() + '/signUp/' + dni, null).map(res => res.json());
  }

  validateEmail(email) {
    return this._http.post(this.url() + '/signUp/' + email, null, this.headers()).map(res => res.json());
  }

  logout() {
    return this._http.post(this.url() + '/logout', null, this.headers()).map(res => res.json());
  }

  refresh() {
    return this._http.post(this.url() + '/refresh', null, this.headers()).map(res => res.json());
  }

  password(data) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.post(this.url() + '/password', params, this.headers()).map(res => res.json());
  }

  dashboardAdmin() {
    return this._http.get(this.url() + '/admin/dashboard', this.headers()).map(res => res.json());
  }

  setToken(token) {
    if (token) {
      sessionStorage.setItem('token', token);
      this.token = token;
    } else {
      sessionStorage.removeItem('token');
      this.token = null;
    }
  }

  getToken() {
    if ( !this.token ) {
      const token = sessionStorage.getItem('token');
      if (token !== 'undefined') {
        this.token = token;
      } else {
        this.token = null;
      }
    }
    return this.token;
  }

  setExpire(expire) {
    if (expire) {
      sessionStorage.setItem('expire', expire);
      this.expire = expire;
    } else {
      sessionStorage.removeItem('expire');
      this.expire = null;
    }
  }

  getExpire() {
    if ( !this.expire ) {
      const expire = sessionStorage.getItem('expire');
      if (expire !== 'undefined') {
        this.expire = expire;
      } else {
        this.expire = null;
      }
    }
    return this.expire;
  }

  setIdentity(identity) {
    if (identity) {
      const user = sessionStorage.setItem('identity', JSON.stringify(identity));
      this.identity = user;
    } else {
      sessionStorage.removeItem('identity');
      this.identity = null;
    }
  }

  getIdentity() {
    if ( !this.identity ) {
      const identity = JSON.parse(sessionStorage.getItem('identity'));
      if (identity !== 'undefined') {
        this.identity = identity;
      } else {
        this.identity = null;
      }
    }
    return this.identity;
  }

  setAlumno(al) {
    if (al) {
      const alumno = sessionStorage.setItem('alumno', JSON.stringify(al));
      this.alumno = alumno;
    } else {
      sessionStorage.removeItem('alumno');
      this.alumno = null;
    }
  }

  getAlumno() {
    if ( !this.alumno ) {
      const alumno = JSON.parse(sessionStorage.getItem('alumno'));
      if (alumno !== 'undefined') {
        this.alumno = alumno;
      } else {
        this.alumno = null;
      }
    }
    return this.alumno;
  }

  getTokenExpirationDate(): Date {
    const date = new Date(0);
    date.setUTCSeconds(this.expire ? this.expire : 0);
    return date;
  }

  isTokenExpired(expire: number): boolean {
    const date = this.getTokenExpirationDate();
    if ( date === undefined ) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
  }

  sessionLogout() {
    this.setToken(null);
    this.setExpire(null);
    this.setIdentity(null);
    this.setAlumno(null);
    return this._Router.navigateByUrl('ingresar');
  }

}
