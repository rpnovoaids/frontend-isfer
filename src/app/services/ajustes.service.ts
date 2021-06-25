import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from './auth.service';

@Injectable()
export class AjustesService {

  constructor(
    private _http: Http,
    private _Auth: AuthService
  ) { }

  /* Periodos */

  periodos_index() {
    return this._http.get(this._Auth.url() + '/periodos', this._Auth.headers()).map(res => res.json());
  }

  periodos_store(data) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.post(this._Auth.url() + '/periodos', params, this._Auth.headers()).map(res => res.json());
  }

  periodos_update(data, id) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.put(this._Auth.url() + '/periodos/' + id, params, this._Auth.headers()).map(res => res.json());
  }

  periodos_active() {
    return this._http.get(this._Auth.url() + '/periodos/by/active', this._Auth.headers()).map(res => res.json());
  }

  periodos_activeExToken() {
    return this._http.get(this._Auth.url() + '/periodos/active/ex/token', this._Auth.headers()).map(res => res.json());
  }

  /* Carreras */

  carreras_index() {
    return this._http.get(this._Auth.url() + '/carreras', this._Auth.headers()).map(res => res.json());
  }

  carreras_store(data) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.post(this._Auth.url() + '/carreras', params, this._Auth.headers()).map(res => res.json());
  }

  carreras_update(data, id) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.put(this._Auth.url() + '/carreras/' + id, params, this._Auth.headers()).map(res => res.json());
  }

  carreras_active() {
    return this._http.get(this._Auth.url() + '/carreras/active/all', this._Auth.headers()).map(res => res.json());
  }

  carreras_activeExToken() {
    return this._http.get(this._Auth.url() + '/carreras/active/ex/token', this._Auth.headers()).map(res => res.json());
  }

  /* Etapas */

  etapas_index() {
    return this._http.get(this._Auth.url() + '/etapas', this._Auth.headers()).map(res => res.json());
  }

  etapas_store(data) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.post(this._Auth.url() + '/etapas', params, this._Auth.headers()).map(res => res.json());
  }

  etapas_update(data, id) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.put(this._Auth.url() + '/etapas/' + id, params, this._Auth.headers()).map(res => res.json());
  }

  etapas_active() {
    return this._http.get(this._Auth.url() + '/etapas/active/all', this._Auth.headers()).map(res => res.json());
  }

  etapas_activeExToken() {
    return this._http.get(this._Auth.url() + '/etapas/active/ex/token', this._Auth.headers()).map(res => res.json());
  }

  etapas_etapaActual() {
    return this._http.get(this._Auth.url() + '/etapa/actual', this._Auth.headers()).map(res => res.json());
  }

  /* Ciclos */

  ciclos_index() {
    return this._http.get(this._Auth.url() + '/etapas', this._Auth.headers()).map(res => res.json());
  }

  ciclos_store(data) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.post(this._Auth.url() + '/ciclos', params, this._Auth.headers()).map(res => res.json());
  }

  ciclos_update(data, id) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.put(this._Auth.url() + '/ciclos/' + id, params, this._Auth.headers()).map(res => res.json());
  }

  ciclos_indexByEtapa(id) {
    return this._http.get(this._Auth.url() + '/ciclos/' + id + '/all', this._Auth.headers()).map(res => res.json());
  }

  ciclos_byEtapa() {
    return this._http.get(this._Auth.url() + '/ciclos/by/etapa/all', this._Auth.headers()).map(res => res.json());
  }

  ciclos_active() {
    return this._http.get(this._Auth.url() + '/ciclos/filter/active/all', this._Auth.headers()).map(res => res.json());
  }

  ciclos_activeExToken() {
    return this._http.get(this._Auth.url() + '/ciclos/filter/active/ex/token', this._Auth.headers()).map(res => res.json());
  }

  /* TipoMatriculas */

  tipoMatriculas_index() {
    return this._http.get(this._Auth.url() + '/tipoMatriculas', this._Auth.headers()).map(res => res.json());
  }

  tipoMatriculas_store(data) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.post(this._Auth.url() + '/tipoMatriculas', params, this._Auth.headers()).map(res => res.json());
  }

  tipoMatriculas_show(id) {
    return this._http.get(this._Auth.url() + '/tipoMatriculas/' + id, this._Auth.headers()).map(res => res.json());
  }

  tipoMatriculas_update(data, id) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.put(this._Auth.url() + '/tipoMatriculas/' + id, params, this._Auth.headers()).map(res => res.json());
  }

  tipoMatriculas_active() {
    return this._http.get(this._Auth.url() + '/tipoMatriculas/active/all', this._Auth.headers()).map(res => res.json());
  }

  tipoMatriculas_activeExToken() {
    return this._http.get(this._Auth.url() + '/tipoMatriculas/active/ex/token', this._Auth.headers()).map(res => res.json());
  }

  /* TipoPagos */

  tipoPagos_index() {
    return this._http.get(this._Auth.url() + '/tipoPagos', this._Auth.headers()).map(res => res.json());
  }

  tipoPagos_store(data) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.post(this._Auth.url() + '/tipoPagos', params, this._Auth.headers()).map(res => res.json());
  }

  tipoPagos_update(data, id) {
    const params = 'json=' + JSON.stringify(data);
    return this._http.put(this._Auth.url() + '/tipoPagos/' + id, params, this._Auth.headers()).map(res => res.json());
  }

  tipoPagos_indexByTipoMatricula(id) {
    return this._http.get(this._Auth.url() + '/tipoPagos/' + id + '/all', this._Auth.headers()).map(res => res.json());
  }

  tipoPagos_active() {
    return this._http.get(this._Auth.url() + '/tipoPagos/all/active', this._Auth.headers()).map(res => res.json());
  }

  tipoPagos_activeExToken() {
    return this._http.get(this._Auth.url() + '/tipoPagos/active/ex/token', this._Auth.headers()).map(res => res.json());
  }

}
