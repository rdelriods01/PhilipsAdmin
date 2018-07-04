import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, Validators, ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// Firebase ====================
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

// Angular Material ====================
import { MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule, 
          MatInputModule, MatFormFieldModule, MatSidenavModule, MatListModule,
          MatExpansionModule, MatPaginatorModule, MatSortModule,MatTabsModule,
          MatDatepickerModule, MatNativeDateModule, MatDialogModule,MatSelectModule,
          MatRadioModule, MatButtonToggleModule, MatSliderModule, MatAutocompleteModule
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
import { NewSwoComponent } from './components/newSwo.component';
import { SwoComponent } from './components/Swo.component';


// Rutas =============================
const routes: Routes = [
  { path:'', component: LayoutComponent ,children:[
    { path:'', component: DashboardComponent},
    { path:'test', component: TestComponent },
    { path:'config', component: ConfigComponent },
    { path:'bi', component: BaseInstaladaComponent},
    { path:'equipo/:id', component: PerfilEquipoComponent },
    { path:'swo/:id', component: SwoComponent}
  ]},
  { path:'login', component: LoginComponent},
  { path:'**', redirectTo: '', pathMatch: 'full'}
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
    NewSwoComponent,
    SwoComponent
  ],
  entryComponents:[
    NewClienteComponent, NewEquipoComponent, NewSwoComponent
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
    // Material
    MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule,MatInputModule, MatFormFieldModule,
    MatSidenavModule, MatListModule, MatExpansionModule, MatPaginatorModule, MatSortModule, MatTabsModule,
    MatDatepickerModule, MatNativeDateModule,MatDialogModule, MatSelectModule, MatRadioModule,
    MatButtonToggleModule,MatSliderModule, MatAutocompleteModule
  ],
  providers: [
    AuthService,
    ClienteService,
    EquipoService,
    SWOService, 
    ConfigService, 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
