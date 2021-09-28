// Interfaz que servirá para conectarnos de manera regular con firestore
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibroService 
{
  constructor(private firestore: AngularFirestore) // Se inyecta el servicio de firestore --(S2-M2)
  { }

  agregarLibro(libro: any): Promise<any> // método agregar libro que recibe un objeto "libro" del tipo any, que se le provee una promesa del tipo any --(S2-M2)
  {
    return this.firestore.collection('Libros').add(libro); // insert en mySQL
  }

  getLibros(): Observable<any> // que sea accesible, interpretable
  {
    //return this.firestore.collection('Libros').snapshotChanges();
    return this.firestore.collection('Libros', ref => ref.orderBy('ISBN', 'asc')).snapshotChanges(); // select - promesa
  }

  eliminarLibro(id: string): Promise<any>
  {
    return this.firestore.collection('Libros').doc(id).delete();
  }

  getLibro(id: string): Observable<any> // "Observable" Está monitorizando cada vez que cambia & recibe una variable id del tipo string
  {
    return this.firestore.collection('Libros').doc(id).snapshotChanges(); // "snapshotChanges" devuelve un observable
  }

  actualizarLibro(id: string, data: any): Promise<any> 
  {
    return this.firestore.collection('Libros').doc(id).update(data);
  }

  ordenarAsc(columna: string): Observable<any> // que sea accesible, interpretable
  {
    return this.firestore.collection('Libros', ref => ref.orderBy(columna, 'asc')).snapshotChanges(); // select - promesa
  }
  ordenarDesc(columna: string): Observable<any>
  {
    return this.firestore.collection('Libros', ref => ref.orderBy(columna, 'desc')).snapshotChanges(); // select - promesa
  }
}

//tabnine
