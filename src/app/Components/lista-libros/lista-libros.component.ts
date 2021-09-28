import { Component, OnInit, ViewChild } from '@angular/core';
//import { AngularFirestore } from '@angular/fire/firestore';
//import { Observable } from 'rxjs';
import { LibroService } from 'src/app/Services/libro.service';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-lista-libros',
  templateUrl: './lista-libros.component.html',
  styleUrls: ['./lista-libros.component.css']
})
export class ListaLibrosComponent implements OnInit 
{
  libros: any[] = []; // coleccion de libros tipo any que se inicializa vacia
  isbn: number;
  genero: number;
  titulo: number;
  autor: number;
  precio: number;
  editorial: number;
  
  constructor(private _libroService:LibroService,
              private _userService: UsuarioService,
              private toastr: ToastrService) //****Buscar convencion
  { 
    //this.items = firestore.collection('Libros').valueChanges();
    //console.log(this.items) 
    this.isbn = 1;
    this.genero = 0;
    this.titulo = 0;
    this.autor = 0;
    this.precio = 0;
    this.editorial = 0;
  }
  
  ngOnInit(): void 
  {
    this.renovarToken();
    this.getLibros();
  }
  
  getLibros()
  {
    this._libroService.getLibros().subscribe(data=> 
    {
      //console.log(data);
      this.libros = [];
      
      data.forEach((element: any) =>  
      {
        // console.log(element.payload.doc.id);         //id de los documentos
        // console.log(element.payload.doc.data());     // Contenido del documento
        
        // Aquí trae todos lo datos de firestore, a parte nosotros agregamos el id manualmente ya que esto no lo incluía y lo necesitaremos.
        this.libros.push //metodo push de los libros, tomar el registro del doc actual y hacerle push
        ({
          id: element.payload.doc.id,     // Guarda el id
          ...element.payload.doc.data()   //"...": spread operator (operador de dispersion).- agarra todos los elementos dentro del array
        })
      })
      //console.log(this.libros);
    })
  }

  ordenarLista(campo: string) 
  {
    switch (campo)
    {
      case 'i': 
        this.ordenarISBN();
        break;

      case 'g':
        this.ordenarGenero();
        break;

      case 't':
        this.ordenarTitulo();
        break;

      case 'a':
        this.ordenarAutor();
        break;

      case 'p':
        this.ordenarPrecio();
        break;

      case 'e':
        this.ordenarEditorial();
        break;
    }
  }

  eliminarLibro(id: string)
  {
    this._libroService.eliminarLibro(id).then(()=>{
      this.toastr.error('El libro fue eliminado con éxito', 'Registro eliminado',
      {
        positionClass: 'toast-bottom-right'
      })
    }).catch(error => {
      console.log(error);
    })
  }

  ordenarISBN()
  {
    this.genero = 0;
    this.titulo = 0;
    this.autor = 0;
    this.precio = 0;
    this.editorial = 0;
    if (this.isbn == 0 || this.isbn == 2)
    {
      this.isbn = 1;
      this._libroService.ordenarAsc('ISBN').subscribe(data=> 
      {
        this.libros = [];
        data.forEach((element: any) =>  
        {
          this.libros.push 
          ({
            id: element.payload.doc.id,  
            ...element.payload.doc.data()   
          })
        })
      })
    }
    else
    {
      this.isbn = 2;
      this._libroService.ordenarDesc('ISBN').subscribe(data=> 
      {
        this.libros = [];
        data.forEach((element: any) =>  
        {
          this.libros.push //metodo push de los libros, tomar el registro del doc actual y hacerle push
          ({
            id: element.payload.doc.id,     // Guarda el id
            ...element.payload.doc.data()   //"...": spread operator (operador de dispersion).- agarra todos los elementos dentro del array
          })
        })
      })
    }
  }

