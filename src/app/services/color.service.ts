import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, delay, map, tap} from 'rxjs/operators';
import { environment } from '../../../src/environments/environment'

import {CargarColor} from '../interfaces/cargar-colores.interface';

import { Color} from '../models/color.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor( private http: HttpClient) { }
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

  cargarColoresTodos(){    
    const url = `${base_url}/colores/todos`;
    return this.http.get(url , this.headers)
      .pipe(
        map( (resp:{ok:boolean, colores : Color[]}) => resp.colores )
      );
  }  

  cargarColores( desde : number = 0){
    
    const url = `${base_url}/colores?desde=${desde}`;
    return this.http.get <CargarColor> (url , this.headers )
    .pipe(
      //delay(5000), 5 segundos demora
      map(resp=>{
        const colores = resp.colores.map( 
          color => new Color(color.nombre,color._id ) 
          );
        return {
          total : resp.total,
          colores
        };
      })
    )
  }

  crearColor(nombre: string){    
    const url = `${base_url}/colores`;
    return this.http.post(url ,{nombre}, this.headers);      
  } 

  actualizarColor( _id: string, nombre: string){    
    const url = `${base_url}/colores/${_id}`;
    return this.http.put(url ,{nombre}, this.headers);      
  } 

  borrarColor( _id: string){        
    const url = `${base_url}/colores/${_id}`;
    return this.http.delete(url , this.headers);      
  } 

}

