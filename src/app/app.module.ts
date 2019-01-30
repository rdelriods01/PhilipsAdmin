import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// Firebase ====================
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

// Angular Material ====================
import {
  MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule,
  MatInputModule, MatFormFieldModule, MatSidenavModule, MatListModule,
  MatExpansionModule, MatPaginatorModule, MatSortModule, MatTabsModule,
  MatDatepickerModule, MatNativeDateModule, MatDialogModule, MatSelectModule,
  MatRadioModule, MatButtonToggleModule, MatSliderModule, MatAutocompleteModule,
  MatTableModule, MatProgressBarModule, MatSlideToggleModule, MatCheckboxModule
} from '@angular/material';

// Flatpicker
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

// Servicios ==========================
import { AuthService } from './services/auth.service';
import { ClienteService } from './services/cliente.service';
import { EquipoService } from './services/equipo.service';
import { SWOService } from './services/swo.service';
import { ConfigService } from './services/config.service';

// Componentes ========================
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login.component';
import { LayoutComponent } from './components/layout.component';
import { DashboardComponent } from './components/dashboard.component';
import { TestComponent } from './components/test.component';
import { ConfigComponent } from './components/config.component';
import { BaseInstaladaComponent } from './components/baseInstalada.component';
import { NewClienteComponent } from './components/newCliente.component';
import { NewEquipoComponent } from './components/newEquipo.component';
import { PerfilEquipoComponent } from './components/perfilEquipo.component';
import { PerfilClienteComponent } from './components/perfilCliente.component';
import { NewSwoComponent } from './components/newSwo.component';
import { SwoComponent } from './components/swo.component';
import { OrdenPDFComponent } from './components/ordenpdf.component';
import { NewOPComponent } from './components/newOP.component';
import { UsersComponent } from './components/users.component';
import { BitacoraComponent } from './components/bitacora.component';
import { SetGuiaComponent } from './components/setGuia.component';
import { RecibirComponent } from './components/recibir.component';
import { serviciosClienteComponent } from './components/serviciosCliente.component'

// Rutas =============================
const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', component: DashboardComponent },
      { path: 'config', component: ConfigComponent },
      { path: 'users', component: UsersComponent },
      { path: 'bitacora', component: BitacoraComponent },
      { path: 'recibidas', component: RecibirComponent },
      { path: 'bi', component: BaseInstaladaComponent },
      { path: 'equipo/:id', component: PerfilEquipoComponent },
      { path: 'cliente/:id', component: PerfilClienteComponent },
      { path: 'swo/:id', component: SwoComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    DashboardComponent,
    TestComponent,
    ConfigComponent,
    BaseInstaladaComponent,
    NewClienteComponent,
    NewEquipoComponent,
    PerfilEquipoComponent,
    PerfilClienteComponent,
    NewSwoComponent,
    SwoComponent,
    OrdenPDFComponent,
    NewOPComponent,
    UsersComponent,
    BitacoraComponent,
    SetGuiaComponent,
    RecibirComponent,
    serviciosClienteComponent
  ],
  entryComponents: [
    NewClienteComponent, NewEquipoComponent, NewSwoComponent, NewOPComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    Ng2FlatpickrModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    // Firebase
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    // Material
    MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule, MatFormFieldModule,
    MatSidenavModule, MatListModule, MatExpansionModule, MatPaginatorModule, MatSortModule, MatTabsModule,
    MatDatepickerModule, MatNativeDateModule, MatDialogModule, MatSelectModule, MatRadioModule,
    MatButtonToggleModule, MatSliderModule, MatAutocompleteModule, MatTableModule, MatProgressBarModule,
    MatSlideToggleModule, MatCheckboxModule
  ],
  providers: [
    AuthService,
    ClienteService,
    EquipoService,
    SWOService,
    ConfigService,
    LayoutComponent,
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
