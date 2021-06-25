import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { GrowlModule, OverlayPanelModule, MessagesModule, MessageModule, MessageService} from 'primeng/primeng';
import { DataTableModule , SharedModule, ButtonModule, InputTextModule } from 'primeng/primeng';
import { CheckboxModule, FieldsetModule, DialogModule, PanelModule } from 'primeng/primeng';
import { ConfirmDialogModule , ConfirmationService } from 'primeng/primeng';
import { InputTextareaModule, CalendarModule } from 'primeng/primeng';
import { InputSwitchModule, KeyFilterModule } from 'primeng/primeng';
import { ToolbarModule } from 'primeng/toolbar';
import { AccordionModule } from 'primeng/accordion';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { PasswordModule } from 'primeng/password';
import { DataViewModule } from 'primeng/dataview';
import { InputMaskModule } from 'primeng/inputmask';
import { LightboxModule } from 'primeng/lightbox';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';

import { NgxGalleryModule } from 'ngx-gallery';

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
import { TipoMatriculasPagosComponent } from './items/menu/tipo-matriculas-pagos/tipo-matriculas-pagos.component';
import { CiclosComponent } from './items/menu/ciclos/ciclos.component';
import { CarrerasPeriodosComponent } from './items/menu/carreras-periodos/carreras-periodos.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    SignUpComponent,
    LockscreenComponent,
    PasswordComponent,
    UsuariosComponent,
    AjustesComponent,
    MatriculaComponent,
    PagoMatriculaComponent,
    MisMatriculasComponent,
    MatriculasComponent,
    LogoutComponent,
    AvatarComponent,
    TipoMatriculasPagosComponent,
    CiclosComponent,
    CarrerasPeriodosComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    NgxGalleryModule,
    SnotifyModule,
    GrowlModule,
    MessagesModule,
    MessageModule,
    DataTableModule,
    TableModule,
    SharedModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    FieldsetModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    MultiSelectModule,
    InputTextareaModule,
    PanelModule,
    CalendarModule,
    InputSwitchModule,
    KeyFilterModule,
    ToolbarModule,
    AccordionModule,
    SplitButtonModule,
    CardModule,
    OverlayPanelModule,
    RadioButtonModule,
    TooltipModule,
    FileUploadModule,
    PasswordModule,
    DataViewModule,
    InputMaskModule,
    LightboxModule
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService,
    MessageService,
    ConfirmationService
  ],
  bootstrap: [
    AppComponent
  ],
  exports: [
  ]
})
export class AppModule { }
