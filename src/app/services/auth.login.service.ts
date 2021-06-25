import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthLoginService implements CanActivate {

  constructor(
    private _Router: Router
  ) {}

  canActivate() {
    if ( !sessionStorage.getItem('identity') ) {
      return true;
    }

    this._Router.navigate(['/inicio']);
    return false;
  }

}
