import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
//import { LoginComponent } from '../Components/login/login.component';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService 
{
  cel: string;
  constructor(private firestore: AngularFirestore,
              private _cookies: CookieService,
              private router: Router,
              private toastr: ToastrService,) 
              {
                this.cel = "";
              }

  Login(usuario: string, nivel: string) //recibe dos parámetros (usuario y nivel) de tipo string.
  {
    if (nivel == 'gerente')
    {
      //                                            Nombre de la llave', condición (igual), parámetro usuario      
      return this.firestore.collection('UserAdmin', ref => ref.where('Usuario', '==', usuario)).get().toPromise(); // Convertirlo todo a una promesa, ya que del otro lado donde se llame este método se recibirá esta promesa para aplicarle una lambda del otro lado.
    }
    else 
    {
      return this.firestore.collection('UserCajero', ref => ref.where('Usuario', '==', usuario)).get().toPromise();
    }
    //return this.firestore.collection('Usuarios', ref => ref.where('Usuario', '==', usuario)).get().toPromise();
  }

  getTelefono(celular: string)
  {
    return this.cel = celular;
  }

  getUserCajero(user: string)
  {
    return this.firestore.collection('UserCajero', ref => ref.where('Usuario', '==', user)).get().toPromise();
  }
  getMailCajero(mail: string)
  {
    return this.firestore.collection('UserCajero', ref => ref.where('Correo', '==', mail)).get().toPromise();
  }
  registrarCajero(cajero: any): Promise<any>
  {
    return this.firestore.collection('UserCajero').add(cajero);
  }

  setToken(token: string, minutos: number)
  {
    this._cookies.set("token", token, minutos);
  }

  getToken()
  {
    return this._cookies.get("token");
  }

  getRandomToken(size: number)
  {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i=0; i<size; i++)
    {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result; 
  }

  Logout()
  {
    //console.log("Borrando");
    this.router.navigate(['/login']);
    this._cookies.delete("token", "/");
   
  }

  nuevaExpiracion(minutos: number)
  {
    return (1/1440)*minutos;
  }

  renovacionToken()
  {
    let cookie = this.getToken();
    if (!cookie)
    {
      //console.log("No se encontró la sesión");
      this.Logout();
      this.toastr.warning('No tiene autorizacion para ver este contenido, favor de iniciar sesión', 'Warning!',
      {
        positionClass: 'toast-bottom-right'
      });
    }
    else
    {
      //console.log("La cookie es: " +cookie)
      this.setToken(this.getToken(), this.nuevaExpiracion(10));
      //console.log("Token renovado!:)");
    }
  }

  // REGISTRO
  
}

//iniciarS(): Observable<any>
  // {
  //   return this.firestore.collection('Usuarios').snapshotChanges();
  // }