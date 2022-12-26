import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, delay, map, tap} from 'rxjs/operators';
import { environment } from '../../environments/environment'
import { CargarTitulo } from '../interfaces/cargar-titulos.interface';
import { Titulo } from '../models/titulo.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TituloService {

  constructor(private http: HttpClient) { }
  
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

  cargarTitulosdesde( desde : number = 0){
    
    const url = `${base_url}/titulos?desde=${desde}`;
    return this.http.get <CargarTitulo> (url , this.headers )
    .pipe(
      //delay(5000), 5 segundos demora
      map(resp=>{
        const titulos = resp.titulos.map( 
          titulo => new Titulo(titulo.nombre,titulo._id ) 
          );
        return {
          total : resp.total,
          titulos
        };
      })
    )
  }

  cargarTitulosTodos(){    
    const url = `${base_url}/titulos/todos`;
    return this.http.get(url , this.headers)
      .pipe(
        map( (resp:{ok:boolean, titulos : Titulo[]}) => resp.titulos )
      );
  }  

  crearTitulo(nombre: string){    
    const url = `${base_url}/titulos`;
    return this.http.post(url ,{nombre}, this.headers);      
  } 

  actualizarTitulo( _id: string, nombre: string){    
    const url = `${base_url}/titulos/${_id}`;
    return this.http.put(url ,{nombre}, this.headers);      
  } 

  borrarTitulo( _id: string){        
    const url = `${base_url}/titulos/${_id}`;
    return this.http.delete(url , this.headers);      
  }  


}
