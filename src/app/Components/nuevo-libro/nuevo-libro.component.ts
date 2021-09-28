import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; // FormGroup
import { LibroService } from 'src/app/Services/libro.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-nuevo-libro',
  templateUrl: './nuevo-libro.component.html',
  styleUrls: ['./nuevo-libro.component.css']
})
export class NuevoLibroComponent implements OnInit 
{
  createLibro: FormGroup;   // Array / variable del tipo FormGroup --(S2-M2)
  paloma: FormGroup;        // FormGroup Paloma (checkbox)
  otroBook = false;         // html checkbox
  masLibro = true;          // Controla el si se mestra el checkbox o no
  submitted = false;        // Controla el estado del formulario ("booleano") --(S2-M2)
  loading = false;
  loading1 = true;

  id: string | null;        //variable (editlibro), puede ser de 2 tipos: string o null.
  titulo = "Agregar Libro";
  mostrarActualizar = false;
  agregarLimpio = false;
  tituloBoton = "Agregar";

  constructor (private fb:FormBuilder,                // Variable fb --(S2-M2)
               private _libroService: LibroService,   // Se inyecta el servicio. Variable "_libroService" del tipo LibroService
               private _userService: UsuarioService,
               private router: Router, 
               private toastr: ToastrService,
               private aRoute: ActivatedRoute)
  { 
    this.createLibro = this.fb.group  // Variable que ya se creó, esto para utilizar los Reactives Forms --(S2-M2)
    ({
      // VALIDACIONES DE LAS PROPIEDADES: --(S2-M2)
      // Propiedad: ['valor default', Validaciones]
      // *$ -> cierre del validador
      ISBN: ['', [Validators.required, Validators.pattern("^[0-9-]*$")]],     // Que no esté vacio, solo valores del 0-9 y "-"
      Genero: ['', Validators.required], // Que no esté vacio
      Autor: ['', Validators.required],
      Titulo: ['', Validators.required],
      Editorial: ['', Validators.required],
      Precio: ['', [Validators.required, Validators.pattern("^[0-9.,]*$")]]   // Que no esté vacio, solo valores del 0-9, "." y ","
    })

    // EDITAR
    this.id = this.aRoute.snapshot.paramMap.get('id'); // 'id': Nombre del parámetro que se va a recibir, es dif al que se declaró en este .ts (app.module.ts -33)
    //console.log(this.id);

    // checkBox
    this.paloma = new FormGroup
    ({
      otroL: new FormControl()
    });
  }

  ngOnInit(): void 
  {
    this.renovarToken();
    this.agregarEditarLibro();
  }

  agregarEditarLibro()
  {
    if (this.id == null) 
    {
      if (this.agregarLimpio)
      {
        this.agregarLibro();
      }
      this.agregarLimpio = true;
    }
    else
    {
      if (!this.mostrarActualizar)
      {
        this.editarMostrarLibro(this.id);
      }
      else
      {
        this.updateLibro(this.id);
      }
    }
  }

  // Método que se invoca desde HTML
  agregarLibro()
  {
    this.loading = true;
    this.submitted = true;  // "true" ya que ya se lanzó el método
    //console.log(this.createLibro); 
    if (this.createLibro.invalid)
    {
      //console.log(this.otroBook); 
      this.loading = false;
      this.loading1 = true;
      return;
    }
    else
    { 
      this.loading1 = false;
      const libro: any =    // constante "libro" del tipo any
      {
        // Extrae los valores / se toman del DOM
        ISBN: this.createLibro.value.ISBN, 
        Genero: this.createLibro.value.Genero,
        Autor: this.createLibro.value.Autor,
        Titulo: this.createLibro.value.Titulo,
        Editorial: this.createLibro.value.Editorial,
        Precio: this.createLibro.value.Precio,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      }
      this._libroService.agregarLibro(libro).then(() =>   // invoca el método y lo agrega
      {
        this.toastr.success('El libro fue capturado exitosamente!', 'Exito!',
        {
          positionClass: 'toast-bottom-right'
        });
        //console.log("Libro Registrado con exito!");
        this.loading = false;
        this.loading1 = true;

        if (this.otroBook)
        {
          // Refrescar la página
          this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/nuevo']); //Your actualComponent
          });
        }
        else
        {
          this.router.navigate(['/lista']);
        }
        //console.log(this.otroBook); 
      }).catch(error => {     // en caso de que exista un error se ejecutará ésto
        this.loading = false;
        this.loading1 = true;
        //console.log(error);
      })
    }
    //console.log(this.createLibro)
  }

  editarMostrarLibro(id: string)
  {
    this.loading = true;
    this.titulo = "Editar Libro";  
    this.tituloBoton = "Actualizar libro";
    this.masLibro = false;  // No muestra el checkbox de "agregar otro libro"
    this._libroService.getLibro(id).subscribe(data => { // "_" COC (Convention Over Configuration) no debe ser accedida fuera de la clase
      //console.log(data.payload.data()['Titulo']);
      // Acede a cada uno de los datos de firestore individualmente, y le asigna el valor de ese dato al del html para que se muestre.
      this.createLibro.setValue({
        ISBN: data.payload.data()['ISBN'],
        Genero: data.payload.data()['Genero'],
        Autor: data.payload.data()['Autor'],
        Titulo: data.payload.data()['Titulo'],
        Editorial: data.payload.data()['Editorial'],
        Precio: data.payload.data()['Precio'],
      })
    })
    this.loading = false;
    this.mostrarActualizar = true;
  }

  updateLibro(id: string)
  {
    const libro: any =    // constante "libro" del tipo any
    {
      // Extrae los valores / se toman del DOM
      ISBN: this.createLibro.value.ISBN, 
      Genero: this.createLibro.value.Genero,
      Autor: this.createLibro.value.Autor,
      Titulo: this.createLibro.value.Titulo,
      Editorial: this.createLibro.value.Editorial,
      Precio: this.createLibro.value.Precio,
      fechaActualizacion: new Date(),
    }
    this._libroService.actualizarLibro(id, libro).then(() => {
      this.loading = false;

      this.toastr.info('El libro fue modificado con exito', 'Libro modificado',
      {
        positionClass: 'toast-bottom-right'
      });
    })
    this.mostrarActualizar = false;
    this.router.navigate(['/lista']);
  }

  renovarToken()
  {
    this._userService.renovacionToken();
  }
  
  get createLibroControl()
  {
    return this.createLibro.controls
  }
}