import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, delay, map, tap} from 'rxjs/operators';
import { environment } from '../../../src/environments/environment'
import {CargarMarca} from '../interfaces/cargar-marcas.interface';

import { Marca} from '../models/marca.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  constructor( private http: HttpClient ) {  }

  get token() : string {
    return localStorage.getItem('token') || '';
  }

  get headers (){
    return {
      headers:{
        'x-token' : this.token
      }
    }
  }

  cargarMarcasdesde( desde : number = 0){
    
    const url = `${base_url}/marcas?desde=${desde}`;
    return this.http.get <CargarMarca> (url , this.headers )
    .pipe(
      //delay(5000), 5 segundos demora
      map(resp=>{
        const marcas = resp.marcas.map( 
          marca => new Marca(marca.nombre,marca._id ) 
          );
        return {
          total : resp.total,
          marcas
        };
      })
    )
  }

  cargarMarcasTodos(){    
    const url = `${base_url}/marcas/todos`;
    return this.http.get(url , this.headers)
      .pipe(
        map( (resp:{ok:boolean, marcas : Marca[]}) => resp.marcas )
      );
  }  

  crearMarca(nombre: string){    
    const url = `${base_url}/marcas`;
    return this.http.post(url ,{nombre}, this.headers);      
  } 

  actualizarMarca( _id: string, nombre: string){    
    const url = `${base_url}/marcas/${_id}`;
    return this.http.put(url ,{nombre}, this.headers);      
  } 

  borrarMarca( _id: string){        
    const url = `${base_url}/marcas/${_id}`;
    return this.http.delete(url , this.headers);      
  } 

}
