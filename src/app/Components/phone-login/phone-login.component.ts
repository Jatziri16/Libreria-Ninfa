import { Component, OnInit } from '@angular/core';
import { WindowService } from 'src/app/Services/window.service';
import firebase from "firebase/app";
import "firebase/auth";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.css']
})
export class PhoneLoginComponent implements OnInit 
{
  windowRef: any;
  verificationCode!: string;
  user: any;
  terminacion!: string;
  mensaje = false;
  
  constructor(private win: WindowService,
              private _userService: UsuarioService,
              private router: Router,
              private toastr: ToastrService,){}

  ngOnInit(): void 
  {
    // console.log("PHONELOGIN: "+this._userService.cel);
    this.terminacionTel();
    this.windowRef = this.win.windowRef
    // firebase.initializeApp(environment.firebase);
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render();
    this.windowRef.confirmationResult = "";
  }

  terminacionTel()
  {
    if(this._userService.cel == "")
    {
      this.router.navigate(['/login']);
    }
    else
    {
      this.terminacion = this._userService.cel.substring(9,13);
    }
  }

  sendLoginCode(): void
  {
    // this.mensaje = true;
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this._userService.cel;
    // console.log("celular: "+num);
    // console.log("Se está enviando");
    // this.toastr.info('Enviando código de acceso...', 'Info',{positionClass: 'toast-bottom-right'})
    firebase.auth().signInWithPhoneNumber(num, appVerifier)
    .then((confirmationResult) => {
      // SMS sent. Promt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      // this.mensaje = true;
      this.windowRef.confirmationResult = confirmationResult;
      // console.log(confirmationResult);
    }).catch((error) => {
      // console.log("ERROR sendLoginCode()")
      this.toastr.warning('Hemos tenidos problemas al enviar el código de acceso', 'Warning',
      {
        positionClass: 'toast-bottom-right'
      })
      // Error; SMS not sent
    });
  }

  verifyLoginCode()
  {
    this.windowRef.confirmationResult
                  .confirm(this.verificationCode)
                  .then( (result: { user:any;}) => 
                  {
                    this.user = result.user;
                    this.good();
                  })
    .catch( (error: any) => 
    {
      this.toastr.error('Código incorrecto', 'Error!',
      {
        positionClass: 'toast-bottom-right'
      })
    });
  }

  good()
  {
    this._userService.setToken(this._userService.getRandomToken(16), this._userService.nuevaExpiracion(10));
    this.toastr.success('Acceso concedido:)', 'LOGIN',
    {
      positionClass: 'toast-bottom-right'
    })
    this.router.navigate(['/lista']);
  }
}

