import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit 
{

  constructor(private _userService: UsuarioService) 
  { }

  ngOnInit(): void 
  {  }

  Salir()
  {
    this._userService.Logout();
  }
}