  ordenarGenero()
  {
    this.isbn = 0;
    this.titulo = 0;
    this.autor = 0;
    this.precio = 0;
    this.editorial = 0;
    if (this.genero == 0 || this.genero == 2)
    {
      this.genero = 1;
      this._libroService.ordenarAsc('Genero').subscribe(data=> 
      {
        this.libros = [];
        data.forEach((element: any) =>  
        {
          this.libros.push 
          ({
            id: element.payload.doc.id,  
            ...element.payload.doc.data()   
          })
        })
      })
    }
    else
    {
      this.genero = 2;
      this._libroService.ordenarDesc('Genero').subscribe(data=> 
      {
        this.libros = [];
        data.forEach((element: any) =>  
        {
          this.libros.push 
          ({
            id: element.payload.doc.id,  
            ...element.payload.doc.data()   
          })
        })
      })
    }
  }

  ordenarTitulo()
  {
    this.isbn = 0;
    this.genero = 0;
    this.autor = 0;
    this.precio = 0;
    this.editorial = 0;
    if (this.titulo == 0 || this.titulo == 2)
    {
      this.titulo = 1;
      this._libroService.ordenarAsc('Titulo').subscribe(data=> 
      {
        this.libros = [];
        data.forEach((element: any) =>  
        {
          this.libros.push 
          ({
            id: element.payload.doc.id,  
            ...element.payload.doc.data()   
          })
        })
      })
    }
    else
    {
      this.titulo = 2;
      this._libroService.ordenarDesc('Titulo').subscribe(data=> 
      {
        this.libros = [];
        data.forEach((element: any) =>  
        {
          this.libros.push 
          ({
            id: element.payload.doc.id,  
            ...element.payload.doc.data()   
          })
        })
      })
    }
  }

  ordenarAutor()
  {
    this.isbn = 0;
    this.genero = 0;
    this.titulo = 0;
    this.precio = 0;
    this.editorial = 0;
    if (this.autor == 0 || this.autor == 2)
    {
      this.autor = 1;
      this._libroService.ordenarAsc('Autor').subscribe(data=> 
      {
        this.libros = [];
        data.forEach((element: any) =>  
        {
          this.libros.push 
          ({
            id: element.payload.doc.id,  
            ...element.payload.doc.data()   
          })
        })
      })
    }
    else
    {
      this.autor = 2;
      this._libroService.ordenarDesc('Autor').subscribe(data=> 
      {
        this.libros = [];
        data.forEach((element: any) =>  
        {
          this.libros.push 
          ({
            id: element.payload.doc.id,  
            ...element.payload.doc.data()   
          })
        })
      })
    }
  }

  ordenarPrecio()
  {
    this.isbn = 0;
    this.genero = 0;
    this.titulo = 0;
    this.autor = 0;
    this.editorial = 0;
    if (this.precio == 0 || this.precio == 2)
    {
      this.precio = 1;
      this._libroService.ordenarAsc('Precio').subscribe(data=> 
      {
        this.libros = [];
        data.forEach((element: any) =>  
        {
          this.libros.push 
          ({
            id: element.payload.doc.id,  
            ...element.payload.doc.data()   
          })
        })
      })
    }
    else
    {
      this.precio = 2;
      this._libroService.ordenarDesc('Precio').subscribe(data=> 
      {
        this.libros = [];
        data.forEach((element: any) =>  
        {
          this.libros.push 
          ({
            id: element.payload.doc.id,  
            ...element.payload.doc.data()   
          })
        })
      })
    }
  }

  ordenarEditorial()
  {
    this.isbn = 0;
    this.genero = 0;
    this.titulo = 0;
    this.autor = 0;
    this.precio = 0;
    if (this.editorial == 0 || this.editorial == 2)
    {
      this.editorial = 1;
      this._libroService.ordenarAsc('Editorial').subscribe(data=> 
      {
        this.libros = [];
        data.forEach((element: any) =>  
        {
          this.libros.push 
          ({
            id: element.payload.doc.id,  
            ...element.payload.doc.data()   
          })
        })
      })
    }
    else
    {
      this.editorial = 2;
      this._libroService.ordenarDesc('Editorial').subscribe(data=> 
      {
        this.libros = [];
        data.forEach((element: any) =>  
        {
          this.libros.push 
          ({
            id: element.payload.doc.id,  
            ...element.payload.doc.data()   
          })
        })
      })
    }
  }

  renovarToken()
  {
    this._userService.renovacionToken();
  }
}


