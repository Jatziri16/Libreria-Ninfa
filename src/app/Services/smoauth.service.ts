import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SmoauthService 
{

  correoUser: string;
  nameUser: string;
  lastNameUser: string;
  inicioFbGoo = false;
  usuarioFirebase: any;

  constructor(private Auth: AngularFireAuth,
              private router: Router,
              private _userService: UsuarioService,
              private toastr: ToastrService) 
  { 
    this.correoUser = "";
    this.nameUser = "";
    this.lastNameUser = "";

  }

  FbAuthLogin(provider: any)
  {
    // console.log("auth login");
    return this.Auth.signInWithPopup(provider).then((result) =>
    {
      let nuevoUser;
      // console.log(result)
      nuevoUser = result.additionalUserInfo?.isNewUser;
      const perfil: any = { Usuario: result.additionalUserInfo?.profile };
      if (nuevoUser)
      {
        // const perfil: any = { Usuario: result.additionalUserInfo?.profile };
        this.usuarioFirebase = this._userService.getMailCajero(perfil.Usuario.email).then(snapshot =>
        {
          if(snapshot.empty) 
          {
            // console.log('Éxito, No hay registro del correo FACEBOOK');
            const cajero:any =  
            {
              Nombre: perfil.Usuario.first_name,
              Apellido: perfil.Usuario.last_name,
              Correo: perfil.Usuario.email,
            }
            this.nameUser = cajero.Nombre;
            this.lastNameUser = cajero.Apellido;
            this.correoUser = cajero.Correo;
            this.inicioFbGoo = true;
            this.router.navigate(['/registro']);
            // this._userService.registrarCajero(cajero).then(() =>
            // {
            //   console.log("Se ha logueado exitosamente con Facebook!");
            //   this.toastr.success('Se ha logueado exitosamente con Google!', 'LOGIN',
            //   {
            //     positionClass: 'toast-bottom-right'
            //   });
            //   this._userService.setToken(this._userService.getRandomToken(16), this._userService.nuevaExpiracion(10));
            //   this.router.navigate(['/lista']);
            // })
          }
          else
          {
            this.toastr.error('Ya existe registro con el correo', 'Error',
            {
              positionClass: 'toast-bottom-right'
            });
            return;
          }
        })
      }
      else
      {
        this.usuarioFirebase = this._userService.getMailCajero(this.correoUser).then(snapshot =>
        {
          if(snapshot.empty) 
          {
            // console.log('Éxito, No hay registro del correo FACEBOOK');
            const cajero:any =  
            {
              Nombre: perfil.Usuario.first_name,
              Apellido: perfil.Usuario.last_name,
              Correo: perfil.Usuario.email,
            }
            this.nameUser = cajero.Nombre;
            this.lastNameUser = cajero.Apellido;
            this.correoUser = cajero.Correo;
            this.inicioFbGoo = true;
            this.router.navigate(['/registro']);
          }
          else
          {
            // console.log("Se ha logueado exitosamente con Facebook!");
            this.toastr.success('Acceso concedido:), se ha logueado exitosamente con Facebook', 'LOGIN',
            {
              positionClass: 'toast-bottom-right'
            });
            this._userService.setToken(this._userService.getRandomToken(16), this._userService.nuevaExpiracion(10));
            this.router.navigate(['/lista']);
          }
        })
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  GoogleAuthLogin(provider: any)
  {
    // console.log("auth login");
    return this.Auth.signInWithPopup(provider).then((result) =>
    {
      let nuevoUser;
      // console.log(result)
      const perfil: any = { Usuario: result.additionalUserInfo?.profile }
      nuevoUser = result.additionalUserInfo?.isNewUser;

      if (nuevoUser)
      {
        this.usuarioFirebase = this._userService.getMailCajero(perfil.Usuario.email).then(snapshot =>
        {
          if(snapshot.empty) 
          {
            // console.log('Éxito, No hay registro del correo');
            const cajero:any =  
            {
              Nombre: perfil.Usuario.given_name,
              Apellido: perfil.Usuario.family_name,
              Correo: perfil.Usuario.email,
            }
            this.nameUser = cajero.Nombre;
            this.lastNameUser = cajero.Apellido;
            this.correoUser = cajero.Correo;
            this.inicioFbGoo = true;
            this.router.navigate(['/registro']);
            // this._userService.registrarCajero(cajero).then(() =>
            // {
            //   console.log("Se ha logueado exitosamente con Google!");
            //   this.toastr.success('Se ha logueado exitosamente con Google!', 'LOGIN',
            //   {
            //     positionClass: 'toast-bottom-right'
            //   });
            //   this._userService.setToken(this._userService.getRandomToken(16), this._userService.nuevaExpiracion(10));
            //   this.router.navigate(['/lista']);
            // })
          }
          else
          {
            this.toastr.error('Ya existe registro con el correo', 'Error',
            {
              positionClass: 'toast-bottom-right'
            });
            return;
          }
        })
      }
      else
      {
        this.usuarioFirebase = this._userService.getMailCajero(this.correoUser).then(snapshot =>
        {
          if(snapshot.empty) 
          {
            const cajero:any =  
            {
              Nombre: perfil.Usuario.given_name,
              Apellido: perfil.Usuario.family_name,
              Correo: perfil.Usuario.email,
            }
            this.nameUser = cajero.Nombre;
            this.lastNameUser = cajero.Apellido;
            this.correoUser = cajero.Correo;
            this.inicioFbGoo = true;
            this.inicioFbGoo = true;
            this.router.navigate(['/registro']);
          }
          else
          {
            // console.log("Se ha logueado exitosamente con Google!");
            this.toastr.success('Acceso concedido:)', 'LOGIN',
            {
              positionClass: 'toast-bottom-right'
            });
            this._userService.setToken(this._userService.getRandomToken(16), this._userService.nuevaExpiracion(10));
            this.router.navigate(['/lista']);
          }
        })
      }
    }).catch((error) =>
    {
      console.log(error)
    })
  }

  google()
  {
    
  }
}
