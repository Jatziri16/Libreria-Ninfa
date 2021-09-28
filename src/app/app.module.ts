import { BrowserModule } from '@angular/platform-browser';
//Componentes
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { ListaLibrosComponent } from './Components/lista-libros/lista-libros.component';
import { NuevoLibroComponent } from './Components/nuevo-libro/nuevo-libro.component';
import { MenuComponent } from './Components/menu/menu.component';   // cambio
import { RegistrarUserComponent } from './Components/registrar-user/registrar-user.component';
import { TerminosCondicionesComponent } from './Components/terminos-condiciones/terminos-condiciones.component';

//Modulos
import { NgModule } from '@angular/core'; 
import { RouterModule, Routes } from '@angular/router'; // Routes (agragó manualmente) --(S3-M1)
import { AngularFireModule } from '@angular/fire';    //agrego
import { environment } from '../environments/environment';  //
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/auth';
//import { CommonModule } from '@angular/common'; //toastr
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; //toastr
import { ToastrModule } from 'ngx-toastr'; //toastr
import { FormsModule } from '@angular/forms'; // ngModel *********** agregar
import { CookieService } from 'ngx-cookie-service';
import { RecaptchaModule } from 'ng-recaptcha';

// Angular Material 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PhoneLoginComponent } from './Components/phone-login/phone-login.component';

const appRoutes : Routes = [                            // constante (appRoutes) del tipo routes
  {path: '', redirectTo: 'login', pathMatch: 'full'},   // El primero que se abrirá (S3-M1)
  {path: 'lista', component: ListaLibrosComponent},     // Ruta virtual --(S3-M1)
  {path: 'login', component: LoginComponent},           // Ruta virtual --(S3-M1)
  {path: 'nuevo', component: NuevoLibroComponent},      // Ruta virtual --(S3-M1)
  {path: 'editlibro/:id', component: NuevoLibroComponent}, // ":id" envia el mismo componente pero se le envia un parámetro llamado id
  {path: 'registro', component: RegistrarUserComponent},
  {path: 'terminos', component: TerminosCondicionesComponent},
  {path: 'verificacion', component: PhoneLoginComponent},
  {path: '**', redirectTo: 'lista', pathMatch: 'full'}  // En caso de que se ingrese una ruta desconocida se redireccionará a lista --(S3-M1
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListaLibrosComponent,
    NuevoLibroComponent,
    MenuComponent,
    RegistrarUserComponent,
    TerminosCondicionesComponent,
    PhoneLoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),   //Route (se inyecta la constante appRoutes)  --(S3-M1)
    AngularFireModule.initializeApp(environment.firebase), //agrego
    AngularFirestoreModule,
    ReactiveFormsModule,      // --(S2-M2)
    BrowserAnimationsModule,  // required animations module
    ToastrModule.forRoot(),   // ToastrModule added
    RecaptchaModule,
    AngularFireAuthModule,
    FormsModule,        // ngModel 

    // Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent] 
})
export class AppModule { }
