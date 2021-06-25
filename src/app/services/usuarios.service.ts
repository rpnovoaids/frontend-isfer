import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from './auth.service';

@Injectable()
export class UsuariosService {

  constructor(
    private _http: Http,
    private _Auth: AuthService
  ) { }

  index() {
    return this._http.get(this._Auth.url() + '/usuarios', this._Auth.headers()).map(res => res.json());
  }

  store(data) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.post(this._Auth.url() + '/usuarios', params, this._Auth.headers()).map(res => res.json());
  }

  update(files, data, id) {
    const formData: any = new FormData();
    formData.append('_method', 'PUT');
    formData.append('json', JSON.stringify(data));
    if ( files ) {
      for ( let i = 0; i < files.length; i++ ) {
        formData.append('src_img', files[i], files[i].name);
      }
    }
    return this._http.post(this._Auth.url() + '/usuarios/' + id, formData, this._Auth.headersFormData()).map(res => res.json());
  }

}
