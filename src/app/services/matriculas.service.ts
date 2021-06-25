import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from './auth.service';

@Injectable()
export class MatriculasService {

  constructor(
    private _http: Http,
    private _Auth: AuthService
  ) { }

  index() {
    return this._http.get(this._Auth.url() + '/matriculas', this._Auth.headers()).map(res => res.json());
  }

  store(data) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.post(this._Auth.url() + '/matriculas', params, this._Auth.headers()).map(res => res.json());
  }

  update(data, id) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.put(this._Auth.url() + '/matriculas/' + id, params, this._Auth.headers()).map(res => res.json());
  }

  byAlumno(id) {
    return this._http.get(this._Auth.url() + '/matriculas/' + id + '/by', this._Auth.headers()).map(res => res.json());
  }

  byPeriodoAndEtapa() {
    return this._http.get(this._Auth.url() + '/matriculas/by/periodo/etapa/all', this._Auth.headers()).map(res => res.json());
  }

}
