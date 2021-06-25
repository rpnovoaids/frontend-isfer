import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { AppComponent } from '../../../app.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
  providers: [
    AuthService
  ]
})
export class LogoutComponent implements OnInit {

  constructor(
    private _Router: Router,
    private _SnotifyService: SnotifyService,
    private _AppComponent: AppComponent,
    private _AuthService: AuthService
  ) { }

  ngOnInit() {
    this._AuthService.logout().subscribe(
      response => {
        this._SnotifyService.success('Sesión Cerrada', 'Exito..!');
        this._AuthService.sessionLogout();
      },
      error => {
        if ( error.status === 401 ) {
          this._AuthService.sessionLogout();
        }
      }
    );
  }

}
