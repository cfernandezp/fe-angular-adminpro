import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, delay, map, tap} from 'rxjs/operators';
import { environment } from '../../../src/environments/environment';
import {Cargarfamilia} from '../interfaces/cargar-familias.interface';

import { Familia} from '../models/familia.model';

const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FamiliaService {

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

  cargarFamiliasdesde( desde : number = 0){
    
    const url = `${base_url}/familias?desde=${desde}`;
    return this.http.get <Cargarfamilia> (url , this.headers )
    .pipe(
      //delay(5000), 5 segundos demora
      map(resp=>{
                const familias = resp.familias.map(           
                  familia => new Familia(familia.nombre,familia._id,familia.grupo,familia.marca,familia.titulo)           
          );
        return {
          total : resp.total,
          familias
        };
      })
      
    )
    
  }

  cargarFamilias( desde : number = 0){
    
    const url = `${base_url}/familias?desde=${desde}`;
    return this.http.get <Cargarfamilia> (url , this.headers )
    .pipe(
      //delay(5000), 5 segundos demora
      map(resp=>{
        const familias = resp.familias.map( 
          familia => new Familia(familia.nombre,familia._id,familia.grupo,familia.marca,familia.titulo) 
          );
        return {
          total : resp.total,
          familias
        };
      })
    )
  }

  cargarFamiliasTodos(){    
    const url = `${base_url}/familias/todos`;
    return this.http.get(url , this.headers)
      .pipe(
        map( (resp:{ok:boolean, familias : Familia[]}) => resp.familias )
      );
  } 

  obtenerFamiliaPorId(id : string){
    const url = `${base_url}/familias/${id}`;
    return this.http.get(url , this.headers)
      .pipe(
        map( (resp:{ok:boolean, familia : Familia}) => resp.familia )
      );
  }

  crearFamilia(familia : Familia){    
    const url = `${base_url}/familias`;
    return this.http.post(url ,familia , this.headers);      
  } 

  actualizarFamilia( familia : Familia){       
    const url = `${base_url}/familias/${familia._id}`;
    return this.http.put(url ,familia, this.headers);      
  } 

  borrarFamilia( _id: string){        
    const url = `${base_url}/familias/${_id}`;
    return this.http.delete(url , this.headers);      
  } 



}
