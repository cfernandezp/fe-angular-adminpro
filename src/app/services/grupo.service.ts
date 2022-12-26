import { Injectable } from '@angular/core';
import { environment } from '../../../src/environments/environment';
import {catchError, delay, map, tap} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {CargarGrupo} from '../interfaces/cargar-grupos.interface';

import { Grupo} from '../models/grupo.model';


const base_url= environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  constructor( private http: HttpClient ) { }
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

  cargarGruposdesde( desde : number = 0){
    
    const url = `${base_url}/grupos?desde=${desde}`;
    return this.http.get <CargarGrupo> (url , this.headers )
    .pipe(
      //delay(5000), 5 segundos demora
      map(resp=>{
        const grupos = resp.grupos.map( 
          grupo => new Grupo(grupo.nombre,grupo._id ) 
          );
        return {
          total : resp.total,
          grupos
        };
      })
    )
  }

    cargarGruposTodos(){    
    const url = `${base_url}/grupos/todos`;
    return this.http.get(url , this.headers)
      .pipe(
        map( (resp:{ok:boolean, grupos : Grupo[]}) => resp.grupos )
      );
  }  



  crearGrupo(nombre: string){    
    const url = `${base_url}/grupos`;
    return this.http.post(url ,{nombre}, this.headers);      
  } 

  actualizarGrupo( _id: string, nombre: string){    
    const url = `${base_url}/grupos/${_id}`;
    return this.http.put(url ,{nombre}, this.headers);      
  } 

  borrarGrupo( _id: string){        
    const url = `${base_url}/grupos/${_id}`;
    return this.http.delete(url , this.headers);      
  } 


}
