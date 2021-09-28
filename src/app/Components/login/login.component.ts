import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
//import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
//import { Observable } from 'rxjs';
import { Router } from '@angular/router';
//import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/Services/usuario.service';
//import { info } from 'node:console';
import firebase from 'firebase/app';
import "firebase/auth";
import { SmoauthService } from 'src/app/Services/smoauth.service';
import * as CryptoJS from 'crypto-js';
// import { TelefonoService } from 'src/app/Services/telefono.service';
// import { WindowService } from 'src/app/Services/window.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit 
{
  iniciarSesion : FormGroup;
  paloma: FormGroup;        // FormGroup Paloma (checkbox)
  usuario: string;
  password: string;
  nivel: string;
  usuarioFirebase: any;
  intentos: number;         // Solo tiene 3 intentos, de lo contrario tendrá que esperar 3min
  bloqueo = false;          // Bloquea el boton cuando excede el tiempo

  //submitted = false;
  loading = false;  // false = Muestra el login;  true = "cargando"
  terminos = false;
  selectFormControl = new FormControl('', Validators.required);
  //provider: any;
  desencrypyPSW: string;
  desencrypyTel: string;

  // windowRef: any; //recaptcha

  constructor(//firestore: AngularFirestore,
              private fb:FormBuilder,
              private router: Router,
              private toastr: ToastrService,
              private _smoauthService: SmoauthService,
              private _userService: UsuarioService,
              private Auth: AngularFireAuth,
              //private _telService: TelefonoService,
              // private _windowService: WindowService,
              )  
  { 
    //this.items = firestore.collection('Usuarios').valueChanges();
    this.iniciarSesion = this.fb.group
    ({
      Password: ['', [Validators.required, Validators.pattern("^[a-zA-záéíóúÁÉÍÓÚñÑ0-9&#$%()=¿?¡!._-]*$")]],
      Username: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._-]*$")]], // Correo: ['', Validators.email],
      Niveles:  [''],
    });
    this.usuario = "";
    this.password = "";
    this.nivel = "";
    this.intentos = 0;
    this.desencrypyPSW = "";
    this.desencrypyTel = "";
    //this.provider = new firebase.auth.FacebookAuthProvider();

    this.paloma = new FormGroup
    ({
      aceptarTerminos: new FormControl()
    });
  }

  ngOnInit(): void 
  {
    this._userService.Logout();
    // this.windowRef = this._windowService.windowRef
    // //firebase.initializeApp(environment.firebase);
    // this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    // this.windowRef.recaptchaVerifier.render();
  }

  usuarioLogin()
  {
    this.loading = false;
    this.nivel = this.iniciarSesion.value.Niveles;
    this.usuario = this.iniciarSesion.value.Username;
    this.password = this.iniciarSesion.value.Password;

    if(this.iniciarSesionControl.Password.invalid || this.iniciarSesionControl.Username.invalid)
    {
      this.toastr.error('Todos los campos son obligatorios', 'Error!',
      {
        positionClass: 'toast-bottom-right'
      });
    }
    else
    {
      if (this.nivel == 'cajero' || this.nivel == 'gerente')
      {
        if (this.terminos)
        {
          this.usuarioFirebase = this._userService.Login(this.usuario, this.nivel).then(snapshot =>
          {
            if(snapshot.empty) 
            {
              //console.log('No se encontro registro');
              this.toastr.error('No se encontró registro', 'Error!',
              {
                positionClass: 'toast-bottom-right'
              });
              
              return;
            }
            this.getInfo(snapshot.docs);
              //console.log('Usuario encontrado');
          })
        }
        else
        {
          this.toastr.warning('Favor de aceptar los terminos de servicio', 'Warning!',
          {
            positionClass: 'toast-bottom-right'
          });
          return;
        }
      }
      else
      {
        this.toastr.warning('Selecciona un nivel', 'Warning!',
        {
          positionClass: 'toast-bottom-right'
        });
        return;
      }
    }
  }
  
  getInfo(data: any)
  {
    // Por cada doc se va a extraer data
    data.forEach((doc: { data: () => any; }) =>
    {
      let info = doc.data();
      //console.log(info.Contrasenia, 'Password');
      this.desencrypyPSW = CryptoJS.AES.decrypt(info.Contrasenia.trim(), this.password.trim()).toString(CryptoJS.enc.Utf8);
      this.desencrypyTel = CryptoJS.AES.decrypt(info.Telefono.trim(), this.password.trim()).toString(CryptoJS.enc.Utf8);
      // this.desencrypyTel = info.Telefono;
      // console.log(this.desencrypyTel);
      if(this.desencrypyPSW == this.password)
      {
        //console.log('Acceso concedido');
        // this.toastr.success('Acceso concedido:)', 'LOGIN',
        // {
        //   positionClass: 'toast-bottom-right'
        // });
        this._userService.getTelefono(this.desencrypyTel);
        this.router.navigate(['/verificacion']);
        // this._userService.setToken(this._userService.getRandomToken(16), this._userService.nuevaExpiracion(10));
        // this.router.navigate(['/lista']);
      }
      else
      {
        //console.log('Acceso rechazado');
        this.toastr.error('Acceso rechazado', 'Error!',
        {
          positionClass: 'toast-bottom-right'
        });

        // A partir de aqui cuenta los intentos, si excedes de 3 intentos para ingresar tendrá que esperar 3min para volver a intentarlo
        this.intentos += 1;
        if (this.intentos == 3)
        {
          this.bloqueo = true;
          this.toastr.warning('Excedió el número de intentos, espere 3 minutos', 'Error!',
          {
            positionClass: 'toast-bottom-right'
          });

          setTimeout(()=>{            
            this.bloqueo = false;
          }, 180000); // 180000 milisegundos = 3min
          this.intentos = 0;
        }
      }
    });
    
  }
  
  public resolved(captchaResponse: string)
  {
    //console.log(`Resuelto con el captcha que respondio: ${captchaResponse}`)
  }

  loginWithFb()
  {
    //console.log("login with facebook");
    return this._smoauthService.FbAuthLogin(new firebase.auth.FacebookAuthProvider());
    //return this.FbAuthLogin(new firebase.auth.FacebookAuthProvider());
  }

  loginWithGoogle()
  {
    return this._smoauthService.GoogleAuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  get iniciarSesionControl()
  {
    return this.iniciarSesion.controls
  }
}