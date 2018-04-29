import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
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
          MatRadioModule, MatButtonToggleModule, MatSliderModule
    } from '@angular/material';

// Servicios ==========================
import { AuthService } from './services/auth.service';
// import { ConfigService } from './services/config.service';
// import { PacienteService } from './services/paciente.service';
// import { VisitaService } from './services/visita.service';

// Componentes ========================
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login.component';
import { LayoutComponent } from './components/layout.component';
import { DashboardComponent } from './components/dashboard.component';
import { TestComponent } from './components/test.component';

// Rutas =============================
const routes: Routes = [
  { path:'', component: LayoutComponent ,children:[
    { path:'', component: DashboardComponent},
    { path:'test', component: TestComponent },
    // { path:'pacientes', component: PacientesComponent},
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

  ],
  entryComponents:[

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
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
    MatButtonToggleModule,MatSliderModule
  ],
  providers: [
    AuthService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
