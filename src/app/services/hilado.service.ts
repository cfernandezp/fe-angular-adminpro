import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import {CargarHilado} from '../interfaces/cargar-hilados.interface';
import {catchError, delay, map, tap} from 'rxjs/operators';

import { Hilado} from '../models/hilado.model';



const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HiladoService {

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

  cargarHiladosdesde( desde : number = 0){    
    const url = `${base_url}/hilados?desde=${desde}`;
    return this.http.get <CargarHilado> (url , this.headers )
    .pipe(
      //delay(5000), 5 segundos demora
      map(resp=>{
                const hilados = resp.hilados.map(                           
                  hilado => new Hilado(hilado.nombre,hilado.siglas,hilado._id,hilado.familia,hilado.color)           
          );
        return {
          total : resp.total,
          hilados
        };
      })      
    )    
  }

  cargarHilados( desde : number = 0){
    
    const url = `${base_url}/hilados?desde=${desde}`;
    return this.http.get <CargarHilado> (url , this.headers )
    .pipe(
      //delay(5000), 5 segundos demora
      map(resp=>{
                const hilados = resp.hilados.map(           
                  hilado => new Hilado(hilado.nombre,hilado._id,hilado.siglas,hilado.familia,hilado.color)           
          );
        return {
          total : resp.total,
          hilados
        };
      })      
    )    
  }

  obtenerHiladoPorId(id : string){
    const url = `${base_url}/hilados/${id}`;
    return this.http.get(url , this.headers)
      .pipe(
        map( (resp:{ok:boolean, hilado : Hilado}) => resp.hilado )
      );
  }

  crearFamilia(hilado : Hilado){    
    const url = `${base_url}/hilados`;
    return this.http.post(url ,hilado , this.headers);      
  } 

  actualizarFamilia( hilado : Hilado){       
    const url = `${base_url}/hilados/${hilado._id}`;
    return this.http.put(url ,hilado, this.headers);      
  } 

  borrarFamilia( _id: string){        
    const url = `${base_url}/hilados/${_id}`;
    return this.http.delete(url , this.headers);      
  } 



}
