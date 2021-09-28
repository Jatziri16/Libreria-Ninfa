import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/Services/usuario.service';
import * as CryptoJS from 'crypto-js';

import { WindowService } from 'src/app/Services/window.service';
import { SmoauthService } from 'src/app/Services/smoauth.service';
import firebase from "firebase/app";
import "firebase/auth";
//import { PhoneNumber } from '../phone-login/PhoneNumber';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-registrar-user',
  templateUrl: './registrar-user.component.html',
  styleUrls: ['./registrar-user.component.css']
})
export class RegistrarUserComponent implements OnInit 
{
  registrarUser: FormGroup;
  usuarioFirebase: any;
  submitted = false;
  // DATOS
  nom!: string;
  lastNom!: string;
  correo!: string;
  usuario!: string;
  contra1!: string;
  contra2!: string;
  encryptNombre!: string;
  encryptApellido!: string;
  encryptPassword!: string;
  encryptTelefono!: string;
  conversionEncryptNombre!: string;
  conversionEncryptApellido!: string;
  conversionEncryptContra!: string;
  conversionEncryptTelefono!: string;
  pais!: string;
  tel!: string;
  celular!:string;

  windowRef: any;

  verificationCode!: string;
  user: any;
  loading = false;
  inicioCon = false; // Fb o Google
  nombreUser!: string;
  lastUser!: string;
  emUser!: string;


