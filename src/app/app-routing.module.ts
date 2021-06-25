import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthCanService } from './services/auth.can.service';
import { AuthLoginService } from './services/auth.login.service';
import { AuthSignUpService } from './services/auth.sign.up.service';

import { DashboardComponent } from './items/default/dashboard/dashboard.component';
import { LoginComponent } from './items/default/login/login.component';
import { SignUpComponent } from './items/default/signUp/sign-up.component';
import { LogoutComponent } from './items/default/logout/logout.component';
import { LockscreenComponent } from './items/default/lockscreen/lockscreen.component';
import { PasswordComponent } from './items/default/password/password.component';
import { AvatarComponent } from './items/default/avatar/avatar.component';

import { UsuariosComponent } from './items/menu/usuarios/usuarios.component';
import { AjustesComponent } from './items/menu/ajustes/ajustes.component';
import { MatriculaComponent } from './items/menu/matricula/matricula.component';
import { PagoMatriculaComponent } from './items/menu/pago-matricula/pago-matricula.component';
import { MisMatriculasComponent } from './items/menu/mis-matriculas/mis-matriculas.component';
import { MatriculasComponent } from './items/menu/matriculas/matriculas.component';
import {CarrerasPeriodosComponent} from './items/menu/carreras-periodos/carreras-periodos.component';
import {CiclosComponent} from './items/menu/ciclos/ciclos.component';
import {TipoMatriculasPagosComponent} from './items/menu/tipo-matriculas-pagos/tipo-matriculas-pagos.component';

const routes: Routes = [
  { path: 'inicio', component: DashboardComponent, canActivate: [AuthCanService] },
  { path: 'ingresar', component: LoginComponent, canActivate: [AuthLoginService] },
  { path: 'registrarme', component: SignUpComponent, canActivate: [AuthSignUpService] },
  { path: 'avatar', component: AvatarComponent, canActivate: [AuthCanService] },
  { path: 'contraseña', component: PasswordComponent, canActivate: [AuthCanService] },
  { path: 'sesion', component: LockscreenComponent, canActivate: [AuthCanService] },
  { path: 'logout', component: LogoutComponent },
  { path: 'matricula/:id', component: MatriculaComponent },
  { path: 'matricula/pagos/:id', component: PagoMatriculaComponent },
  { path: 'matriculas', component: MatriculasComponent },
  { path: 'mis-matriculas', component: MisMatriculasComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'carreras-periodos', component: CarrerasPeriodosComponent },
  { path: 'ciclos', component: CiclosComponent },
  { path: 'tipo-matriculas-pagos', component: TipoMatriculasPagosComponent },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthCanService,
    AuthLoginService,
    AuthSignUpService
  ]
})
 export class AppRoutingModule {
}