  constructor(private fb:FormBuilder,
              private toastr: ToastrService,
              private router: Router,
              private _userService: UsuarioService,
              private _windowService: WindowService,
              private _smoauthService: SmoauthService) 
  { 
    if(this._smoauthService.inicioFbGoo)
    {
      this.registrarUser = this.fb.group
      ({
        user: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._-]*$")]], //.]
        password1: ['', [Validators.required, Validators.pattern("^[a-zA-záéíóúÁÉÍÓÚñÑ0-9&#$%()=¿?¡!._-]*$")]], //&#$%()=¿?¡!._-
        password2:  ['', [Validators.required, Validators.pattern("^[a-zA-záéíóúÁÉÍÓÚnÑ0-9&#$%()=¿?¡!._-]*$")]], //&#$%()=¿?¡!._-
        ctry: [''],
        phone: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      });
    }
    else
    {
      this.registrarUser = this.fb.group
      ({
        name: ['', [Validators.required, Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$")]], //"^[a-zA-z0-9&#$%()=¿?¡!._-]*$"
        lastName: ['', [Validators.required, Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$")]],
        email: ['', [Validators.required, Validators.email]], //Validators.required, 
        user: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._-]*$")]], //.]
        password1: ['', [Validators.required, Validators.pattern("^[a-zA-záéíóúÁÉÍÓÚñÑ0-9&#$%()=¿?¡!._-]*$")]], //&#$%()=¿?¡!._-
        password2:  ['', [Validators.required, Validators.pattern("^[a-zA-záéíóúÁÉÍÓÚnÑ0-9&#$%()=¿?¡!._-]*$")]], //&#$%()=¿?¡!._-
        ctry: [''],
        phone: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      });
    }
    this.pais = "";
    this.tel = ""; 
    this.celular = "";
  }
  ngOnInit(): void 
  { 
    this.windowRef = this._windowService.windowRef
    //firebase.initializeApp(environment.firebase);
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render();
    this.windowRef.confirmationResult = "";
    
    if(this._smoauthService.inicioFbGoo)
    {
      this.inicioCon = true;
      this.setDatos();
    }
  }

  setDatos()
  {
    this.nombreUser = this._smoauthService.nameUser;
    this.lastUser = this._smoauthService.lastNameUser;
    this.emUser = this._smoauthService.correoUser;
  }

  registrarCajero()
  {
    this.submitted = true;
    this.loading = true;
    if(this.registrarUser.invalid)
    {
      this.loading = false;
      this.submitted = false;
      this.toastr.error('Ingrese datos que sean válidos', 'Error!',
      {
        positionClass: 'toast-bottom-right'
      });
      return;
    }
    else
    {
      this.registro();
    }
  }

  registro()
  {
    if(this.inicioCon)
    {
      this.nom = this._smoauthService.nameUser;
      this.lastNom = this._smoauthService.lastNameUser;
      this.correo = this._smoauthService.correoUser;
    }
    else
    {
      this.nom = this.registrarUser.value.name;
      this.lastNom = this.registrarUser.value.lastName;
      this.correo = this.registrarUser.value.email; 
    }
    this.usuario = this.registrarUser.value.user;
    this.contra1 = this.registrarUser.value.password1;
    this.contra2 = this.registrarUser.value.password2;
    this.pais = this.registrarUser.value.ctry;
    this.tel = this.registrarUser.value.phone;

    this.celular = this.pais + this.tel;

    if(this.contra1 == this.contra2)
    {
      this.usuarioFirebase = this._userService.getMailCajero(this.correo).then(snapshot =>
      {
        if(snapshot.empty) 
        {
          // console.log('Éxito, No hay registro del correo');
          this.usuarioFirebase = this._userService.getUserCajero(this.usuario).then(snapshot =>
          {
            if(snapshot.empty)
            {
              // console.log('Éxito, no hay registro del usuario');
              this.sendLoginCode(); //se va a la función para la verificación de dos pasos
            }
            else
            {
              this.loading = false;
              this.toastr.error('El usuario que ingresó ya existe.', 'Error!',
              {
                positionClass: 'toast-bottom-right'
              });
              return;
            }
          })
        }
        else
        {
          this.loading = false;
          this.submitted = false;
          //console.log('ERROR, el correo que ingresó ya existe');
          this.toastr.error('El correo que ingresó ya existe', 'Error!',
          {
            positionClass: 'toast-bottom-right'
          });
          return;
        }
      });
    }
    else
    {
      this.loading = false;
      this.submitted = false;
      //console.log('Ingresa la misma contraseña');
      this.toastr.error('Las contraseñas deben de ser iguales', 'Error!',
      {
        positionClass: 'toast-bottom-right'
      });
      return;
    }
  }


  agregarCajero()
  {
    if(this.inicioCon)
    {
      this.addCajeroFbGoo();
    }
    else
    {
      this.addCajeroDirecto();
    }
  }

  addCajeroDirecto()
  {
    this.encryptTelefono = this.celular;
    this.conversionEncryptNombre = CryptoJS.AES.encrypt(this.encryptNombre.trim(), this.encryptPassword.trim()).toString();
    this.conversionEncryptApellido = CryptoJS.AES.encrypt(this.encryptApellido.trim(), this.encryptPassword.trim()).toString();
    this.conversionEncryptContra = CryptoJS.AES.encrypt(this.encryptPassword.trim(), this.encryptPassword.trim()).toString();
    this.conversionEncryptTelefono = CryptoJS.AES.encrypt(this.encryptTelefono.trim(), this.encryptPassword.trim()).toString();
    const cajero: any =
    {
      Nombre: this.conversionEncryptNombre,
      Apellido: this.conversionEncryptApellido,
      Correo: this.registrarUser.value.email,
      Usuario:this.registrarUser.value.user,
      Contrasenia: this.conversionEncryptContra,
      Telefono: this.conversionEncryptTelefono,
    }
    this._userService.registrarCajero(cajero).then(() =>
    {
      this.toastr.success('Usuario agregado correctamente', 'Éxito!',
      {
        positionClass: 'toast-bottom-right'
      });
      this.loading = false;
      // this.router.navigate(['/login']);
      this._userService.setToken(this._userService.getRandomToken(16), this._userService.nuevaExpiracion(10));
      this.toastr.success('Su cuenta ha sido registrada con éxito', 'ÉXITO',{positionClass: 'toast-bottom-right'})
      this.router.navigate(['/lista']);
    })
  }

  addCajeroFbGoo()
  {
      this.encryptNombre = this.nombreUser;
      this.encryptApellido = this.lastUser;
      this.encryptTelefono = this.celular;
      this.conversionEncryptNombre = CryptoJS.AES.encrypt(this.encryptNombre.trim(), this.encryptPassword.trim()).toString();
      this.conversionEncryptApellido = CryptoJS.AES.encrypt(this.encryptApellido.trim(), this.encryptPassword.trim()).toString();
      this.conversionEncryptContra = CryptoJS.AES.encrypt(this.encryptPassword.trim(), this.encryptPassword.trim()).toString();
      this.conversionEncryptTelefono = CryptoJS.AES.encrypt(this.encryptTelefono.trim(), this.encryptPassword.trim()).toString();
      const cajero: any =
      {
        Nombre: this.conversionEncryptNombre,
        Apellido: this.conversionEncryptApellido,
        Correo: this._smoauthService.correoUser,
        Usuario:this.registrarUser.value.user,
        Contrasenia: this.conversionEncryptContra,
        Telefono: this.conversionEncryptTelefono,
      }
      this._userService.registrarCajero(cajero).then(() =>
      {
        this.toastr.success('Usuario agregado correctamente', 'Éxito!',
        {
          positionClass: 'toast-bottom-right'
        });
        this.loading = false;
        this.router.navigate(['/lista']);
      })
  }

  sendLoginCode(): void
  {
    // console.log("Entró a la función sendLoginCode()")
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.celular//`+${this.celular}`;
    // console.log("const num celular: "+num);
    // console.log("Se está enviando");
    // this.toastr.info('Enviando código de acceso...', 'Info',{positionClass: 'toast-bottom-right'})
    firebase.auth().signInWithPhoneNumber(num, appVerifier)
    .then((confirmationResult) => {
      // SMS sent. Promt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      this.windowRef.confirmationResult = confirmationResult;
      // console.log(confirmationResult);
    }).catch((error) => {
      this.loading = false;
      // console.log("ERROR")
      this.toastr.warning('Hubo problemas al enviar el código de verificación', 'Warning',{positionClass: 'toast-bottom-right'})
      // Error; SMS not sent
    });
  }

  verifyLoginCode()
  {
    // console.log("verificationCode: "+this.verificationCode);
    this.windowRef.confirmationResult
                  .confirm(this.verificationCode)
                  .then((result: {user: any;}) =>
                  {
                    this.user = result.user;
                    this.agregarCajero();
                  })
    .catch( (error: any) => {
      this.loading = false;
      this.toastr.error('El código que ingresó es incorrecto', 'Error',{positionClass: 'toast-bottom-right'})
      // console.log(error, "registro verifyLoginCode: Código incorrecto")
    });
  }

  reset()
  {
    this._smoauthService.inicioFbGoo = false;
  }


  get registrarUserControl()
  {
    return this.registrarUser.controls
  }
}